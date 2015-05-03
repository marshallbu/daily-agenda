var React = require('react');
var ReactCSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var moment = require('moment');
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
        itemsCount = 0,
        items = [];

    _forEach(clusters, (cluster) => {

      _forEach(cluster.cols, (col) => {

        _forEach(col.members, (member) => {
          var event = events[member.eventIndex],
              elLeft = (member.col / cluster.cols.length) * 100,
              elRight = ((member.col + 1) / cluster.cols.length) * 100,
              eventStart = moment(event.time.start.format('HH:mm:ss:SSS'), 'HH:mm:ss:SSS'),
              eventEnd = moment(event.time.end.format('HH:mm:ss:SSS'), 'HH:mm:ss:SSS'),
              styles;

          styles = {
            top: utils.calculatePercentageInTimeRange(s, e, eventStart) + '%',
            bottom: utils.calculatePercentageInTimeRange(s, e, eventEnd, 'bottom') + '%',
            left: elLeft + '%',
            // TODO: make this take up entire space to right if no immediate overlap
            right: Math.abs(elRight - 100) + '%'
          };

          // add the event to the events container
          items.push(
            <AgendaItem key={itemsCount++} positionStyles={styles} event={event} />
          );
        });

      });

    });

    return items;
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
        {this.generateItems()}
      </div>
    );
  }
}

AgendaItems.propTypes = {
  rangeStart: (props, propName) => {
    if (!props[propName].isValid || !props[propName].isValid()) {
      return new Error('Validation failed!');
    }
  },
  rangeEnd: (props, propName) => {
    if (!props[propName].isValid || !props[propName].isValid()) {
      return new Error('Validation failed!');
    }
  },
  events: React.PropTypes.arrayOf(React.PropTypes.object)
};

AgendaItems.defaultProps = {
  events: []
};

module.exports = AgendaItems;
