import messaging from '@react-native-firebase/messaging';
import { Navigation } from 'react-native-navigation';

import fcmService from './lib/notification/fcm-service';
import localNotificationService from './lib/notification/local-notification-service';
import { setSplashScreen, setMainScreen } from './src/navigation';
import Storage from './src/storage';
import * as appActions from './src/redux/store/reducers/app/action';
import Screens from './src/screens/screens';
import apiService from './src/services';
import { NOTIFICATION_TYPE } from './src/commons/constants';

const initialNotification = store => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      '[Notification] Message handled in the background',
      remoteMessage,
    );
  });

  const onRegisterNotification = token => {
    console.log('[Notification] token: ', token);
    Storage.saveFCMToken(token);
    // send new token to server
    if (Storage.isLoggedIn()) {
      console.log('updateFcmToken: ', token);
      apiService
        .updateFcmToken(token)
        .then(rsp => console.log('updateFcmToken - rsp.data: ', rsp.data))
        .catch(error => console.log('updateFcmToken - error: ', error));
    }
  };

  const onNotification = (notify, data) => {
    console.log('[Notification] App notify: ', notify);
    console.log('[Notification] App data: ', data);
    let shouldShow = true;
    if (data && data.type === NOTIFICATION_TYPE.CHAT_MESSAGE) {
      shouldShow =
        data.conversation !== store.getState().app.openingConversation;
      // update unread message
      store.dispatch(
        appActions.changeNumberOfUnreadMessage(
          store.getState().app.notification.numberOfUnreadMessage + 1,
        ),
      );
    } else {
      // update unread notify
      store.dispatch(
        appActions.changeNumberOfUnreadNotify(
          store.getState().app.notification.numberOfUnreadNotify + 1,
        ),
      );
    }
    if (shouldShow && notify) {
      const options = {
        soundName: 'default',
        playSound: true, //,
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        data,
        options,
      );
    }
  };

  const onOpenNotification = notify => {
    console.log('[Notification] App open notification: ', notify);
    if (notify) {
      let data = notify;
      if (notify.messageId) {
        // if is remote message
        data = notify.data;
      }
      console.log('[Notification] - data: ', data);
      store.dispatch(appActions.changeOpenedNotification(data));
    }
  };

  fcmService.registerAppWithFCM();
  fcmService.register(
    onRegisterNotification,
    onNotification,
    onOpenNotification,
  );
  localNotificationService.configure(onOpenNotification);
};

const App = async store => {
  // init restful service
  apiService.init({
    onTokenExpired: () => console.log('###onTokenExpired'),
    onRefreshTokenFailed: () => {
      console.log('###onRefreshTokenFailed');
      // remove current user out of recent logged in list
      Storage.removeRecentLoggedInUsers(Storage.user.id);
      // do log out
      store.dispatch(appActions.signOut());
      // Open Login screen
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: Screens.Login,
              },
            },
          ],
          options: {
            topBar: {
              visible: false,
            },
          },
        },
      });
    },
  });
  // init notification handler
  initialNotification(store);

  // handle store changed
  let newAppState;
  let currentRoot;
  const onStoreUpdate = async () => {
    newAppState = store.getState().app;
    if (newAppState.initializing) {
      if (currentRoot !== Screens.Splash) {
        // reload storage data
        await Storage.loadData();
        currentRoot = setSplashScreen();
      }
    } else if (currentRoot !== Screens.Home) {
      currentRoot = setMainScreen();
    }
  };
  store.subscribe(onStoreUpdate);

  // load storage data
  await Storage.loadData();

  if (Storage.isLoggedIn()) {
    store.dispatch(appActions.signIn(Storage.user));
  }

  store.dispatch(appActions.appStartInitializing());
};

export default App;
