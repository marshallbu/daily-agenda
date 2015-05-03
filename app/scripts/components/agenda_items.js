var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');
var EventProcessor = require('./../modules/event_processor');
var AgendaItem = require('./agenda_item');

class AgendaItems extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    super(props);

    var events = EventProcessor.sortEvents(props.events);

    this.state = {
      events,
      clusters: EventProcessor.processEvents(events)
    };
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  /**
   * Render component.
   */
  render() {

    return (
      <div className="items">
      </div>
    );
  }
}

AgendaItems.propTypes = {
  events: React.PropTypes.arrayOf(React.PropTypes.object)
};

AgendaItems.defaultProps = {
  events: []
};

module.exports = AgendaItems;
