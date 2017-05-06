import { requestWatcher } from './utils';

let dashboardWatcher;
let sensorsWatcher;

export function watchDashboard() {
  dashboardWatcher = requestWatcher.watch('/api/events?sensorType=f0f4371a-9b18-4755-aa89-d5a7152e6525');
  return dashboardWatcher;
}

export function unwatchDashboard() {
  if (dashboardWatcher) {
    dashboardWatcher.stop();
  }
}

export function watchSensors() {
  sensorsWatcher = requestWatcher.watch('/api/sensors');
  return sensorsWatcher;
}

export function unwatchSensors() {
  if (sensorsWatcher) {
    sensorsWatcher.stop();
  }
}
