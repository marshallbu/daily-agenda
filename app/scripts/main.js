var $ = require('jquery'),
    moment = require('moment'),
    DayView = require('day-view');

(function($, DayView) {
    var viewContainer = $('div.calendar-view');

    if (viewContainer.length > 0) {
        // this will initialize the DayView display, and prepare to take in events
        // via window.layOutDay
        var myDayView = new DayView({
            view: viewContainer
        });
    } else {
        console.error('No div.calendar-view in HTML!');
    }


}($, DayView));
