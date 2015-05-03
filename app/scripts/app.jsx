var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

class App extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    // this replaces getInitialState()
    super(props);

    this.state = {
    };
  }

  /**
   * Render component.
   */
  render() {

    return (
      <RouteHandler />
    );
  }
}

module.exports = App;
