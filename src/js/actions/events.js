import { EVENTS_LOAD, EVENTS_UNLOAD, SENSOR_LOAD, SENSOR_UNLOAD } from '../actions';
import {
  watchEvents, unwatchEvents, watchSensor, unwatchSensor
} from '../api/events';

export function loadEvents() {
  return dispatch => (
    watchEvents()
      .on('success',
        payload => dispatch({ type: EVENTS_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: EVENTS_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadEvents() {
  unwatchEvents();
  return { type: EVENTS_UNLOAD };
}

export function loadSensor(id) {
  return dispatch => (
    watchSensor(id)
      .on('success',
        payload => dispatch({ type: SENSOR_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: SENSOR_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadSensor(id) {
  unwatchSensor(id);
  return { type: SENSOR_UNLOAD };
}
