var $ = require('jquery'),
    // for templating, would do a custom build for production
    _ = require('lodash'),
    moment = require('moment'),
    dayViewEventsTemplate = require('../partials/day-view-events.html');
    eventItemTemplate = require('../partials/event-item.html');

var DayView = function DayView(options) {
    var self = this;
    self.options = options ? options : {};
    self.currentEvents = [];

    // TODO: make this range configurable, even if not required
    self.dayRangeStart = moment().hours(9).minutes(0);
    self.dayRangeEnd = moment().hours(21).minutes(0);

    // get the difference between the start and end time, for use in precise
    // positioning of elements
    self.dayRangeDiffInMs = self.dayRangeStart.diff(self.dayRangeEnd);

    // expect a non empty jQuery object
    if (!(self.options.view instanceof $)) {
        // TODO: display some visual error, even if not required
        console.error('tried to instantiate without proper view');
    } else {
        self.view = self.options.view;

        // initialize our DOM partial, keep a reference to it
        self.eventsTemplate = $(dayViewEventsTemplate);

        // initialize the view
        self._initView();
    }

    // provide window function to add event items
    window.layOutDay = self._renderEvents;
};

/**
 * this function will initialize our day view, setting up scaffolding and common
 * elements that shouldn't change outside of CSS media queries
 *
 * TODO: break this down into more separated chunks
 */
DayView.prototype._initView = function _initView() {
    var currentTime, self = this;

    // clone a moment at the set dayRangeStart
    currentTime = moment(self.dayRangeStart);

    // build our time labels and position accordingly
    while(!(currentTime.isAfter(self.dayRangeEnd))) {
        var label, percentageFromTop;

        label = $('<div class="time-label"></div>');
        label.text(currentTime.format('h:mm'));

        label.css('top', self._calculatePercentageInDayRange(currentTime) + '%');

        if(currentTime.minutes() === 0) {
            label.addClass('top-of-hour');
            label.append($('<span class="meridiem">').text(currentTime.format('A')));
        }

        // attach to the labels template
        self.eventsTemplate.append(label);

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
DayView.prototype._calculatePercentageInDayRange = function _calculatePercentageInDayRange(time) {
    var self = this;
    return parseFloat(self.dayRangeStart.diff(time) / self.dayRangeDiffInMs) * 100;
};

/**
 * This function takes in an array of event objects {start: Number, end: Number},
 * and renders them to the view.
 * @param {array} events an array of objects in the format {start: Number, end: Number}
 */
DayView.prototype._renderEvents = function _renderEvents(events) {
    console.log(events);
};

DayView.prototype.refreshView = function refreshView() {

};


module.exports = DayView;
