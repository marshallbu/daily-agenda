var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

var logger = require('modules/logger');

var Main = module.exports = {
    start() {
      React.initializeTouchEvents(true);

      Router.run(routes, function (Handler) {
        // Handler here is our handler component defined in routes for whatever
        // route
        React.render(
          <Handler />,
          document.getElementById('agenda-view')
        );
      });
    }
};

Main.start();
