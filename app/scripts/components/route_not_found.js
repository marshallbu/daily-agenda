var React = require('react');

class RouteNotFound extends React.Component {
  constructor(props) {
    // this replaces getInitialState()
    super(props);

    this.state = {
    };
  }

  render() {

    return (
      <div className="">
        Not Found
      </div>
    );
  }
}

module.exports = RouteNotFound;
