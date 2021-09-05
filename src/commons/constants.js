export default {
  DEEP_LINK: 'deep-link',
  HANDLE_DEEPLINK_NOTIFICATION_EVENT_OPNED:
    'HANDLE_DEEPLINK_NOTIFICATION_EVENT_OPNED',
  DEFAULT_CURRENCY: 'VND',
  PRODUCT_PER_PAGE: 50,
  APP_STORE_ID: '',
  GOOGLE_PLAY_ID: '',
  RECENT_LOGGED_IN_USERS_MAX: 5,
};

export const STORAGE = {
  USER_DATA: 'user_data',
  RECENT_LOGGED_IN_USERS_DATA: 'RECENT_LOGGED_IN_USERS_DATA',
  USER_LANGUAGE: 'user_language',
  FCM_TOKEN: 'fcm_token',
  VIDEO_CACHES: 'VIDEO_CACHES',
};

export const OS = {
  IOS: 'ios',
  ANDROID: 'android',
};

export const SERVICES = {
  REQUEST_TIME_OUT: 30 * 1000, // 30s
  CONTENT_TYPE_FORM_URLENCODED: 'application/x-www-form-urlencoded',
  CONTENT_TYPE_APP_JSON: 'application/json',
  CONTENT_TYPE_FORM_DATA: 'multipart/form-data',
};

export const STOCK_STATUS = {
  IN_STOCK: 'instock',
  OUT_OF_STOCK: 'outofstock',
};

export const MENU_LIST = {
  FAVORITE_LIST: 'favorite_list',
  SETTING_LIST: 'setting_list',
  HELP: 'help_list',
};

export const IPHONE_X_BOTTOM_SPACE = 34;

export const GOOGLE_WEB_CLIENT_ID =
  '507203876083-nvi3c972cv48jglpa1fjr2b1nu5b9urj.apps.googleusercontent.com';

export const RESPONSE_STATUS = {
  OK: 'ok',
  ERROR: 'error',
};
export const RESPONSE_ERROR_CODE = {
  EMAIL_PASSWORD_WRONG: 'email-password-wrong',
  EMAIL_NOT_EXISTS: 'email-not-exist',
  VALIDATE_FAIL: 'validate-fail',
  EMAIL_EXIST: 'email-exist',
  EMAIL_EXIST_UPDATE: 'email_exist',
  TOKEN_EXPIRED: 'token-expired',
};

export const CATEGORY_TYPE = {
  POST: 2,
  VIDEO: 10,
};

export const POST_ORDER_BY = {
  DATE: 'ngaydang',
};

export const ORDER_VALUE = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const POST_MENU_TYPE = {
  SHARE: 'SHARE',
  EDIT: 'EDIT',
  HIDE: 'HIDE',
  DELETE: 'DELETE',
  SHOW: 'SHOW',
  SAVE: 'SAVE',
  UNSAVE: 'UNSAVE',
  COPY_LINK: 'COPY_LINK',
  REPORT: 'REPORT',
  SHARE_TO_FACEBOOK: 'SHARE_TO_FACEBOOK',
  SHARE_TO_TWITTER: 'SHARE_TO_TWITTER',
  SHARE_TO_ZALO: 'SHARE_TO_ZALO',
  LIKE: 'LIKE',
  BOOKMARK: 'BOOKMARK',
};

export const FILTER_CONTROL_TYPE = {
  RADIO_BUTTON: 'radio-button',
  CHECK_BOX: 'checkbox',
  RANGE: 'range',
  TEXT_BOX: 'textbox',
  NUMBER: 'number',
};

export const USER_POST_PER_PAGE = {
  POST: 6,
};

export const POST_TYPE = {
  POST: 'post',
  VIDEO: 'video',
};

export const SEARCH_TYPE = {
  POST: 2,
  VIDEO: 10,
};

export const SORT_BY = {
  DATE_OF_POST: 'date_add_to_list',
  VIEW: 'amount_of_view',
};

export const ORDER = {
  DESCENDING: 'DESC',
  ASCENDING: 'ASC',
};

export const CREATE_POST_IDS = {
  IMAGE_POST: 'create_post_image',
  VIDEO_POST: 'create_post_video',
  IMAGE_STORY: 'create_story_image',
  VIDEO_STORY: 'create_story_video',
};

export const POST_STORY_TYPE = {
  NEW: 'new',
  EDIT: 'edit',
};

export const NOTIFICATION_TYPE = {
  CHAT_MESSAGE: 'chat_message',
};

export const NOTIFICATION_RECEIVER_TYPE = {
  POST: 1,
  VIDEO: 2,
  IMAGE_STORY: 3,
  VIDEO_STORY: 4,
  COMMENT_POST: 5,
  COMMENT_VIDEO: 6,
  COMMENT_IMAGE_STORY: 7,
  COMMENT_VIDEO_STORY: 8,
  CHAT: 9,
  ADMIN: 10,
};

export const IMAGE_TYPE = {
  ORIGIN: 'origin',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};
