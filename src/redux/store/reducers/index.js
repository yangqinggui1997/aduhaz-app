import { combineReducers } from 'redux';
import app from './app/reducer';
import bottomTab from './bottomTab/reducer';

const rootReducer = combineReducers({
  app,
  bottomTab,
});

export default rootReducer;
