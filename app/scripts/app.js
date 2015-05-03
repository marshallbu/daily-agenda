var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

class App extends React.Component {
  constructor(props) {
    // this replaces getInitialState()
    super(props);

    this.state = {
    };
  }

  render() {

    return (
      <RouteHandler />
    );
  }
}

module.exports = App;
