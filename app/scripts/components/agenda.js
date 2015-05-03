var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');

class Agenda extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      dayRangeStart: moment().hours(8).minutes(0),
      dayRangeEnd: moment().hours(21).minutes(0)
    };
  }

  /**
   * Generate and return an array of label components.
   */
  generateLabels() {
    var s = this.state.dayRangeStart,
        e = this.state.dayRangeEnd,
        sInterval = moment(s),
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
        <div className={classes} style={styles}>
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
      <div className="events-container">
        {this.generateLabels()}
        <div className="events"></div>
      </div>
    );
  }
}

module.exports = Agenda;
