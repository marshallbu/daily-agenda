var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');

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

    return (
      <div className="item">
          <div className="event">
              <div className="event-handle"></div>
              <div className="title"></div>
              <div className="location"></div>
          </div>
      </div>
    );
  }
}

AgendaItem.propTypes = {

};

AgendaItem.defaultProps = {

};

module.exports = AgendaItem;
