var $ = require('jquery'),
    _ = require('lodash'),
    logger = require('modules/logger'),
    moment = require('moment'),
    intervalQuery = require('interval-query'),
    dayViewEventsTemplate = require('../partials/day-view-events.html');
    eventItemTemplate = require('../partials/event-item.html');

/**
 * DayView
 * @param {object} options
 */
var DayView = function DayView(options) {
    var self = this;
    self.options = options ? options : {};

    // TODO: make this range configurable, even if not required
    self.dayRangeStart = moment().hours(9).minutes(0);
    self.dayRangeEnd = moment().hours(21).minutes(0);

    // get the difference between the start and end time, for use in precise
    // positioning of elements
    self.dayRangeDiffInMs = self.dayRangeStart.diff(self.dayRangeEnd);

    // Keep an array of hashes of what's in each display column, so we know how
    // to position things properly.
    // We'll start off with one column since we know there will be at least one
    self.columns = [{}];

    // set up our internal interval/segment tree
    self.tree = new intervalQuery.SegmentTree();
    self.intervals = [];

    // expect a non empty jQuery object to setup day view
    if (!(self.options.view instanceof $)) {
        // TODO: display some visual error, even if not required
        logger.error('tried to instantiate without proper view');
    } else {
        self.view = self.options.view;

        // initialize our DOM partials, keep a reference to them
        self.eventsTemplate = $(dayViewEventsTemplate);
        self.eventsEl = self.eventsTemplate.find('.events').hide();

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
DayView.prototype._initView = function _initView() {
    var currentTime, self = this;

    // TODO: should probably break this label setu into a separate function
    // clone a moment at the set dayRangeStart
    currentTime = moment(self.dayRangeStart);

    // build our time labels and position accordingly
    while(!(currentTime.isAfter(self.dayRangeEnd))) {
        var labelEl = $('<div class="time-label"></div>');
        labelEl.text(currentTime.format('h:mm'));
        labelEl.css('top', self._calculatePercentageInDayRange(currentTime) + '%');

        if(currentTime.minutes() === 0) {
            labelEl.addClass('top-of-hour');
            labelEl.append($('<span class="meridiem">').text(currentTime.format('A')));
        }

        // attach to the labels template
        self.eventsTemplate.append(labelEl);

        // advance our time 30 minutes, assuming that our range started/ended on
        // the top or middle of the hour
        currentTime.add(30, 'm');
    }

    // append the view templates to the view
    self.view.append(self.eventsTemplate);
};

/**
 * This function is used to calculate the percentage within the currently set day
 * range a given time falls.  Assumes the time is between dayRangeStart and
 * dayRangeEnd.
 *
 * @param {moment} time a moment object set to a specific time
 * @param {string} direction
 */
DayView.prototype._calculatePercentageInDayRange = function _calculatePercentageInDayRange(time, direction) {
    var diff, self = this;
    direction = direction || 'top'; // percentage from top or bottom of range

    diff = parseFloat(self.dayRangeStart.diff(time) / self.dayRangeDiffInMs);

    if (direction === 'bottom') {
        // subtract from 100 to get percentage from bottom
        return 100 - (diff * 100);
    } else {
        return diff * 100;
    }
};

/**
 * This function takes in an interval(event) object, creates
 * a DOM element and positions it in the view.
 * @param {object} event {from: Number, to: Number, id: Number, overlap: Array}
 */
DayView.prototype._positionEvent = function _positionEvent(event) {
    var eventItemEl, eventTime, percentageFromTop, self = this;

    // for the event of data coming in on each event, you could use the following
    // to dynamically compile templates for each
    eventItemEl = $(eventItemTemplate);
    eventItemEl.attr('id', 'event' + event.id.toString());
    eventItemEl.find('.title').text('Sample Item');
    eventItemEl.find('.location').text('Sample Location');

    // add the amount of minutes from our event to the dayRangeStart to get the
    // event time
    eventStart = moment(self.dayRangeStart).add(event.from, 'm');
    eventEnd = moment(self.dayRangeStart).add(event.to, 'm');

    // since there are no overlaps, take up full space
    eventItemEl.css('top', self._calculatePercentageInDayRange(eventStart) + '%');
    eventItemEl.css('bottom', self._calculatePercentageInDayRange(eventEnd, 'bottom') + '%');

    // add the event to the events container
    self.eventsEl.append(eventItemEl);
};

/**
 * This function takes in an array of event objects {start: Number, end: Number},
 * and renders them to the view.
 * @param {array} events an array of objects in the format {start: Number, end: Number}
 */
DayView.prototype.renderEvents = function renderEvents(events) {
    var iCount, intervals, sortedEvents, self = this;

    // clear out any current events
    self._clearEvents();

    // sort the events by start time
    sortedEvents = events.sort(self._compareEvents('start'));

    // process the event information for layout
    self._processEvents(sortedEvents);

    // let's loop through our structures and display some events
    // first, let's just add our all items to the display
    iCount = self.intervals.length;
    for(var i = 0; i < iCount; ++i) {
        self._positionEvent(self.intervals[i]);
    }

    // next, let's adjust events positioning to make sure they are properly aligned
    // to the column they should be in
    //
    // var cCount = self.columns.length;
    // for (var i = 0; i < cCount; ++i) {
    //
    //
    //
    // }


    logger.info(self.columns);

    // show the events
    self.eventsEl.show();
};

/**
 * Takes in a sorted list of events, and processes the events into the internal
 * segment(interval) tree
 * @param {array} events
 */
DayView.prototype._processEvents = function _processEvents(events) {
    var eCount = events.length, iCount, self = this;

    for(var eIndex = 0; eIndex < eCount; ++eIndex) {
        self.tree.pushInterval(events[eIndex].start, events[eIndex].end);
    }
    self.tree.buildTree();

    // get the intervals and overlap info from the tree
    self.intervals = self.tree.queryOverlap();
    iCount = self.intervals.length;
    logger.info(self.intervals);

    // build a column structure so we know how to position events properly
    // since there are overlaps, throw it in the column where it doesn't overlap

    for(var intervalIndex = 0; intervalIndex < iCount; ++intervalIndex) {
        var interval = self.intervals[intervalIndex];
        var currentColumn = 0;
        var cCount = self.columns.length;
        var inserted = false;


        while (!inserted) {
            var hasOverlaps = false;

            // if currentColumn doesn't exist, obviously we got to a point where
            // we need to create a new column and add the item

            if (currentColumn > cCount-1) {
                self.columns.push({});
                self.columns[currentColumn][interval.id.toString()] = true;
                inserted = true;
            } else {
                // check if any overlaps exist in this column
                var oCount = interval.overlap.length;
                for (var k = 0; k < oCount; ++k) {
                    // check to see if column contains any of this events overlaps
                    if(self.columns[currentColumn].hasOwnProperty(interval.overlap[k].toString())) {
                        hasOverlaps = true;
                        break;
                    }
                }

                if(!hasOverlaps) {
                    self.columns[currentColumn][interval.id.toString()] = true;
                    inserted = true;
                } else {
                    // no overlaps and no insertion, move to next column
                    currentColumn++;
                }
            }
        }
    }
};

/**
 * Will clear any current events out of the events container.
 */
DayView.prototype._clearEvents = function _clearEvents() {
    var self = this;
    self.columns = [{}]; // garbage collect
    self.intervals = []; // garbage collect
    self.eventsEl.hide();
    self.eventsEl.empty();
    self.tree.clearIntervalStack();
};

/**
 * this is a generic comparator for sorting the calendar event objects
 * @param {string} property
 */
DayView.prototype._compareEvents = function _compareEvents(property) {
    return function(a,b) {
        if (a[property] > b[property]) {
            return 1;
        }
        if (a[property] < b[property]) {
            return -1;
        }
        return 0;
    };
};


module.exports = DayView;
