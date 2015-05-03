var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Route = Router.Route;

var App = require('./app');
var Agenda = require('./components/agenda');
var RouteNotFound = require('./components/route_not_found');

module.exports = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute name="agenda" handler={Agenda} />
    <NotFoundRoute name="route-not-found" handler={RouteNotFound} />
  </Route>
);
