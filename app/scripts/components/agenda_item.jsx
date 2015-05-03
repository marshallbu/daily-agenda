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

  handleClick(e) {
    e.preventDefault();
    this.props.clickCallback(this.props.event);
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
      <div className="item" style={styles} onClick={this.handleClick.bind(this)}>
        <div className="event">
          <div className="event-handle"></div>
          <div className="title">{title}</div>
          <div className="location"></div>
          <div className="capacity">
            Seats: <span className="badge">{seats.available < seats.total ? `${seats.available}/${seats.total}` : 'FULL'}</span>
          </div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  positionStyles: React.PropTypes.object,
  event: React.PropTypes.object,
  clickCallback: React.PropTypes.func
};

AgendaItem.defaultProps = {
  positionStyles: {},
  event: {},
  clickCallback: () => {}
};

module.exports = AgendaItem;