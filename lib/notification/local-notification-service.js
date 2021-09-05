import { Platform } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const DEFAULT_CHANNEL_ID = 'wowo-default-notification-channel-id';
const DEFAULT_CHANNEL_NAME = 'wowo-default-notification-channel-name';

class LocalNotificationService {
  configure = onOpenNotification => {
    // create channel
    PushNotification.createChannel(
      {
        channelId: DEFAULT_CHANNEL_ID,
        channelName: DEFAULT_CHANNEL_NAME,
        channelDescription: DEFAULT_CHANNEL_NAME,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created =>
        console.log(
          `createChannel ${DEFAULT_CHANNEL_ID} returned '${created}'`,
        ),
    );
    // configure
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(notification.data);
        if (Platform.OS === 'ios') {
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      // IOS ONLY (optional): default: all — Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      /**
       * (optional) default: true
       * — Specified if permissions (ios) and token (android and ios) will requested or not,
       * — if not, you must call PushNotificationsHandler.requestPermissions() later
       * — if you are not using remote notification or do not have Firebase installed, use this:
       * requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };
  unregister = () => {
    PushNotification.unregister();
  };
  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      ...this.buildAndroidNotification(id, title, message, data, options),
      /* iOS and Android properties */
      ...this.buildIOSNotification(id, title, message, data, options),
      /* iOS and Android properties */
      id: id,
      title: title || '',
      message: message || '',
      userInfo: data,
      playSound: options.playSound || false,
      soundName: options.soundName || 'default',
      userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
    });
  };
  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      channelId: DEFAULT_CHANNEL_ID,
      autoCancel: true,
      largeIcon: options.largeIcon || 'ic_launcher',
      smallIcon: options.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
    };
  };
  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options.alertAction || 'view',
      category: options.category || '',
    };
  };
  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };
  removeDeliveredNotificationByID = notificationId => {
    console.log(
      '[LocalNotificationService] removeDeliveredNotificationByID: ',
      notificationId,
    );
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}
const localNotificationService = new LocalNotificationService();
export default localNotificationService;
