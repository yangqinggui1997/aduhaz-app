import React from 'react';
import { Provider } from 'react-redux';
import createStore from '../store';

function AppStoreProvider({ store = createStore(), children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default AppStoreProvider;
