import { DASHBOARD_LOAD, DASHBOARD_UNLOAD, SENSORS_LOAD, SENSORS_UNLOAD } from '../actions';
import { watchDashboard, unwatchDashboard, watchSensors, unwatchSensors } from '../api/dashboard';

export function loadDashboardEvents() {
  return dispatch => (
    watchDashboard()
      .on('success',
        payload => dispatch({ type: DASHBOARD_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: DASHBOARD_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadDashboardEvents() {
  unwatchDashboard();
  return { type: DASHBOARD_UNLOAD };
}

export function loadSensors() {
  return dispatch => (
    watchSensors()
      .on('success',
        payload => dispatch({ type: SENSORS_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: SENSORS_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadSensors() {
  unwatchSensors();
  return { type: SENSORS_UNLOAD };
}
