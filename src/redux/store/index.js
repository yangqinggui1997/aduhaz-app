import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';

const logger = createLogger({
  // ...options
});

const middleware = [thunk];

if (__DEV__) {
  middleware.push(logger);
}

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware),
  );

  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./reducers').default);
    });
  }
  return store;

  // return createStore(rootReducer, initialState, applyMiddleware(...middleware));
}
