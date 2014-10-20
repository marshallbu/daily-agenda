var $ = require('jquery'),
    logger = require('modules/logger'),
    DayView = require('day-view');

(function($, logger, DayView) {
    var viewContainer = $('div.calendar-view');

    if (viewContainer.length > 0) {
        // this will initialize the DayView display, and prepare to take in events
        // via window.layOutDay
        var myDayView = new DayView({
            view: viewContainer
        });

        // provide window function to add event items
        window.layOutDay = function(events) {
            if (events) {
                myDayView.renderEvents(events);
            } else {
                logger.error('events can\'t be empty!!');
            }

        };

    } else {
        logger.error('No div.calendar-view in HTML!');
    }
}($, logger, DayView));
