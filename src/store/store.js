import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/auth';
import profileReducer from './reducers/profile';
import dashboardReducer from './reducers/dashboard';

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
