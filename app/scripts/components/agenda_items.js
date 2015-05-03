var React = require('react');
var moment = require('moment');
var classNames = require('classnames');
var utils = require('./../modules/utils');
var AgendaItem = require('./agenda_item');

class AgendaItems extends React.Component {
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
      <div className="items">
      </div>
    );
  }
}

AgendaItems.propTypes = {

};

AgendaItems.defaultProps = {

};

module.exports = AgendaItems;
