import { DASHBOARD_LOAD, DASHBOARD_UNLOAD, SENSORS_LOAD, SENSORS_UNLOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
  events: [],
  sensors: []
};

const handlers = {
  [DASHBOARD_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [DASHBOARD_UNLOAD]: () => initialState,
  [SENSORS_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [SENSORS_UNLOAD]: () => initialState
};

export default createReducer(initialState, handlers);
