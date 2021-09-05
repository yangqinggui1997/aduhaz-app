import { LogBox } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens';
import configureStore from './src/redux/store';
import App from './app';
import {
  setDefaultOptions,
  loadNavigationConstant,
} from './src/commons/options';
import './i18n';

const store = configureStore();
registerScreens(store);

LogBox.ignoreLogs([
  'Remote debugger',
  'VirtualizedLists should never be nested',
  'Non-serializable values were found in the navigation state',
]);

Navigation.events().registerAppLaunchedListener(async () => {
  // load navigation constant
  await loadNavigationConstant();
  setDefaultOptions();
  // start app
  await App(store);
});
