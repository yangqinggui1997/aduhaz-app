import Constants, { IMAGE_TYPE, OS } from './constants';
import { Dimensions, Image, Linking, Platform } from 'react-native';

import Colors from '../theme/colors';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import i18n from 'i18next';
import moment from 'moment';
import numeral from 'numeral';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from './constants';
import CryptoJS from 'crypto-js';

import storage from '../storage';
import RNFetchBlob from 'rn-fetch-blob';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class Utils {
  static isIOS = () => {
    return Platform.OS === OS.IOS;
  };

  static isAndroid = () => {
    return Platform.OS === OS.ANDROID;
  };

  static getScreenWidth = () => {
    return screenWidth;
  };

  static getScreenHeight = () => {
    return screenHeight;
  };

  static getHeightPercent = percent => {
    return screenHeight * percent * 0.01;
  };

  static getWidthPercent = percent => {
    return screenWidth * percent * 0.01;
  };

  static isEmptyString = str => {
    const string = str !== undefined || str !== null ? String(str) : '';
    return !str || string.length === 0 || !string.trim();
  };

  static isEmptyArray = array => {
    return array === undefined || array === null || array.length === 0;
  };

  static isFunction = func => {
    return func && typeof func === 'function';
  };

  static isEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  static isResponseSuccess = response => {
    return (
      response &&
      response.status === 200 &&
      response.data &&
      response.data.status === RESPONSE_STATUS.OK
    );
  };
  static isResponseExpiredToken = response => {
    return (
      response &&
      response.status === 200 &&
      response.data &&
      response.data.status === RESPONSE_STATUS.ERROR &&
      response.data.code === RESPONSE_ERROR_CODE.TOKEN_EXPIRED
    );
  };

  static removeEmptyAttributes = data => {
    let obj = data;
    if (obj) {
      obj = { ...data };
      Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        }
      });
    }
    return obj;
  };

  static elevationShadowStyle = (elevation, shadowColor = Colors.black) => {
    return {
      elevation,
      shadowColor,
      shadowOffset: { width: 0, height: 0.5 * elevation },
      shadowOpacity: 0.3,
      shadowRadius: 0.8 * elevation,
    };
  };

  static convertTimeToTimestamp = time => {
    return Date.parse(time);
  };

  static isNumber = num => {
    const regex = /^\d+$/;
    return regex.test(num);
  };

  static isIphoneX = () => {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (dimen.height === 812 ||
        dimen.width === 812 ||
        dimen.height === 844 ||
        dimen.width === 844 ||
        dimen.height === 896 ||
        dimen.width === 896 ||
        dimen.height === 926 ||
        dimen.width === 926)
    );
  };

  static getAppVersion = () => DeviceInfo.getVersion();

  static parseTime = dateTime => {
    return moment(dateTime).format('h:mm A');
  };

  static parseDate = dateTime => {
    return moment(dateTime).format('DD MMM YYYY');
  };

  static parseFullDateTime = dateTime => {
    return moment(dateTime).format('DD MMM [at] h:mm A');
  };

  static checkDateIsToday = dateTime => {
    return this.isSameDay(dateTime, new Date());
  };

  static checkDateIsYesterday = dateTime => {
    return moment().subtract(1, 'd').isSame(moment(dateTime), 'd');
  };

  static checkDateIsTomorrow = dateTime => {
    return moment(dateTime).subtract(1, 'd').isSame(moment(), 'd');
  };

  static isSameDay = (firstDate, secondDate) => {
    return moment(firstDate).isSame(moment(secondDate), 'd');
  };

  static isSameTime = (firstDate = new Date(), secondDate = new Date()) => {
    return moment(firstDate).isSame(moment(secondDate));
  };

  static calculateProgressTime = (from, to) => {
    const fromTime = moment(from);
    const toTime = moment(to);
    const today = moment();
    const diff = toTime.diff(fromTime, 'days');
    const diffToday = toTime.diff(today, 'days');

    return {
      range: diff,
      remain: diffToday,
    };
  };

  static formatNumber = num => {
    // return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return numeral(num).format('0,0');
  };

  static formatPrice = num => {
    if (
      num === null ||
      num === 0 ||
      num === undefined ||
      _.isNaN(num) ||
      num === ''
    ) {
      return 'Liên hệ';
    }
    if (num % 1000000 !== 0) {
      return `${this.formatNumber(num).replace(/,/g, '.')} đ`;
    } else {
      const mValue = num / 1000000;
      if (mValue < 1000) {
        return `${String(mValue).replace(/\./g, ',')} triệu đ`;
      } else {
        return `${String(mValue / 1000).replace(/\./g, ',')} tỷ đ`;
      }
    }
  };

  static isNotNullAndUndefined = value => {
    return !_.isNull(value) && !_.isUndefined(value);
  };

  static isNotEmpty = value => {
    return !_.isEmpty(value);
  };

  static openAppOnStore() {
    const url = Platform.select({
      ios: `https://itunes.apple.com/vn/app/${Constants.APP_STORE_ID}`,
      android: `https://play.google.com/store/apps/details?id=${Constants.GOOGLE_PLAY_ID}`,
    });
    return Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      }
    });
  }

  static generateMonthsInYear = (monthFormat = 'MM-yyyy') => {
    const months = [];
    const dateStart = moment().set('month', 0);
    const dateEnd = moment(dateStart).add(11, 'month');
    while (dateEnd.diff(dateStart, 'months') >= 0) {
      months.push(dateStart.format(monthFormat));
      dateStart.add(1, 'month');
    }
    return months;
  };

  static getImageSizeFromUri = uri =>
    new Promise(
      (resolve, reject) => {
        Image.getSize(uri, (width, height) => {
          resolve({ width, height });
        });
      },
      error => reject(error),
    );

  static getPostTime = postDate => {
    const seconds = parseInt(
      (new Date().getTime() - postDate.getTime()) / 1000,
    );
    if (seconds < 60) {
      return i18n.t('justPost');
    } else {
      const minutes = parseInt(seconds / 60);
      if (minutes < 60) {
        return `${minutes} ${
          minutes > 1 ? i18n.t('minutes') : i18n.t('minute')
        }`;
      } else {
        const hours = parseInt(minutes / 60);
        if (hours < 24) {
          return `${hours} ${hours > 1 ? i18n.t('hours') : i18n.t('hour')}`;
        } else {
          const days = parseInt(hours / 24);
          if (days < 7) {
            return `${days} ${days > 1 ? i18n.t('days') : i18n.t('day')}`;
          } else {
            return moment(postDate).format('DD/MM/YYYY');
          }
        }
      }
    }
  };

  static parseInteraction = interactions => {
    if (interactions < 1000) {
      return interactions;
    } else if (interactions < 1000000) {
      if (interactions % 1000 === 0) {
        return interactions / 1000 + ' K';
      } else {
        var _floatToString = (interactions / 1000).toString();
        if (
          _floatToString.slice(
            _floatToString.indexOf('.'),
            _floatToString.indexOf('.') + 2,
          ) == 0
        ) {
          _floatToString = _floatToString.slice(0, _floatToString.indexOf('.'));
        } else {
          _floatToString = _floatToString.slice(
            0,
            _floatToString.indexOf('.') + 2,
          );
        }
        return _floatToString + ' K';
      }
    } else {
      if (interactions % 1000000 === 0) {
        return interactions / 1000000 + ' M';
      } else {
        var _floatToString = (interactions / 1000000).toString();
        if (
          _floatToString.slice(
            _floatToString.indexOf('.'),
            _floatToString.indexOf('.') + 2,
          ) == 0
        ) {
          _floatToString = _floatToString.slice(0, _floatToString.indexOf('.'));
        } else {
          _floatToString = _floatToString.slice(
            0,
            _floatToString.indexOf('.') + 2,
          );
        }
        return _floatToString + ' M';
      }
    }
  };

  static getSongDurationString = seconds => {
    const _seconds = parseInt(seconds);
    if (seconds < 0) {
      return '0:0';
    } else if (seconds < 60) {
      return `0:${seconds}`;
    } else {
      const minutes = parseInt(_seconds / 60);
      const s = _seconds - minutes * 60;
      return `${minutes}:${s < 10 ? '0' : ''}${s}`;
    }
  };

  static getVideoPlayTime = seconds => {
    const _seconds = parseInt(seconds);
    if (_seconds < 60) {
      return `0:${_seconds < 10 ? '0' : ''}${_seconds}`;
    } else {
      const minutes = parseInt(_seconds / 60);
      const s = _seconds - minutes * 60;
      return `${minutes}:${s < 10 ? '0' : ''}${s}`;
    }
  };

  static getShortenNumberString = number => {
    if (!number || !_.isNumber(number) || number < 1000) {
      return number;
    } else if (number < 1000000) {
      return `${~~(number / 1000)}K`;
    } else {
      return `${~~(number / 1000000)}M`;
    }
  };

  static formatVNPrice = price => `${this.formatNumber(price)} đồng`;

  static encrypt = text => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
  };

  static decrypt = data => {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  };

  static validateVNPhoneNumber = number => {
    const reg = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    return reg.test(number);
  };

  static cacheVieo = async videoUrl => {
    let fileUrl = this.detachVideoFileUrl(videoUrl);
    const cachedVideo = storage.videoCaches[fileUrl];
    if (!cachedVideo) {
      const parts = fileUrl.split('/');
      const fileName = parts[parts.length - 1];
      const localPath = RNFetchBlob.fs.dirs.DocumentDir + '/video/' + fileName;

      try {
        const isFileExists = await RNFetchBlob.fs.exists(localPath);
        if (!isFileExists) {
          const downloadResult = await RNFetchBlob.config({
            path: localPath,
          }).fetch('GET', fileUrl);
          if (downloadResult.info().status === 200) {
            let videoCaches = { ...storage.videoCaches };
            videoCaches[fileUrl] = {
              localUrl: localPath.includes('file://')
                ? localPath
                : `file://${localPath}`,
              createdAt: new Date().toISOString(),
            };

            if (_.keys(videoCaches).length > 20) {
              const videoArr = _.keys(videoCaches)
                .map(key => {
                  return {
                    key,
                    ...videoCaches[key],
                  };
                })
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
              await RNFetchBlob.fs.unlink(
                videoCaches[videoArr[0].key].localUrl.replace('file://', ''),
              );
              delete videoCaches[videoArr[0].key];
              storage.saveVideoCaches(videoCaches);
            }
            storage.saveVideoCaches(videoCaches);
          } else {
            await RNFetchBlob.fs.unlink(localPath);
          }
        }
      } catch (err) {
        console.log('DOWNLOAD FILE ERROR: ', err);
      }
    }
  };

  static getCachedVideoUrl = videoUrl => {
    let fileUrl = this.detachVideoFileUrl(videoUrl);
    const cachedVideo = storage.videoCaches[fileUrl];
    if (cachedVideo) {
      return cachedVideo.localUrl;
    }
    return videoUrl;
  };

  static detachVideoFileUrl = videoUrl => {
    if (_.isEmpty(videoUrl)) {
      return '';
    }
    let fileUrl = videoUrl;
    const urlParts = videoUrl.split('?');
    if (urlParts.length > 1) {
      const params = urlParts[urlParts.length - 1].split('&');
      const url = params
        .find(param => param.includes('file_url'))
        ?.split('=')[1];
      if (url) {
        fileUrl = decodeURIComponent(url);
      }
    }
    return fileUrl;
  };

  static getNotifyTime = time => {
    const date = new Date(time * 1000);
    const seconds = parseInt((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) {
      return i18n.t('justPost');
    } else {
      const minutes = parseInt(seconds / 60);
      if (minutes < 60) {
        return `${minutes} ${
          minutes > 1 ? i18n.t('minutes') : i18n.t('minute')
        }`;
      } else {
        const hours = parseInt(minutes / 60);
        if (hours < 24) {
          return `${hours} ${hours > 1 ? i18n.t('hours') : i18n.t('hour')}`;
        } else {
          const days = parseInt(hours / 24);
          if (days < 30) {
            return `${days} ${days > 1 ? i18n.t('days') : i18n.t('day')}`;
          } else {
            return moment(time).format('DD/MM/YYYY');
          }
        }
      }
    }
  };

  static getClipUrl = videoItem => {
    let url = videoItem.videoUrl;
    if (videoItem.video) {
      if (videoItem.video.clip && !_.isEmpty(videoItem.video.clip)) {
        url = videoItem.video.clip;
      } else if (
        videoItem.video.encoded &&
        !_.isEmpty(videoItem.video.encoded)
      ) {
        url = videoItem.video.encoded;
      }
    }
    return url;
  };

  static getEncodedVideoUrl = videoItem => {
    let url = videoItem.videoUrl;
    if (
      videoItem.video &&
      videoItem.video.encoded &&
      !_.isEmpty(videoItem.video.encoded)
    ) {
      url = videoItem.video.encoded;
    }
    return url;
  };

  static getResizedImageUri = (originalUri, type) => {
    if (originalUri && originalUri.startsWith('http')) {
      var uriParts = originalUri.split('/');
      var fileName = uriParts[uriParts.length - 1];

      switch (type) {
        case IMAGE_TYPE.SMALL: {
          fileName = `${fileName.split('.')[0]}-small.jpeg`;
          break;
        }
        case IMAGE_TYPE.MEDIUM: {
          fileName = `${fileName.split('.')[0]}-medium.jpeg`;
          break;
        }
        case IMAGE_TYPE.LARGE: {
          fileName = `${fileName.split('.')[0]}-large.jpeg`;
          break;
        }
        case IMAGE_TYPE.ORIGIN:
        default:
          break;
      }

      uriParts[uriParts.length - 1] = fileName;
      const resizeImageUri = uriParts.join('/');
      return resizeImageUri;
    }
    return originalUri;
  };

  static debounce = function (callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;

    const later = () => callback.apply(context, callbackArgs);

    return function () {
      /* eslint-disable prefer-rest-params */
      callbackArgs = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  static humanFileSize = size => {
    const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['B', 'KB', 'MB', 'GB', 'TB'][i]
    );
  };
}
