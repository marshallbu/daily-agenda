var React = require('react');
var moment = require('moment');
var utils = require('./../modules/utils');
var _forEach = require('lodash/collection/forEach');
var EventProcessor = require('./../modules/event_processor');
var AgendaItem = require('./agenda_item');
var Button = require('react-bootstrap/lib/Button');
var Modal = require('react-bootstrap/lib/Modal');

class AgendaItems extends React.Component {
  /**
   * A constructor.
   */
  constructor(props) {
    super(props);

    var events = EventProcessor.sortEvents(props.events);

    this.state = {
      events,
      clusters: EventProcessor.processEvents(events),
      showModal: false,
      modalItem: null
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
            <AgendaItem key={itemsCount} itemId={itemsCount} positionStyles={styles} event={event} clickCallback={this.openModal.bind(this)} />
          );
          itemsCount++;
        });

      });

    });

    return items;
  };

  openModal(item) {
    this.setState({
      showModal: true,
      modalItem: item
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      modalItem: null
    });
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    var modalContent;

    if (this.state.showModal) {
      modalContent = this.refs.detailsModal.getDOMNode().querySelector('.modal-content');
      modalContent.tabIndex = 0;
      modalContent.focus();
    }
  }

  /**
   * Render component.
   */
  render() {
    var modal = null,
        event = this.state.modalItem,
        seats, register;

    if (this.state.showModal) {
      seats = event.seats.available < event.seats.total ? `${event.seats.available}/${event.seats.total}` : 'FULL';

      if (seats === 'FULL') {
        register = (
          <Button bsStyle="primary" bsSize="large">Waitlist</Button>
        );
      } else {
        register = (
          <Button bsStyle="primary" bsSize="large">Register</Button>
        );
      }

      modal = (
        <Modal title="Event Details"
          onRequestHide={this.closeModal.bind(this)}
          bsSize="large"
          ref="detailsModal">
          <div className="modal-body" ref="detailsModalBody">
            <img src={event.image} alt="Event Description Image" className="img-rounded pull-right" />
            <h2>
              {event.title} <br/>
              <small>Presented by {event.presenter.join(', ')}</small>
            </h2>
            <p className="lead">{event.description}</p>
            <p>
            {event.time.start.format('dddd, MMMM Do YYYY, h:mm A')}<br/>
            <strong>Duration:</strong> {moment.duration(event.time.end.diff(event.time.start)).humanize()}<br/>
            <strong>Seats Available:</strong> <span className="badge">{seats}</span>
            </p>
          </div>
          <div className="modal-footer">
            <Button bsSize="large" onClick={this.closeModal.bind(this)}>Close</Button>
            {register}
          </div>
        </Modal>
      );
    }

    return (
      <div className="items">
        {this.generateItems()}
        {modal}
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
