var React = require('react');
var _assign = require('lodash').assign;

class AgendaItem extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  /**
   * Render component.
   */
  render() {
    var { title, seats } = this.props.event,
        styles;

    styles = {};

    styles = _assign(styles, this.props.positionStyles);

    return (
      <div className="item animated fadeIn" style={styles}>
        <div className="event">
          <div className="event-handle"></div>
          <div className="title">{title}</div>
          <div className="location"></div>
          <div className="capacity">
            Seats: <span className="pill">{seats.available < seats.total ? `${seats.available}/${seats.total}` : 'FULL'}</span>
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  positionStyles: React.PropTypes.object,
  event: React.PropTypes.object
};

AgendaItem.defaultProps = {

};

module.exports = AgendaItem;
