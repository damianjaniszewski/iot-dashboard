import RequestWatcher from './request-watcher';

let protocol = 'ws:';
if (window.location.protocol === 'https:') {
  protocol = 'wss:';
}
const host = ((process.env.NODE_ENV === 'development') ?
  'localhost:8102' : `${window.location.host}`);
const webSocketUrl = `${protocol}//${host}`;

const socketWatcher = new RequestWatcher({ webSocketUrl });

let eventsWatcher;

export function watchEvents() {
  eventsWatcher = socketWatcher.watch('/api/event');
  return eventsWatcher;
}

export function unwatchEvents() {
  if (eventsWatcher) {
    eventsWatcher.stop();
  }
}

const sensorWatcher = [];

export function watchSensor(id) {
  sensorWatcher[id] = socketWatcher.watch(`/api/sensor/${id}`);
  return sensorWatcher[id];
}

export function unwatchSensor(id) {
  if (sensorWatcher[id]) {
    sensorWatcher[id].stop();
  }
}
