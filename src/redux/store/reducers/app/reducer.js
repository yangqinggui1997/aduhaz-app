import actionTypes from './type';

const initialState = {
  initializing: false,
  user: null,
  openingConversation: null,
  notification: {
    openedNotification: null,
    numberOfUnreadMessage: 0,
    numberOfUnreadNotify: 0,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.APP_INITIALIZING_CHANGED:
      return {
        ...state,
        initializing: action.initializing,
      };
    case actionTypes.USER_CHANGED:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.OPENING_CONVERSATION:
      return {
        ...state,
        openingConversation: action.openingConversation,
      };
    case actionTypes.NOTIFICATION:
      return {
        ...state,
        notification: { ...state.notification, ...action.notification },
      };
    default:
      return state;
  }
}
