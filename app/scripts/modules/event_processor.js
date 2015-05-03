var logger = require('./logger');
var moment = require('moment');
var _forEach = require('lodash').forEach;
var _map = require('lodash').map;

class EventProcessor {

  static sortEvents(events) {
    var evts = EventProcessor._convertToMoments(events);
    return evts.sort(EventProcessor._compareEvents());
  }

  /**
   * Takes in a sorted list of events and creates an array of cluster information
   * for help with positioning events.
   * @param {array} events (EXPECTS THEM TO BE SORTED!!)
   */
  static processEvents(events) {
    var clusters = [];

    // logger.info(events);

    _forEach(events, (event, index) => {
      var insertedInCluster = false;

      // find a cluster for it to go in
      _forEach(clusters, (cluster) => {
        var colNum = 0, insertedInCol = false, member;

        if (!event.time.start.isAfter(cluster.clusterEnd)) {
          // belongs in this cluster
          member = {
            eventIndex: index,
            col: 0
          };

          // find the right column for this event
          _forEach(cluster.cols, (col) => {
            if (event.time.start.isAfter(col.colEnd)) {
              member.col = colNum;
              col.members.push(member);
              col.colEnd = event.time.end;
              insertedInCol = true;
              return false; //break
            }
            colNum++;
          });

          // no where for it to go in current columns, put it in a new one
          if (!insertedInCol) {
            member.col = colNum;

            cluster.cols.push({
              members: [member],
              colEnd: event.time.end
            });

            insertedInCol = true;
          }

          // update max end time for this cluster if necessary
          if (event.time.end.isAfter(cluster.clusterEnd) && insertedInCol) {
            cluster.clusterEnd = event.time.end;
          }

          insertedInCluster = true;
          return false;
        }
      });

      // add the first event to it's own cluster, or if no cluster was found,
      // add it to a new one
      if (index === 0 || !insertedInCluster) {
        clusters.push({
          cols: [{
            members: [{
              eventIndex: index,
              col: 0
            }],
            colEnd: event.time.end
          }],
          clusterEnd: event.time.end
        });
      }
    });

    // logger.info('clusters:', clusters);

    return clusters;
  };

  /**
   * Convert array of event data to have proper moment objects for date/time
   */
  static _convertToMoments(events) {
    return _map(events, (event) => {
      var massagedStart = event.time.start;
      var massagedEnd = event.time.end;
      massagedStart = massagedStart.slice(0, massagedStart.indexOf('GMT')).trim();
      massagedEnd = massagedEnd.slice(0, massagedEnd.indexOf('GMT')).trim();

      event.time.start = moment(massagedStart, 'ddd MMM D YYYY H:mm:ss');
      event.time.end = moment(massagedEnd, 'ddd MMM D YYYY H:mm:ss');
      return event;
    });
  }

  /**
   * this is a generic comparator for sorting the calendar event objects
   */
  static _compareEvents() {
    return (a, b) => {
      if (a.time.start.isAfter(b.time.start)) {
        return 1;
      }
      if (a.time.start.isBefore(b.time.start)) {
        return -1;
      }
      return 0;
    };
  };
}

module.exports = EventProcessor;
