var $ = require('jquery'),
    _ = require('lodash'),
    logger = require('modules/logger'),
    moment = require('moment'),
    agendaEventsTemplate = require('../partials/agenda-events.html'),
    eventItemTemplate = require('../partials/event-item.html');

/**
 * Agenda
 * @param {object} options
 */
var Agenda = function Agenda(options) {
    var self = this;
    self.options = options ? options : {};

    self.dayRangeStart = moment().hours(9).minutes(0);
    self.dayRangeEnd = moment().hours(21).minutes(0);

    // expect a non empty jQuery object to setup day view
    if (!(self.options.view instanceof $)) {
        // TODO: display some visual error, even if not required
        logger.error('tried to instantiate without proper view');
    } else {
        self.$view = self.options.view;

        // initialize our DOM partials, keep a reference to them
        self.$eventsTemplate = $(agendaEventsTemplate);
        self.$eventsEl = self.$eventsTemplate.find('.events').hide();

        // initialize the view
        self._initView();
    }
};

/**
 * this function will initialize our day view, setting up scaffolding and common
 * elements that shouldn't change outside of CSS media queries
 *
 * TODO: break this down into more separated chunks
 */
Agenda.prototype._initView = function _initView() {
    var currentTime, self = this;

    // TODO: should probably break this label setup into a separate function
    // clone a moment at the set dayRangeStart
    currentTime = moment(self.dayRangeStart);

    // build our time labels and position accordingly
    while(!(currentTime.isAfter(self.dayRangeEnd))) {
        var $labelEl = $('<div class="time-label"></div>');
        $labelEl.text(currentTime.format('h:mm'));
        $labelEl.css('top', self._calculatePercentageInDayRange(currentTime) + '%');

        if(currentTime.minutes() === 0) {
            $labelEl.addClass('top-of-hour');
            $labelEl.append($('<span class="meridiem">').text(currentTime.format('A')));
        }

        // attach to the labels template
        self.$eventsTemplate.append($labelEl);

        // advance our time 30 minutes, assuming that our range started/ended on
        // the top or middle of the hour
        currentTime.add(30, 'm');
    }

    // append the view templates to the view
    self.$view.append(self.$eventsTemplate);
};

/**
 * This function takes in an array of event objects {start: Number, end: Number},
 * and renders them to the view.
 * @param {array} events an array of objects in the format {start: Number, end: Number}
 */
Agenda.prototype.renderEvents = function renderEvents(events) {
    var sortedEvents, self = this;

    // sort the events by start time
    sortedEvents = events.sort(self._compareEvents());

    // process the event information for layout
    self._processEvents(sortedEvents);
    sortedEvents = []; // garbage collect

    // show the events
    self.$eventsEl.show();
};

/**
 * Takes in a sorted list of events, and processes the events into the internal
 * segment(interval) tree
 * @param {array} events
 */
Agenda.prototype._processEvents = function _processEvents(events) {
    var self = this;

    var clusters = [];

    _.forEach(events, function(event, index) {
        var insertedInCluster = false;

        // find a cluster for it to go in
        _.forEach(clusters, function(cluster) {
            var colNum = 0, insertedInCol = false, member;

            if (event.start <= cluster.clusterEnd) {
                // belongs in this cluster
                member = {
                    eventIndex: index,
                    col: 0
                };

                // find the right column for this event
                _.forEach(cluster.cols, function(col) {
                    if (event.start > col.colEnd) {
                        member.col = colNum;
                        col.members.push(member);
                        col.colEnd = event.end;
                        insertedInCol = true;
                        return false; //break
                    }
                    colNum++;
                });

                // no where for it to go in current columns, put it in a new one
                if (!insertedInCol) {
                    member.col = colNum;

                    cluster.cols.push({
                        members: [member],
                        colEnd: event.end
                    });

                    insertedInCol = true;
                }

                // update max end time for this cluster if necessary
                if (event.end > cluster.clusterEnd && insertedInCol) {
                    cluster.clusterEnd = event.end;
                }

                insertedInCluster = true;
                return false;
            }
        });

        // add the first event to it's own cluster, or if no cluster was found,
        // add it to a new one
        if (index === 0 || !insertedInCluster) {
            if (index === 0) { logger.info('first one'); }
            clusters.push({
                cols: [{
                    members: [{
                        eventIndex: index,
                        col: 0
                    }],
                    colEnd: event.end
                }],
                clusterEnd: event.end
            });
        }
    });

    logger.info('clusters:', clusters);

    self._positionEvents(events, clusters);

    clusters = []; // garbage collect
};

/**
 * This function takes in an events area and cluster information and creates
 * a DOM element for each and positions them in the view.
 * @param {object} event {from: Number, to: Number, id: Number, overlap: Array}
 */
Agenda.prototype._positionEvents = function _positionEvents(events, clusters) {
    var $eventItemEl, eventStart, eventEnd, elLeft, elRight, self = this;

    _.forEach(clusters, function(cluster) {

        _.forEach(cluster.cols, function(col) {

            _.forEach(col.members, function(member) {
                // for the event of data coming in on each event, you could use the following
                // to dynamically compile templates for each
                $eventItemEl = $(eventItemTemplate);
                $eventItemEl.attr('id', 'event' + member.eventIndex);
                $eventItemEl.find('.title').text('Sample Item');
                $eventItemEl.find('.location').text('Sample Location');

                // add the amount of minutes from our event to the dayRangeStart to get the
                // event time
                eventStart = moment(self.dayRangeStart).add(events[member.eventIndex].start, 'm');
                eventEnd = moment(self.dayRangeStart).add(events[member.eventIndex].end, 'm');

                // since there are no overlaps, take up full space
                $eventItemEl.css('top', self._calculatePercentageInDayRange(eventStart) + '%');
                $eventItemEl.css('bottom', self._calculatePercentageInDayRange(eventEnd, 'bottom') + '%');

                elLeft = (member.col / cluster.cols.length) * 100;
                elRight = ((member.col + 1) / cluster.cols.length) * 100;

                // position
                $eventItemEl.css('left', elLeft + '%');
                $eventItemEl.css('right', Math.abs(elRight - 100) + '%');

                // add the event to the events container
                self.$eventsEl.append($eventItemEl);
            });


        });

    });


};

/**
 * Will clear any current events out of the events container.
 */
Agenda.prototype._clearEvents = function _clearEvents() {
    var self = this;
    self.$eventsEl.hide(); // take it out of the render tree
    self.$eventsEl.empty();
};

/**
 * This function is used to calculate the percentage within the currently set day
 * range a given time falls.  Assumes the time is between dayRangeStart and
 * dayRangeEnd.
 *
 * @param {moment} time a moment object set to a specific time
 * @param {string} direction
 */
Agenda.prototype._calculatePercentageInDayRange = function _calculatePercentageInDayRange(time, direction) {
    var dayRangeDiffInMs, diff, self = this;
    direction = direction || 'top'; // percentage from top or bottom of range

    // get the difference between the start and end time, for use in precise
    // positioning of elements
    dayRangeDiffInMs = Math.abs(self.dayRangeStart.diff(self.dayRangeEnd));
    diff = Math.abs(parseFloat(self.dayRangeStart.diff(time) / dayRangeDiffInMs));

    if (direction === 'bottom') {
        // subtract from 100 to get percentage from bottom
        return 100 - (diff * 100);
    } else {
        return diff * 100;
    }
};

/**
 * this is a generic comparator for sorting the calendar event objects
 * @param {string} property
 */
Agenda.prototype._compareEvents = function _compareEvents() {
    return function(a,b) {
        if (a.start > b.start) {
            return 1;
        }
        if (a.start < b.start) {
            return -1;
        }
        return 0;
    };
};

module.exports = Agenda;
