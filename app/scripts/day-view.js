var $ = require('jquery'),
    _ = require('lodash'),
    moment = require('moment'),
    dayViewLabelsTemplate = require('../partials/day-view-labels.html'),
    dayViewEventsTemplate = require('../partials/day-view-events.html');

var DayView = function DayView(options) {
    var self = this;
    self.options = options ? options : {};
    self.currentEvents = [];

    // let's store the current date, we could use a standard JS Date, but moment
    // is more flexible especially for dealing with other locales
    // TODO: you should also be able to change/modify this
    self.currentDate = moment().startOf('day');

    // expect a non empty jQuery object
    if (!(self.options.view instanceof $)) {
        console.error('tried to instantiate without proper view');
    } else {
        self.view = self.options.view;
    }

    // TODO: make this range configurable
    self.dayRangeStart = moment().hours(9).minutes(0);
    self.dayRangeEnd = moment().hours(21).minutes(0);

    // get the difference between the start and end time, for use in precise
    // positioning of elements
    self.dayRangeDiffInMs = self.dayRangeStart.diff(self.dayRangeEnd);

    // initialize the view
    self._initView();

    // provide window function to add event items
    window.layOutDay = self.layOutDay;
};

/**
 * this function will initialize our day view, setting up scaffolding and common
 * elements that shouldn't change outside of CSS media queries
 */
DayView.prototype._initView = function _initView() {
    var labelsTemplate, eventsTemplate, currentTime;
    var self = this;

    // initialize our DOM partials
    labelsTemplate = $(dayViewLabelsTemplate);
    eventsTemplate = $(dayViewEventsTemplate);

    // start our time at the set dayStart
    currentTime = moment(self.dayRangeStart);

    while(!(currentTime.isAfter(self.dayRangeEnd))) {
        var label, percentageFromTop;

        label = $('<div class="time-label"></div>');
        label.text(currentTime.format('h:mm'));

        // calculate position by using the currentTimes difference from dayStart
        // and the overall difference self.dayTimeDiffInMs
        percentageFromTop = parseFloat(self.dayRangeStart.diff(currentTime) / self.dayRangeDiffInMs) * 100;
        label.css('top', percentageFromTop + '%');

        if(currentTime.minutes() === 0) {
            label.addClass('top-of-hour');
            label.append($('<span class="meridiem">').text(currentTime.format('A')));
        }

        labelsTemplate.append(label);

        // advance our time 30 minutes, assuming that our range started/ended on
        // the top or middle of the hour mark
        currentTime.add(30, 'm');
    }


    // append the view templates to the view
    this.view.append(labelsTemplate, eventsTemplate);
};

DayView.prototype.render = function render() {
    console.log('hello');
};

DayView.prototype.refreshView = function refreshView() {

};


module.exports = DayView;
