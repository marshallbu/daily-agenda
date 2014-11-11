var $ = require('jquery'),
    logger = require('modules/logger'),
    DailyAgenda = require('agenda');

(function($, logger, DailyAgenda) {
    var viewContainer = $('div.calendar-view');

    if (viewContainer.length > 0) {
        // this will initialize the display and prepare it for events
        // via window.layOutDay
        var agenda = new DailyAgenda({
            view: viewContainer
        });

        // provide window function to add event items
        window.layOutDay = function(events) {
            if (events) {
                agenda.renderEvents(events);
            } else {
                logger.error('events can\'t be empty!!');
            }

        };

    } else {
        logger.error('No div.calendar-view in HTML!');
    }
}($, logger, DailyAgenda));
