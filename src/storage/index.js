import AsyncStorage from '@react-native-community/async-storage';

import User from '../models/user';
import constants, { STORAGE } from '../commons/constants';
import Utils from '../commons/utils';
import i18n, { loadDeviceLanguage } from '../../i18n';
import _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';

class Storage {
  constructor() {
    this.user = new User();
    this.userLanguage = '';
    this.fcmToken = ''; // Firebase token for push notification
    this.recentLoggedInUsers = {};
    this.videoCaches = {};
  }

  loadData = async () => {
    await this.retrieveUser();
    await this.loadUserLanguage();
    await this.loadFCMToken();
    await this.retrieveRecentLoggedInUsers();
    await this.loadVideoCaches();
  };

  saveUser = async user => {
    try {
      this.user = User.clone({
        ...this.user,
        ...Utils.removeEmptyAttributes(user),
      });
      await AsyncStorage.setItem(STORAGE.USER_DATA, JSON.stringify(this.user));
      await this.saveRecentLoggedInUsers({ [this.user.id]: this.user });
    } catch (error) {
      console.log('[Storage] Save user error', error);
    } finally {
      return this.user;
    }
  };

  removeRecentLoggedInUsers = async userId => {
    try {
      if (userId) {
        delete this.recentLoggedInUsers[userId];
      }
      let localData = await Utils.encrypt(
        JSON.stringify(this.recentLoggedInUsers),
      );
      await AsyncStorage.setItem(
        STORAGE.RECENT_LOGGED_IN_USERS_DATA,
        localData,
      );
    } catch (error) {
      console.log('[Storage] removeRecentLoggedInUsers error:', error);
    } finally {
      console.log(
        'removeRecentLoggedInUsers save success!',
        this.recentLoggedInUsers,
      );
    }
    return this.recentLoggedInUsers;
  };

  saveRecentLoggedInUsers = async newRecentLoggedInUsers => {
    try {
      if (Utils.isNotEmpty(newRecentLoggedInUsers)) {
        this.recentLoggedInUsers = {
          ...this.recentLoggedInUsers,
          ...Utils.removeEmptyAttributes(newRecentLoggedInUsers),
        };
        let localData = await Utils.encrypt(
          JSON.stringify(this.recentLoggedInUsers),
        );
        await AsyncStorage.setItem(
          STORAGE.RECENT_LOGGED_IN_USERS_DATA,
          localData,
        );
      }
    } catch (error) {
      console.log(
        '[Storage] Save RECENT_LOGGED_IN_USERS_DATA data error:',
        error,
      );
    } finally {
      console.log('save success!', this.recentLoggedInUsers);
    }
    return this.recentLoggedInUsers;
  };

  retrieveRecentLoggedInUsers = async () => {
    try {
      const recentLoggedInUsers = await AsyncStorage.getItem(
        STORAGE.RECENT_LOGGED_IN_USERS_DATA,
      );
      if (recentLoggedInUsers) {
        this.recentLoggedInUsers = JSON.parse(
          Utils.decrypt(recentLoggedInUsers),
        );
        return this.recentLoggedInUsers;
      }
    } catch (error) {
      console.log('[Storage] Retrieve user data error:', error);
    }
    return {};
  };

  retrieveUser = async () => {
    try {
      const user = await AsyncStorage.getItem(STORAGE.USER_DATA);
      if (user) {
        this.user.update(JSON.parse(user));
        return this.user;
      }
    } catch (error) {
      console.log('[Storage] Retrieve user data error:', error);
    }
    return null;
  };

  removeUser = async () => {
    try {
      this.user = new User();
      await AsyncStorage.removeItem(STORAGE.USER_DATA);
    } catch (error) {
      console.log('[Storage] Remove user data error', error);
    }
  };

  isLoggedIn = () => {
    let logged = false;
    if (this.user?.token) {
      logged = true;
    }
    return logged;
  };

  saveFCMToken = async fcmToken => {
    try {
      await AsyncStorage.setItem(STORAGE.FCM_TOKEN, fcmToken);
      this.fcmToken = fcmToken;
    } catch (error) {
      console.log('[Storage] Save fcm token error', error);
    }
  };

  loadFCMToken = async () => {
    try {
      this.fcmToken = await AsyncStorage.getItem(STORAGE.FCM_TOKEN);
    } catch (error) {
      console.log('[Storage] Load fcm token error', error);
    }
  };

  saveUserLanguage = async language => {
    try {
      await AsyncStorage.setItem(STORAGE.USER_LANGUAGE, language);
      this.userLanguage = language;
      if (this.userLanguage) {
        i18n.changeLanguage(this.userLanguage);
      }
    } catch (error) {
      console.log('[Storage] Save user language error', error);
    }
  };

  saveVideoCaches = async videoCaches => {
    try {
      await AsyncStorage.setItem(
        STORAGE.VIDEO_CACHES,
        JSON.stringify(videoCaches),
      );
      this.videoCaches = videoCaches;
    } catch (error) {
      console.log('[Storage] Save video caches error', error);
    }
  };

  loadUserLanguage = async () => {
    let language = '';
    try {
      language = await AsyncStorage.getItem(STORAGE.USER_LANGUAGE);
      console.log('###saved language: ', language);
      if (language) {
        i18n.changeLanguage(language);
      } else {
        language = loadDeviceLanguage();
      }
    } catch (error) {
      console.log('[Storage] Load user language error', error);
      language = loadDeviceLanguage();
    } finally {
      this.userLanguage = language;
    }
    return language;
  };

  loadVideoCaches = async () => {
    let videoCaches = {};
    try {
      const value = await AsyncStorage.getItem(STORAGE.VIDEO_CACHES);
      if (value) {
        videoCaches = JSON.parse(value);
      }
      const keys = _.keys(videoCaches);
      if (keys.length > 0) {
        const promises = keys.map(key =>
          RNFetchBlob.fs.exists(
            videoCaches[key].localUrl.replace('file://', ''),
          ),
        );
        const checkResults = await Promise.all(promises);
        checkResults.forEach((result, index) => {
          if (result !== true) {
            delete videoCaches[keys[index]];
          }
        });
      }
    } catch (error) {
      console.log('[Storage] Load video caches error', error);
    } finally {
      this.videoCaches = videoCaches;
      storage.saveVideoCaches(videoCaches);
      this.clearUnusedCaches();
    }
    return videoCaches;
  };

  clearUnusedCaches = async () => {
    const cacheFileNames = _.keys(this.videoCaches).map(
      key =>
        this.videoCaches[key].localUrl.split('/')[
          this.videoCaches[key].localUrl.split('/').length - 1
        ],
    );

    const isExists = await RNFetchBlob.fs.exists(
      RNFetchBlob.fs.dirs.DocumentDir + '/video',
    );

    if (isExists) {
      const fileNames = await RNFetchBlob.fs.ls(
        RNFetchBlob.fs.dirs.DocumentDir + '/video/',
      );

      fileNames.forEach(async name => {
        if (!cacheFileNames.includes(name)) {
          await RNFetchBlob.fs.unlink(
            RNFetchBlob.fs.dirs.DocumentDir + '/video/' + name,
          );
        }
      });
    }
  };
}

const storage = new Storage();
export default storage;
