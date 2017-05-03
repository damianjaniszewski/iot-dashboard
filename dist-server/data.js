'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sensors = exports.events = undefined;
exports.addSession = addSession;
exports.getSession = getSession;
exports.addNotifier = addNotifier;
exports.getEvents = getEvents;
exports.getSensors = getSensors;
exports.getSensor = getSensor;

var _azureEventHubs = require('azure-event-hubs');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _sessions = {};
var _notifiers = {
  event: [],
  sensor: []
};

var events = exports.events = [];
var sensors = exports.sensors = [];

_dotenv2.default.config({ silent: true });

var _connectionString = process.env.connectionStringHostName + ';' + process.env.connectionStringSharedAccessKeyName + ';' + process.env.connectionStringSharedAccessKey;

var _printError = function _printError(err) {
  console.log(err.message);
};

function _addSensor(sensor) {
  var index = sensors.findIndex(function (t) {
    if (t.sensorId === sensor.sensorId) {
      return true;
    }
    return false;
  });

  index >= 0 ? sensors[index] = sensor : sensors.push(sensor);
};

var _gotEvent = function _gotEvent(event) {
  console.log('event> ' + event.body.sensorId + '.' + event.body.sensorType + ' (' + event.body.sensorLat + ', ' + event.body.sensorLng + '): ' + event.body.sensorState);
  // console.log(JSON.stringify(message.body));
  // console.log('');

  events.unshift(event.body);
  _notifiers.event.forEach(function (notifier) {
    return notifier(event);
  });

  _addSensor(event.body);
  _notifiers.sensor.forEach(function (notifier) {
    return notifier(event);
  });
};

var _client = _azureEventHubs.Client.fromConnectionString(_connectionString);

_client.open().then(_client.getPartitionIds.bind(_client)).then(function (partitionIds) {
  return partitionIds.map(function (partitionId) {
    return _client.createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() - 2 * 24 * 60 * 60 * 1000 }).then(function (receiver) {
      console.log('Created partition receiver: ' + partitionId);
      receiver.on('errorReceived', _printError);
      receiver.on('message', _gotEvent);
    });
  });
}).catch(_printError);

function addSession(token, data) {
  _sessions[token] = data;
}

function getSession(token) {
  return _sessions[token];
}

function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

function getEvents(filters) {
  if (filters) {
    return Promise.resolve({
      events: events.filter(function (event) {
        return Object.keys(filters).some(function (filter) {
          return event[filter] === filters[filter];
        });
      })
    });
  }
  return Promise.resolve({ events: events });
}

function getSensors() {
  return Promise.resolve({ sensors: sensors });
}

function getSensor(id) {
  var sensor = void 0;
  sensors.some(function (t) {
    if (t.sensorId === id) {
      sensor = t;
      return true;
    }
    return false;
  });
  return Promise.resolve({ sensor: sensor });
}

exports.default = { addNotifier: addNotifier, addSession: addSession, getSession: getSession, getSensors: getSensors, getSensor: getSensor, getEvents: getEvents };
//# sourceMappingURL=data.js.map