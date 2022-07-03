import { EVENTS_LOAD, EVENTS_UNLOAD, SENSOR_LOAD, SENSOR_UNLOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
  events: [],
  sensor: undefined
};

const handlers = {
  [EVENTS_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [EVENTS_UNLOAD]: () => initialState,
  [SENSOR_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [SENSOR_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
