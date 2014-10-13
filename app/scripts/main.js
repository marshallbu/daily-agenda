var $ = require('jquery'),
    moment = require('moment'),
    DayView = require('day-view');

(function($, DayView) {
    var viewContainer = $('div.calendar-view');

    if (viewContainer.length > 0) {
        var myDayView = new DayView({
            view: viewContainer
        });
        myDayView.render();
    } else {
        console.error('No div.calendar-view in HTML!');
    }


}($, DayView));
