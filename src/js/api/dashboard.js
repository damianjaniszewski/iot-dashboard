import { requestWatcher } from './utils';

let dashboardWatcher;

export function watchDashboard() {
  dashboardWatcher = requestWatcher.watch('/api/event?sensorType=f0f4371a-9b18-4755-aa89-d5a7152e6525');
  return dashboardWatcher;
}

export function unwatchDashboard() {
  if (dashboardWatcher) {
    dashboardWatcher.stop();
  }
}
