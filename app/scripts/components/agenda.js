var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');
var AgendaItems = require('./agenda_items');
var events = require('./../../../mock_data/bushel.json');

class Agenda extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      rangeStart: moment().hours(props.start.hour).minutes(props.start.minute),
      rangeEnd: moment().hours(props.end.hour).minutes(props.end.minute)
    };
  }

  /**
   * Generate and return an array of label components.
   */
  generateLabels() {
    var s = this.state.rangeStart,
        e = this.state.rangeEnd,
        sInterval = moment(s),
        lCount = 0, // used for keys in React, advanced via post-increment
        labels = [],
        m, isTopOfHour, classes, styles;

    while(!sInterval.isAfter(e)) {
      isTopOfHour = sInterval.minutes() === 0;

      classes = classNames(
        'time-label',
        {
          'top-of-hour': isTopOfHour
        }
      );

      styles = {
        'top': utils.calculatePercentageInTimeRange(s, e, sInterval) + '%'
      };

      if (sInterval.minutes() === 0) {
        m = (
          <span className="meridiem">
            {sInterval.format('A')}
          </span>
        );
      }

      // push a component
      labels.push(
        <div className={classes} style={styles} key={`time-label-${lCount++}`}>
          {sInterval.format('h:mm')} {m}
        </div>
      );

      // advance our time 30 minutes, assuming that our range started/ended on
      // the top or middle of the hour
      sInterval.add(30, 'm');
    }

    return labels;
  }

  /**
   * Render component.
   */
  render() {

    return (
      <div className="items-container">
        {this.generateLabels()}
        <AgendaItems
          events={events}
          rangeStart={this.state.rangeStart}
          rangeEnd={this.state.rangeEnd} />
      </div>
    );
  }
}

Agenda.propTypes = {
  start: React.PropTypes.shape({
    hour: React.PropTypes.number,
    minute: React.PropTypes.number
  }),
  end: React.PropTypes.shape({
    hour: React.PropTypes.number,
    minute: React.PropTypes.number
  })
};

Agenda.defaultProps = {
  start: { hour: 8, minute: 0 },
  end: { hour: 21, minute: 0 }
};

module.exports = Agenda;
