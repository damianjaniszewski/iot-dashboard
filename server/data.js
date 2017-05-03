import { Client } from 'azure-event-hubs';
import dotenv from 'dotenv';

const _sessions = {};
const _notifiers = {
  event: [],
  sensor: []
};

export const events = [];
export const sensors = [];

dotenv.config({silent: true});

const _connectionString = process.env.connectionStringHostName + ';' + process.env.connectionStringSharedAccessKeyName+ ';' +process.env.connectionStringSharedAccessKey;

var _printError = function (err) {
  console.log(err.message);
};

function _addSensor(sensor) {

}

var _gotEvent = function (event) {
  console.log('event> '+event.body.sensorId+'.'+event.body.sensorType+' ('+event.body.sensorLat+', '+event.body.sensorLng+'): '+event.body.sensorState);
 // console.log(JSON.stringify(message.body));
 // console.log('');

  events.unshift(event.body);
  _notifiers.event.forEach(notifier => notifier(event));

  _addSensor(event.body);
  _notifiers.sensor.forEach(notifier => notifier(event));
};

const _client = Client.fromConnectionString(_connectionString);

_client.open()
    .then(_client.getPartitionIds.bind(_client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return _client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()-2*24*60*60*1000}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', _printError);
                receiver.on('message', _gotEvent);
            });
        });
    })
    .catch(_printError);

export function addSession(token, data) {
  _sessions[token] = data;
}

export function getSession(token) {
  return _sessions[token];
}

export function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

export function getEvents(filters) {
  if (filters) {
    return Promise.resolve({
      events: events.filter(event =>
        Object.keys(filters).some(filter => event[filter] === filters[filter])
      )
    });
  }
  return Promise.resolve({ events });
}

export function getSensor(id) {
  let sensor;
  events.some((t) => {
    if (t.sensorId === id) {
      sensor = t;
      return true;
    }
    return false;
  });
  return Promise.resolve({ sensor });
}

export default { addNotifier, addSession, getSession, getSensor, getEvents };
