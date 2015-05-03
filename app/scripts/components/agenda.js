var React = require('react');

class Agenda extends React.Component {
  constructor(props) {
    // this replaces getInitialState()
    super(props);

    this.state = {
    };
  }

  render() {

    return (
      <div className="events-container">
        <div className="events"></div>
      </div>
    );
  }
}

module.exports = Agenda;
