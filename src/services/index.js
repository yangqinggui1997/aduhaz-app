import FormData from 'form-data';
import _ from 'lodash';

import storage from '../storage';
import ApiClient from './api-client';
import Endpoint, { PATH_PREFIX, SERVER_URL } from './endpoints';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

class RestfullServices {
  init({ onTokenExpired, onRefreshTokenFailed }) {
    this.apiClient = new ApiClient({
      baseURL: SERVER_URL,
      pathPrefix: PATH_PREFIX,
      logOutput: true,
      onTokenExpired,
      onRefreshTokenFailed,
    });
  }

  refreshAccessToken = refreshToken =>
    this.apiClient.post(
      Endpoint.refreshExpiredToken,
      { refresh_token: refreshToken },
      false,
    );
  // Account Api
  logout = () => this.apiClient.get(Endpoint.logout, null, true);
  loginGoogle = data => this.apiClient.post(Endpoint.loginGoogle, data, false);
  loginFb = data => this.apiClient.post(Endpoint.loginFB, data, false);
  loginApple = data => this.apiClient.post(Endpoint.loginApple, data, false);
  login = (email, password) =>
    this.apiClient.post(
      Endpoint.login,
      {
        email,
        password,
      },
      false,
    );
  register = data => this.apiClient.post(Endpoint.register, data, false);

  uploadFile = (files, conversationId) => {
    const formData = new FormData();
    if (_.isArray(files) && !_.isEmpty(files)) {
      files.forEach((file, index) => {
        formData.append(`file_url[${index}]`, {
          uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
          type: file.type,
          name: file.fileName,
        });
      });
    }
    formData.append('key_firebase', conversationId);
    return this.apiClient.postFormData(Endpoint.uploadFile, formData, true);
  };
  turnOnNotificationFromUser = ({ conversationId, sentUserId }) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (conversationId) {
      formData.append('key_firebase', conversationId);
    }
    if (sentUserId) {
      formData.append('id_user_sent', sentUserId);
    }
    return this.apiClient.postFormData(
      Endpoint.turnOnNotificationFromUser,
      formData,
      true,
    );
  };
  turnOffNotificationFromUser = ({ conversationId, sentUserId }) => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (conversationId) {
      formData.append('key_firebase', conversationId);
    }
    if (sentUserId) {
      formData.append('id_user_sent', sentUserId);
    }
    return this.apiClient.postFormData(
      Endpoint.turnOffNotificationFromUser,
      formData,
      true,
    );
  };

  deleteConversationFirebase = conversationId => {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    formData.append('key_firebase', conversationId);
    return this.apiClient.postFormData(
      Endpoint.deleteConversationFirebase,
      formData,
      true,
    );
  };
  getConversationFirebaseById = conversationId => {
    return this.apiClient.get(
      Endpoint.getConversationFirebase,
      { type: 1, key_firebase: conversationId },
      true,
    );
  };

  pushMessageNotification = (title, content, productId, receiverId, extra) => {
    const data = {
      title,
      content,
      id_product: productId,
      receiverId,
      extra: JSON.stringify(extra),
    };
    return this.apiClient.post(Endpoint.pushMessageNotification, data, true);
  };

  getProfile = () => this.apiClient.get(Endpoint.getProfile, null, true);
  changePassword = new_password =>
    this.apiClient.post(Endpoint.changePassword, { new_password }, true);
  checkPassword = password =>
    this.apiClient.post(Endpoint.checkPassword, { password }, true);

  updateProfile = async (fieldName, data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    if (storage.fcmToken && !_.isEmpty(storage.fcmToken)) {
      // formData.append('time', moment().unix());
      formData.append('device_name', await DeviceInfo.getDeviceName());
      formData.append('device_token', storage.fcmToken);
    }
    formData.append(fieldName, data);
    return this.apiClient.postFormData(Endpoint.updateProfile, formData, true);
  };

  getAmountOfNotificationUnread = () => {
    return this.apiClient.get(
      Endpoint.getAmountOfNotificationUnread,
      null,
      true,
    );
  };

  /**
   *
   * @param {*} type Required, numeric, 0 for reset message, 1 for reset notification
   * @returns
   */
  resetAmountOfNotificationUnread = type => {
    const formData = new FormData();
    formData.append('type', type);
    return this.apiClient.postFormData(
      Endpoint.resetAmountOfNotificationUnread,
      formData,
      true,
    );
  };

  markNotificationIsViewed = id => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('_method', 'PUT');
    return this.apiClient.postFormData(
      Endpoint.markNotificationIsViewed,
      formData,
      true,
    );
  };

  updateFcmToken = deviceToken => {
    const formData = new FormData();
    formData.append('device_token', deviceToken);
    formData.append('_method', 'PUT');
    return this.apiClient.postFormData(Endpoint.updateProfile, formData, true);
  };
  updateProfileByForm = async data => {
    const {
      email,
      full_name,
      phone_number,
      address,
      sex,
      id_user,
      // identity_card,
      avatarFile,
    } = data;
    var formData = new FormData();
    console.log(data);

    email && formData.append('email', email);
    full_name && formData.append('full_name', full_name);
    phone_number && formData.append('phone_number', phone_number);
    address && formData.append('address', address);
    sex && formData.append('sex', sex);
    formData.append('_method', 'PUT');
    id_user && formData.append('id_user', id_user);
    // formData.append('identity_card', parseInt(identity_card));
    if (storage.fcmToken && !_.isEmpty(storage.fcmToken)) {
      // formData.append('time', moment().unix());
      formData.append('device_name', await DeviceInfo.getDeviceName());
      formData.append('device_token', storage.fcmToken);
    }

    if (avatarFile) {
      formData.append('avatar', {
        uri: avatarFile.path,
        type: avatarFile.mime,
        name: avatarFile.path.split('/').pop(),
      });
    }

    return this.apiClient.postFormData(Endpoint.updateProfile, formData, true);
  };
  updateCoverPhoto = (coverPhoto, id) => {
    var formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('id_user', id);
    formData.append('cover_photo', {
      uri: coverPhoto.path,
      type: coverPhoto.mime,
      name: coverPhoto.path.split('/').pop(),
    });
    return this.apiClient.postFormData(Endpoint.updateProfile, formData, true);
  };
  getMoney = () => this.apiClient.get(Endpoint.getMoney, null, true);
  forgotPassword = email =>
    this.apiClient.post(Endpoint.forgotPassword, { email }, false);

  // App data Api
  getCategories = params =>
    this.apiClient.get(Endpoint.getCategories, params, false);
  getLocations = params =>
    this.apiClient.get(Endpoint.getLocations, params, false);
  getPropertiesForFilter = params =>
    this.apiClient.get(Endpoint.getpropertiesForFilter, params, false);

  // Home posts Api
  getPosts = query => this.apiClient.post(Endpoint.getPosts, query, false);
  getPostById = id => this.apiClient.get(Endpoint.getPost, { id }, true);
  likePost = id => this.apiClient.post(Endpoint.likePost, { id }, true);
  unlikePost = id => this.apiClient.post(Endpoint.unlikePost, { id }, true);

  // Home video Api
  getVideos = query => this.apiClient.get(Endpoint.getVideos, query, false);
  getVideo = id => this.apiClient.get(Endpoint.getVideo, { id }, false);
  likeVideo = id => this.apiClient.post(Endpoint.likeVideo, { id }, false);
  unlikeVideo = id => this.apiClient.post(Endpoint.unlikeVideo, { id }, false);
  saveVideo = id => this.apiClient.post(Endpoint.saveVideo, { id: id }, true);
  unsaveVideo = id =>
    this.apiClient.post(Endpoint.unsaveVideo, { id: id }, true);

  // User posts
  getSalingPost = query => this.apiClient.get(Endpoint.getSaling, query, true);
  getDenyPost = query => this.apiClient.get(Endpoint.getRefused, query, true);
  getNeedToPay = query =>
    this.apiClient.get(Endpoint.getNeedToPay, query, true);
  getHidden = query => this.apiClient.get(Endpoint.getHidden, query, true);
  getOther = query => this.apiClient.get(Endpoint.getOther, query, true);
  getStatisticsPost = query =>
    this.apiClient.get(Endpoint.statisticsOfPost, query, true);
  getStatisticsVideo = query =>
    this.apiClient.get(Endpoint.statisticsOfVideo, query, true);
  hidePost = query => this.apiClient.post(Endpoint.hidePost, query, true);
  showPost = query => this.apiClient.post(Endpoint.showPost, query, true);
  getSavedList = query =>
    this.apiClient.get(Endpoint.getSavedList, query, true);
  getFavoriteImagePosts = query =>
    this.apiClient.get(Endpoint.getFavoriteImagePosts, query, true);
  getFavoriteVideoPosts = query =>
    this.apiClient.get(Endpoint.getFavoriteVideoPosts, query, true);
  getFavoriteImageStories = query =>
    this.apiClient.get(Endpoint.getFavoriteImageStories, query, true);
  getFavoriteVideoStories = query =>
    this.apiClient.get(Endpoint.getFavoriteVideoStories, query, true);
  unSavePost = id => this.apiClient.post(Endpoint.unSavePost, { id }, true);
  savePost = id => this.apiClient.post(Endpoint.savePost, { id }, true);
  getFollower = query => this.apiClient.get(Endpoint.getFollowers, query, true);
  getFollowings = query =>
    this.apiClient.get(Endpoint.getFollowings, query, true);
  follow = id => this.apiClient.post(Endpoint.follow, { id_user: id }, true);
  unfollow = id =>
    this.apiClient.post(Endpoint.unfollow, { id_user: id }, true);
  getMoneyPackages = () =>
    this.apiClient.get(Endpoint.getMoneyPackages, null, false);
  getMoney = () => this.apiClient.get(Endpoint.getMoney, null, true);
  getPushPostPackages = () =>
    this.apiClient.get(Endpoint.getPushPostPackages, null, true);
  likeImageStory = id =>
    this.apiClient.post(Endpoint.likeImageStory, { id }, true);
  unlikeImageStory = id =>
    this.apiClient.post(Endpoint.unlikeImageStory, { id }, true);

  deleteVideo = query => this.apiClient.post(Endpoint.deleteVideo, query, true);

  // Search
  getSuggestion = searchText =>
    this.apiClient.get(
      Endpoint.getSuggestion,
      { key_search: searchText },
      false,
    );
  search = ({ keySearch, type, stateId, categoryId, postPerPage, page }) =>
    this.apiClient.get(
      `${Endpoint.search}?keySearch=${keySearch}&type=${type}&state=${stateId}&category=${categoryId}&post_per_page=${postPerPage}&page=${page}`,
      null,
      true,
    );
  getSearchSuggestions = ({ searchText, type }) =>
    this.apiClient.get(
      `${Endpoint.getSearchSuggestions}?keySearch=${searchText}&type=${type}`,
      null,
      false,
    );
  getSearchHistories = type =>
    this.apiClient.get(`${Endpoint.getSearchHistories}?type=${type}`);
  deleteSearchHistory = (keySearch, type) =>
    this.apiClient.delete(
      `${Endpoint.deleteSearchHistory}?keySearch=${keySearch}&type=${type}`,
    );
  deleteSearchHistories = type =>
    this.apiClient.delete(`${Endpoint.deleteSearchHistories}?type=${type}`);

  getPostsRelate = (params = {}) =>
    this.apiClient.get(Endpoint.getPostsRelate, params);
  getVideosRelate = params =>
    this.apiClient.get(Endpoint.getVideosRandom, params);

  // Comment Api
  postComment = params =>
    this.apiClient.post(Endpoint.createComment, params, true);
  getComments = params =>
    this.apiClient.get(Endpoint.getComment, params, false);
  likeComment = params =>
    this.apiClient.post(Endpoint.likeComment, params, false);
  unlikeComment = params =>
    this.apiClient.post(Endpoint.unlikeComment, params, false);
  deleteComment = params =>
    this.apiClient.post(Endpoint.deleteComment, params, true);
  postStoryComment = params =>
    this.apiClient.post(Endpoint.createStoryComment, params, true);
  getStoryComments = params =>
    this.apiClient.get(Endpoint.getStoryComment, params, false);
  likeStoryComment = params =>
    this.apiClient.post(Endpoint.likeStoryComment, params, false);
  unlikeStoryComment = params =>
    this.apiClient.post(Endpoint.unlikeStoryComment, params, false);
  deleteStoryComment = params =>
    this.apiClient.post(Endpoint.deleteStoryComment, params, true);

  // Create Post
  createVideoPost = (
    categoryId,
    description,
    videoFile,
    poster,
    onUploadProgress = null,
  ) => {
    var formData = new FormData();
    if (categoryId) {
      formData.append('id_video_category', categoryId);
    }
    formData.append('description', description);
    formData.append('video', {
      uri: videoFile.path,
      type: videoFile.mime,
      name: videoFile.path.split('/').pop(),
    });
    formData.append('poster', poster);

    return this.apiClient.postFormData(
      Endpoint.createVideoPost,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };
  updateVideoPost = (
    postId,
    categoryId,
    description,
    onUploadProgress = null,
  ) => {
    var formData = new FormData();
    if (categoryId) {
      formData.append('id_video_category', categoryId);
    }
    formData.append('description', description);
    formData.append('_method', 'PUT');
    formData.append('id_video', postId);

    return this.apiClient.postFormData(
      Endpoint.updateVideoPost,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };
  createImagePost = (params, onUploadProgress = null) => {
    var formData = new FormData();
    _.keys(params).forEach(key => {
      console.log(key);
      if (key === 'images') {
        params[key].forEach(image => {
          formData.append('image[]', {
            uri: image.uri,
            type: 'image/' + image.uri.split('.').pop(),
            name: image.uri.split('/').pop(),
          });
        });
      } else if (key === 'features') {
        formData.append('features', JSON.stringify(params[key]));
      } else {
        formData.append(key, params[key]);
      }
    });

    return this.apiClient.postFormData(
      Endpoint.createPost,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };
  updateImagePost = (params, onUploadProgress = null) => {
    var formData = new FormData();
    _.keys(params).forEach(key => {
      console.log(key);
      if (key === 'images') {
        params[key].forEach(image => {
          formData.append('image[]', {
            uri: image.uri,
            type: 'image/' + image.uri.split('.').pop(),
            name: image.uri.split('/').pop(),
          });
        });
      } else if (key === 'unlink_images') {
        params[key].forEach(id => {
          formData.append('unlink_images[]', id);
        });
      } else if (key === 'features') {
        formData.append('features', JSON.stringify(params[key]));
      } else {
        formData.append(key, params[key]);
      }
    });
    formData.append('_method', 'PUT');

    return this.apiClient.postFormData(
      Endpoint.updatePost,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };

  // Create Post
  createVideoStory = (params, onUploadProgress = null) => {
    var formData = new FormData();
    _.keys(params).forEach(key => {
      console.log(key);
      if (key === 'video') {
        const videoFile = params[key];
        formData.append('video', {
          uri: videoFile.path,
          type: `video/${videoFile.path.split('.').pop()}`,
          name: videoFile.path.split('/').pop(),
        });
      } else {
        formData.append(key, params[key]);
      }
    });
    // console.log('###formData: ', formData);
    return this.apiClient.postFormData(
      Endpoint.createVideoStory,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };
  createImageStory = (params, onUploadProgress = null) => {
    var formData = new FormData();
    _.keys(params).forEach(key => {
      console.log(key);
      if (key === 'images') {
        params[key].forEach(image => {
          formData.append('image[]', {
            uri: image,
            type: 'image/' + image.split('.').pop(),
            name: image.split('/').pop(),
          });
        });
      } else {
        formData.append(key, params[key]);
      }
    });

    return this.apiClient.postFormData(
      Endpoint.createImageStory,
      formData,
      true,
      null,
      onUploadProgress,
    );
  };
  getImageStories = query =>
    this.apiClient.get(Endpoint.getImageStories, query, false);
  getImageStoryById = query =>
    this.apiClient.get(Endpoint.getImageStoryById, query, false);
  getVideoStories = query =>
    this.apiClient.get(Endpoint.getVideoStories, query, false);
  getVideoStoryById = query =>
    this.apiClient.get(Endpoint.getVideoStoryById, query, false);
  deleteVideoStory = query =>
    this.apiClient.post(Endpoint.deleteVideoStory, query, true);
  deleteImageStory = query =>
    this.apiClient.post(Endpoint.deleteImageStory, query, true);
  updateImageStory = query =>
    this.apiClient.post(Endpoint.updateImageStory, query, true);
  updateVideoStory = query =>
    this.apiClient.post(Endpoint.updateVideoStory, query, true);

  getPropertiesForCreatePost = categoryId =>
    this.apiClient.get(
      Endpoint.getPropertiesForCreatePost,
      { id: categoryId },
      true,
    );

  getFormsForCreatePost = categoryId =>
    this.apiClient.get(
      Endpoint.getFormsForCreatePost,
      { id: categoryId },
      true,
    );

  // chat
  createConversation = (sellerId, productId, firebaseId) =>
    this.apiClient.post(Endpoint.createConversation, {
      id_user_create_post: sellerId,
      id_product: productId,
      key_firebase: firebaseId,
    });

  //music store
  getTopics = ({ order, orderBy, itemPerPage, page }) =>
    this.apiClient.get(
      `${Endpoint.getTopics}?order=${order}&order_by=${orderBy}&song_category_per_page=${itemPerPage}&page=${page}`,
    );
  getMusicByTopic = ({
    musicPerTopic,
    page,
    topics,
    topicOrder,
    topicOrderBy,
  }) =>
    this.apiClient.get(
      `${Endpoint.getSongByTopic}?get_hot_category=&song_per_page=${musicPerTopic}&page=${page}&song_category_per_page=${topics}&song_category_order=${topicOrder}&song_category_order_by=${topicOrderBy}`,
    );
  getSongs = ({ topicId, songPerPage, page, order, orderBy, keySearch }) =>
    this.apiClient.get(
      `${Endpoint.getSongs}?id_song_category=${topicId}&song_per_page=${songPerPage}&page=${page}&key_search=${keySearch}&order=${order}&order_by=${orderBy}`,
    );
  uploadSong = (categoryId, name, singer, author, songFile) => {
    var formData = new FormData();
    formData.append('id_song_category', categoryId);
    formData.append('name', name);
    formData.append('single_name', singer);
    formData.append('author_name', author);
    formData.append('audio', {
      uri: songFile.fileCopyUri.startsWith('file://')
        ? songFile.fileCopyUri
        : `file://${songFile.fileCopyUri}`,
      type: songFile.type,
      name: songFile.name,
    });
    return this.apiClient.postFormData(Endpoint.uploadSong, formData, true);
  };

  postReport = data => this.apiClient.post(Endpoint.postReport, data);

  getUserInfo = userId =>
    this.apiClient.get(`${Endpoint.getUserInfo}?id_user=${userId}`);

  userGetAllPost = userId =>
    this.apiClient.get(Endpoint.userGetAllPost, {
      id_user: userId,
      order: 'ASC',
    });

  userGetAllStory = userId =>
    this.apiClient.get(Endpoint.userGetAllStory, {
      id_user: userId,
      order: 'ASC',
    });

  userRating = data => this.apiClient.post(Endpoint.userRating, data);

  getNotifications = (data = null) =>
    this.apiClient.get(Endpoint.notification + '/getNotifications', data);
  hideNotification = id =>
    this.apiClient.put(Endpoint.notification + '/hideNotification', {
      id,
      _method: 'PUT',
    });
  report = data => this.apiClient.post(Endpoint.report, data);
  feedback = data => this.apiClient.post(Endpoint.feedback, data);

  userGetEvaluateDetail = userId =>
    this.apiClient.get(Endpoint.userGetEvaluateDetail, {
      id_user: userId,
    });
  addSocialLink = (data = {}) => {
    data._method = 'PUT';
    return this.apiClient.post(Endpoint.addSocialLink, data);
  };
  removeSocialLink = (data = {}) => {
    data._method = 'PUT';
    return this.apiClient.post(Endpoint.removeSocialLink, data);
  };
  turnOnVerifications = (data = {}) => {
    data._method = 'PUT';
    data.sms = '';
    return this.apiClient.post(Endpoint.turnOnVerifications, data);
  };
  turnOffVerifications = (data = {}) => {
    data._method = 'PUT';
    return this.apiClient.post(Endpoint.turnOffVerifications, data);
  };
  removeDevice = (data = {}) => {
    data._method = 'DELETE';
    return this.apiClient.post(Endpoint.removeDevice, data);
  };
  getDevices = (data = {}) => this.apiClient.get(Endpoint.getDevices, data);
  deletePost = (id, _method = 'DELETE') =>
    this.apiClient.post(Endpoint.deletePost, { id, _method });
  getSuggestionWordEvaluate = categoryId =>
    this.apiClient.get(Endpoint.getSuggestionWordEvaluate, {
      id_category: categoryId,
    });

  turnOnMessageFromUser = fbConversationId => {
    const formData = new FormData();
    formData.append('key_firebase', fbConversationId);
    formData.append('_method', 'PUT');
    return this.apiClient.postFormData(
      Endpoint.turnOnMessageFromUser,
      formData,
      true,
    );
  };

  turnOffMessageFromUser = fbConversationId => {
    const formData = new FormData();
    formData.append('key_firebase', fbConversationId);
    formData.append('_method', 'DELETE');
    return this.apiClient.postFormData(
      Endpoint.turnOffMessageFromUser,
      formData,
      true,
    );
  };

  blockUser = userId => {
    const formData = new FormData();
    formData.append('userId', userId);
    return this.apiClient.postFormData(Endpoint.blockUser, formData, true);
  };

  unBlockUser = userId => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('_method', 'DELETE');
    return this.apiClient.postFormData(Endpoint.unBlockUser, formData, true);
  };

  checkGetMessage = (fbConversationId, receiverId) => {
    const formData = new FormData();
    formData.append('key_firebase', fbConversationId);
    formData.append('receiver_id', receiverId);
    return this.apiClient.postFormData(
      Endpoint.checkGetMessage,
      formData,
      true,
    );
  };
}

const restfullServices = new RestfullServices();
export default restfullServices;
