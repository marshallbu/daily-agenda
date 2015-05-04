var React = require('react');
var _assign = require('lodash/object/assign');

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

  handleKeyDown(e) {

    if (e.keyCode === 13) {
      this.props.clickCallback(this.props.event);
    }
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
      <div className="item"
        style={styles}
        tabIndex="0"
        role="button"
        aria-labelledby={`title-${this.props.itemId}`}
        aria-describedby={`desc-${this.props.itemId}`}
        onClick={this.handleClick.bind(this)}
        onKeyDown={this.handleKeyDown.bind(this)}>
        <div className="event">
          <div className="event-handle"></div>
          <div id={`title-${this.props.itemId}`} className="title">{title}</div>
          <div className="location"></div>
          <div className="meta">Tap for Details</div>
          <div className="capacity">
            Seats: <span className="badge">{seats.available < seats.total ? `${seats.available}/${seats.total}` : 'FULL'}</span>
          </div>
          <div id={`desc-${this.props.itemId}`} className="sr-only">Click for more details</div>
        </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {
  itemId: React.PropTypes.number,
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
