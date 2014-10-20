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
    self.dayRangeDiffInMs = Math.abs(self.dayRangeStart.diff(self.dayRangeEnd));

    // set up our internal interval/segment tree
    self.tree = new intervalQuery.SegmentTree();
    self.intervals = [];

    // after playing with more data, I realized that overlaps should be in their
    // own group/cluster, so you can use a uniform amount of columns to chop them
    // all up per group.  So intead, let's make an array of these groups.
    self.overlapGroups = [];

    // expect a non empty jQuery object to setup day view
    if (!(self.options.view instanceof $)) {
        // TODO: display some visual error, even if not required
        logger.error('tried to instantiate without proper view');
    } else {
        self.$view = self.options.view;

        // initialize our DOM partials, keep a reference to them
        self.$eventsTemplate = $(dayViewEventsTemplate);
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
DayView.prototype._initView = function _initView() {
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

    diff = Math.abs(parseFloat(self.dayRangeStart.diff(time) / self.dayRangeDiffInMs));

    if (direction === 'bottom') {
        // subtract from 100 to get percentage from bottom
        return 100 - (diff * 100);
    } else {
        return diff * 100;
    }
};

/**
 * This function takes in an interval(event) object, creates
 * a DOM element and positions it in the view (VERTICALLY).
 * @param {object} event {from: Number, to: Number, id: Number, overlap: Array}
 */
DayView.prototype._positionEvent = function _positionEvent(event) {
    var $eventItemEl, eventTime, percentageFromTop, self = this;

    // for the event of data coming in on each event, you could use the following
    // to dynamically compile templates for each
    $eventItemEl = $(eventItemTemplate);
    $eventItemEl.attr('id', 'event' + event.id.toString());
    $eventItemEl.find('.title').text('Sample Item');
    $eventItemEl.find('.location').text('Sample Location');

    // add the amount of minutes from our event to the dayRangeStart to get the
    // event time
    eventStart = moment(self.dayRangeStart).add(event.from, 'm');
    eventEnd = moment(self.dayRangeStart).add(event.to, 'm');

    // since there are no overlaps, take up full space
    $eventItemEl.css('top', self._calculatePercentageInDayRange(eventStart) + '%');
    $eventItemEl.css('bottom', self._calculatePercentageInDayRange(eventEnd, 'bottom') + '%');

    // add the event to the events container
    self.$eventsEl.append($eventItemEl);
};

/**
 * remove overlaps by adjusting elements position.left and position.right accordingly
 */
DayView.prototype._removeOverlaps = function _removeOverlaps() {
    var self = this;

    _.forEach(self.overlapGroups, function(group) {
        var sortedMembers, membersTouched = {};

        // only process columns for groups with more than one item
        if (_.size(group.members) > 1) {
            // get a sorted list of members based on the column they are in
            sortedMembers = _.chain(group.members)
                                    .map(function(member, index) { return { id: index, column: member.column }; })
                                    .sortBy('column')
                                    .value();

            // position left/right based on column/total columns, from right to
            // left, essentially pushing items to the left as necessary
            _.forEachRight(sortedMembers, function(member, index) {
                var elLeft, overlap;

                // if we are on column 0, we should never have to touch these
                // moving right to left, asthey will already have been positioned
                if (member.column === 0) {
                    return true;
                }

                elLeft = parseFloat((member.column / group.columns) * 100);

                // position
                $('#event' + member.id).css('left', elLeft + '%');

                // consider this member touched, so we don't step backwards whilst
                // pushing columns to the left
                membersTouched[member.id] = true;

                // if it overlaps with other events, position their right with this
                // $el's left
                overlap = self.intervals[member.id].overlap;
                if (overlap.length > 0) {
                    _.forEachRight(overlap, function(overlapId) {
                        if(!membersTouched[overlapId]) {
                                $('#event' + overlapId).css('right', Math.abs(elLeft - 100) + '%');
                        }
                    });
                }
            });
        }
    });
};

/**
 * This function takes in an array of event objects {start: Number, end: Number},
 * and renders them to the view.
 * @param {array} events an array of objects in the format {start: Number, end: Number}
 */
DayView.prototype.renderEvents = function renderEvents(events) {
    var iCount, cCount, intervals, sortedEvents, self = this;

    // clear out any current events
    self._clearEvents();

    // sort the events by start time
    sortedEvents = events.sort(self._compareEvents('start'));

    // process the event information for layout
    self._processEvents(sortedEvents);
    logger.info('intervals', self.intervals);
    logger.info('groups', self.overlapGroups);

    // let's loop through our structures and display some events
    // first, let's just add our all items to the display
    iCount = self.intervals.length;
    for(var i = 0; i < iCount; ++i) {
        self._positionEvent(self.intervals[i]);
    }

    // and fix overlaps in display based on grouping information
    self._removeOverlaps();

    // show the events
    self.$eventsEl.show();
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
    // self.intervals = self.tree.queryOverlap();
    // CHANGED: use my own queries so I can remove endpoint overlaps in search,
    // as most calendars don't consider 2-3pm and 3-4pm overlaping.
    _.forEach(events, function(event, index) {
        self.tree.queryInterval(event.start, event.end, { endpoints: false, resultFn: function(results) {
            self.intervals.push({
                from: event.start,
                to: event.end,
                id: index,
                overlap: _.chain(results)
                            .reject({'id': index}) // get rid of the interval from search
                            .pluck('id')
                            .value()
            });
        }});
    });

    // group the intervals
    self._groupIntervals(self.intervals);
};

/**
 * Groups intervals and creates column information within each group for CSS
 * generation.
 */
DayView.prototype._groupIntervals = function _groupIntervals(intervals) {
    var self = this;
    // CHANGED: changed this to create a group structure to keep common overlapping
    // info amongst clusters of events.
    // Each group will look like:
    //
    // var group = {
    //     members: {
    //         0: { // the key is the interval id for quick lookup
    //             column: 0 // the column the member belongs in
    //         }
    //     },
    //     columns: 1 // total number of columns for this group
    // };

    _.forEach(intervals, function(interval) {
        var group, inserted = false;

        // add to it's own group if there are no overlaps
        if (interval.overlap.length === 0) {
            self.overlapGroups.push(self._createGroup(interval));
        } else {
            // check to see if interval's overlap should be part of existing group
            _.forEach(self.overlapGroups, function(group) {

                // check current group for overlap
                _.forEach(interval.overlap, function(intervalId) {
                    if (group.members[intervalId]) {
                        group.members[interval.id] = {
                            column: 0
                        };
                        inserted = true;
                        return false; // break out of forEach
                    }
                });

                if(inserted) {
                    return false; // break out of forEach
                }
            });

            // if you didn't insert into an existing group, create a new one
            if (!inserted) {
                self.overlapGroups.push(self._createGroup(interval));
                inserted = true;
            }
        }
    });

    // create columns in the groups now that everything is grouped
    // TODO: own function?
    _.forEach(self.overlapGroups, function(group) {
        var keys, curCol, tempColumns = [[]];

        // only create columns for groups with more than one item
        if (_.size(group.members) > 1) {
            // logger.info('creating columns');
            keys = _.keys(group.members);
            keys = keys.sort(); // guarantee order on diff platforms

            // stick first key in first column
            tempColumns[0][0] = keys[0];

            for (var i = 1; i < keys.length; ++i) {
                curCol = 0;

                while (true) {
                    // new column should be created
                    if (curCol >= tempColumns.length) {
                        // logger.info('new column');
                        tempColumns.push([keys[i]]);
                        group.members[keys[i]].column = curCol;
                        group.columns++;
                        break;
                    } else { // add to existing column or move to next
                        // check interval against last item in current column
                        if (intervals[_.last(tempColumns[curCol])].to <= intervals[keys[i]].from) {
                            tempColumns[curCol].push(keys[i]);
                            break;
                        } else {
                            curCol++;
                        }
                    }
                } // while

            } // for

        }

    });

};

/**
 * creates a blank group, or one that is intialized with a given interval
 * @param {[type]} interval [description]
 */
DayView.prototype._createGroup = function _createGroup(interval) {
    var group = {
        members: {},
        columns: 1
    };

    if (interval) {
        group.members[interval.id.toString()] = {
            column: 0
        };
    }

    return group;
};

/**
 * Will clear any current events out of the events container.
 */
DayView.prototype._clearEvents = function _clearEvents() {
    var self = this;
    self.overlapGroups = []; // garbage collect
    self.intervals = []; // garbage collect
    self.$eventsEl.hide();
    self.$eventsEl.empty();
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
