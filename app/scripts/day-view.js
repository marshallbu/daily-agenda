var $ = require('jquery'),
    _ = require('lodash'),
    moment = require('moment'),
    dayViewEventsTemplate = require('../partials/day-view-events.html');
    eventItemTemplate = require('../partials/event-item.html');

    var intervals = require('interval-query');
    var tree = new intervals.SegmentTree();

var DayView = function DayView(options) {
    var self = this;
    self.options = options ? options : {};

    // TODO: make this range configurable, even if not required
    self.dayRangeStart = moment().hours(9).minutes(0);
    self.dayRangeEnd = moment().hours(21).minutes(0);

    // get the difference between the start and end time, for use in precise
    // positioning of elements
    self.dayRangeDiffInMs = self.dayRangeStart.diff(self.dayRangeEnd);

    // expect a non empty jQuery object to setup day view
    if (!(self.options.view instanceof $)) {
        // TODO: display some visual error, even if not required
        console.error('tried to instantiate without proper view');
    } else {
        self.view = self.options.view;

        // initialize our DOM partials, keep a reference to them
        self.eventsTemplate = $(dayViewEventsTemplate);
        self.eventsEl = self.eventsTemplate.find('.events');

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
 * This function takes in an event object {start: Number, end: Number}, creates
 * a DOM element and positions it in the view.
 * @param {object} event {start: Number, end: Number}
 */
DayView.prototype._positionEvent = function _positionEvent(event) {
    var eventItemEl, eventTime, percentageFromTop, self = this;

    eventItemEl = $(eventItemTemplate);
    eventItemEl.find('.title').text('Sample Item');
    eventItemEl.find('.location').text('Sample Location');

    // add the amount of minutes from our event to the dayRangeStart to get the
    // event time
    eventStart = moment(self.dayRangeStart).add(event.start, 'm');
    eventEnd = moment(self.dayRangeStart).add(event.end, 'm');

    // position the event based on it's time
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
    var eventsCount, self = this;

    // clear out any current events
    self._clearEvents();

    var sortedEvents = events.sort(self._compareEvents('start'));
    // console.log(sortedEvents);
    eventsCount = events.length;

    console.log(self._processEvents(events));

    for(var i = 0; i < eventsCount; ++i) {
        self._positionEvent(sortedEvents[i]);
    }
};

/**
 * Takes in a sorted list of events, and processes the events in to separate
 * buckets based on overlaps
 * @param {array} events
 */
DayView.prototype._processEvents = function _processEvents(events) {
    var self = this;
    // var eventsCount = events.length, eventBuckets = [], bucketCount, overlaps, foundBucket, foundBucketIndex;
    //
    // // initialize the buckets array by adding the first element in an empty bucket
    // eventBuckets.push( [{ eventIndex: 0, overlaps: 0 }] );
    //
    // for(var i = 1; i < eventsCount; ++i) {
    //     bucketCount = eventBuckets.length;
    //     overlaps = 0;
    //     foundBucket = false;
    //     foundBucketIndex = 0;
    //
    //     // check the last event in each bucket to see if it overlaps
    //     for(var bIndex = 0; bIndex < bucketCount; ++bIndex) {
    //         var bucket = eventBuckets[bIndex];
    //         var eventIndex = bucket[bucket.length-1].eventIndex;
    //
    //         // add to current bucket if start is greater than/equal last item's end
    //         if(events[i].start >= events[eventIndex].end) {
    //             bucket.push({ eventIndex: i, overlaps: overlaps});
    //             foundBucket = true;
    //             foundBucketIndex = bIndex;
    //         } else {
    //             bucket[bucket.length-1].overlaps++;
    //             overlaps++;
    //         }
    //     }
    //
    //     if(!foundBucket) {
    //         eventBuckets.push( [{ eventIndex: i, overlaps: 0 }] );
    //     } else {
    //         var theBucket = eventBuckets[foundBucketIndex];
    //         theBucket[theBucket.length-1].overlaps = overlaps;
    //     }
    // }
    //
    // return eventBuckets;

    for(var i = 0; i < events.length; ++i) {
        tree.pushInterval(events[i].start, events[i].end);
    }
    tree.buildTree();

    console.log(tree.queryOverlap());
};

/**
 * Will clear any current events out of the events container.
 */
DayView.prototype._clearEvents = function _clearEvents() {
    var self = this;
    self.eventsEl.empty();
};

/**
 * this is a generic comparitor for sorting the calendar event objects
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
