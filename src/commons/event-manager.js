import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import Constants from './constants';

// refer at https://github.com/wix/react-native-navigation/issues/3991#issuecomment-422898535

const EventManager = new EventEmitter();

function sendDataByDeeplink({ payload, link }) {
  EventManager.emit(Constants.DEEP_LINK, {
    link,
    payload,
  });
}

function addListener(eventType, listener) {
  return EventManager.addListener(eventType, listener);
}

function removeListener(eventType, listener) {
  EventManager.removeListener(eventType, listener);
}

function removeAllListeners(eventType) {
  EventManager.removeAllListeners(eventType);
}

function removeCurrentListener() {
  EventManager.removeCurrentListener();
}

function emit(eventType, data) {
  EventManager.emit(eventType, data);
}

export default {
  addListener,
  sendDataByDeeplink,
  removeListener,
  removeAllListeners,
  removeCurrentListener,
  emit,
};
