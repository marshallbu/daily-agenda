var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');
var _forEach = require('lodash').forEach;
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

  /**
   * This function takes in an events area and cluster information and creates
   * a DOM element for each and positions them in the view.
   */
  generateItems() {
    var events = this.state.events,
        clusters = this.state.clusters,
        s = this.props.rangeStart,
        e = this.props.rangeEnd,
        items = [];

    _forEach(clusters, (cluster) => {

      _forEach(cluster.cols, (col) => {

        _forEach(col.members, (member) => {
          var eventStart, eventEnd, elLeft, elRight;

          // add the amount of minutes from our event to the dayRangeStart to get the
          // event time
          eventStart = moment(self.dayRangeStart).add(events[member.eventIndex].start, 'm');
          eventEnd = moment(self.dayRangeStart).add(events[member.eventIndex].end, 'm');

          elLeft = (member.col / cluster.cols.length) * 100;
          elRight = ((member.col + 1) / cluster.cols.length) * 100;

          var styles = {
            top: utils.calculatePercentageInTimeRange(s, e, eventStart) + '%',
            bottom: utils.calculatePercentageInTimeRange(s, e, eventEnd, 'bottom') + '%',
            left: elLeft + '%',
            // TODO: make this take up entire space to right if no immediate overlap
            right: Math.abs(elRight - 100) + '%'
          }

          // add the event to the events container
          items.push(
            <AgendaItem />
          )
        });

      });

    });
  };

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
  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  rangeStart: (props, propName, componentName) => {
    if (!/matchme/.test(props[propName])) {
      return new Error('Validation failed!');
    }
  },
  rangeEnd: (props, propName, componentName) => {
    if (!/matchme/.test(props[propName])) {
      return new Error('Validation failed!');
    }
  },
  events: React.PropTypes.arrayOf(React.PropTypes.object)
};

AgendaItems.defaultProps = {
  events: []
};

module.exports = AgendaItems;
