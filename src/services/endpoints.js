export const WEBSITE_URL = 'http://aduhaz.vn';
export const SERVER_URL = 'https://api.aduhaz.com';
// export const SERVER_URL = 'https://wowo.greenapps.vn';
//
// https://wowo.greenapps.ven
export const PATH_PREFIX = '';

export default {
  logout: '/user/logout',
  refreshExpiredToken: '/auth/refresh',
  login: '/auth/token',
  updateProfile: '/user/update',
  checkPassword: '/user/checkPassword',
  changePassword: '/user/changePassword',
  loginGoogle: '/auth/loginGoogle',
  loginFB: '/auth/loginFB',
  loginApple: '/auth/loginApple',
  register: '/user/create',
  getMoney: '/user/money',
  getProfile: '/user/me',
  forgotPassword: '/user/reset',
  getPosts: '/post/get',
  getPost: '/post',
  createPost: '/post/create',
  updatePost: '/post/update',
  likePost: '/post/like',
  unlikePost: '/post/unlike',
  deletePost: '/post/delete',
  getSaling: '/post/getSaling',
  getRefused: '/post/getRefused',
  getNeedToPay: '/post/getNeedToPay',
  getHidden: '/post/getHidden',
  getOther: '/post/getOther',
  statisticsOfPost: '/post/statisticsOfPost',
  hidePost: '/post/hidePost',
  showPost: '/post/showPost',
  getFavoriteImagePosts: '/user/getLikeListPost',
  getFavoriteVideoPosts: '/user/getLikeListVideo',
  getFavoriteImageStories: '/user/getLikeListStoryImage',
  getFavoriteVideoStories: '/user/getLikeListStoryVideo',
  getPoperties: '/post/getPoperties',
  getSavedList: '/user/getSaveList',
  savePost: '/post/savePost',
  unSavePost: '/post/unsavePost',
  getFollowers: '/user/getFollowerList',
  getFollowings: '/user/getFollowingList',
  follow: '/user/follow',
  unfollow: '/user/unfollow',
  getMoneyPackages: '/getMoneyPackages',
  getPushPostPackages: '/getPackagesOfPushPost',
  likeImageStory: '/storyImage/like',
  unlikeImageStory: '/storyImage/unlike',

  //search
  getSuggestion: '/post/getSuggestionKeySearch',

  //video
  getVideos: '/video/get',
  getVideo: '/video',
  getVideosRandom: '/video/relate',
  likeVideo: '/video/like',
  unlikeVideo: '/video/unlike',
  saveVideo: '/video/saveVideo',
  unsaveVideo: '/video/unsaveVideo',
  createVideoPost: '/video/create',
  deleteVideo: '/video/delete',
  statisticsOfVideo: '/video/statisticsOfVideo',
  updateVideoPost: '/video/update',

  //category
  getCategories: '/category/get',
  getpropertiesForFilter: '/category/propertiesForFilter',
  getPropertiesForCreatePost: '/category/propertiesForCreatePost',
  getFormsForCreatePost: '/category/getFormsForCreatePost',

  //comment
  getComment: '/comment/get',
  likeComment: '/comment/like',
  unlikeComment: '/comment/unlike',
  createComment: '/comment/create',
  deleteComment: '/comment/delete',
  getStoryComment: '/comment_story/get',
  createStoryComment: '/comment_story/create',
  likeStoryComment: '/comment_story/like',
  unlikeStoryComment: '/comment_story/unlike',
  deleteStoryComment: '/comment_story/delete',

  //upload
  uploadVideo: '/upload/video',
  uploadImage: '/upload/image',
  uploadAudio: '/upload/audio',
  uploadFile: '/upload',

  //location
  getLocations: '/location/get',

  // posts related
  getPostsRelate: '/post/relate',

  // chat
  createConversation: '/user/chat/createConversationFirebase',

  // search
  search: '/search/search',
  getSearchSuggestions: '/search/suggestion',
  getSearchHistories: '/search/history',
  deleteSearchHistory: '/search/history',
  deleteSearchHistories: '/search/history/all',

  // story
  createVideoStory: '/storyVideo/create',
  createImageStory: '/storyImage/create',
  updateImageStory: '/storyImage/update',
  updateVideoStory: '/storyVideo/update',
  getImageStories: '/storyImage/get',
  getImageStoryById: '/storyImage',
  deleteImageStory: '/storyImage/delete',
  getVideoStories: '/storyVideo/get',
  getVideoStoryById: '/storyVideo',
  deleteVideoStory: '/storyVideo/delete',

  //music store
  getTopics: '/song/getCategories',
  getSongByTopic: '/song/getSongByCategory',
  getSongs: '/song/get',
  uploadSong: '/song/create',

  postReport: 'post/report',
  getUserInfo: 'user/getInfomations',
  userGetAllPost: 'user/getAllPost',
  userGetAllStory: 'user/getAllStory',

  userRating: 'user/createEvaluate',
  notification: '/user/notification',
  report: '/user/stuckReport',
  feedback: '/user/feedbackAduhaz',

  // notifications
  turnOnNotificationFromUser: 'user/notification/turnOnNotificationFromUser',
  turnOffNotificationFromUser: 'user/notification/turnOffNotificationFromUser',
  deleteConversationFirebase: 'user/chat/deleteConversationFirebase',
  getConversationFirebase: 'user/chat/getConversationFirebase',
  pushMessageNotification: 'user/notification/pushMessageNotification',
  getAmountOfNotificationUnread:
    'user/notification/getAmountOfNotificationUnread',
  resetAmountOfNotificationUnread:
    'user/notification/resetAmountOfNotificationUnread',
  markNotificationIsViewed: 'user/notification/markNotificationIsViewed',
  // rating
  userGetEvaluateDetail: 'user/getEvaluateDetails',

  //
  addSocialLink: 'user/addSocialLink',
  removeSocialLink: 'user/removeSocialLink',
  turnOnVerifications: 'user/turnOnVerifications',
  turnOffVerifications: 'user/turnOffVerifications',
  removeDevice: 'user/removeDevice',
  getDevices: 'user/getDevices',

  getSuggestionWordEvaluate: '/getSuggestionWordEvaluate',

  turnOnMessageFromUser: '/user/chat/turnOnMessageFromUser',
  turnOffMessageFromUser: '/user/chat/turnOffMessageFromUser',
  checkGetMessage: '/user/chat/checkGetMessage',
  unBlockUser: '/user/unBlockUser',
  blockUser: 'user/blockUser',
};
