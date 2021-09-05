import actionTypes from './type';

const initialState = {
  passData: null,
  passStoryImage: null,
  passStoryVideo: null,
  shouldRefreshHome: false,
  shouldRefreshHomeVideo: false,
  switchToTabIndex: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_PASS_DATA:
      return {
        ...state,
        passData: action.passData,
      };
    case actionTypes.SET_PASS_STORY_IMAGE:
      return {
        ...state,
        passStoryImage: action.passData,
      };
    case actionTypes.SET_PASS_STORY_VIDEO:
      return {
        ...state,
        passStoryVideo: action.passData,
      };
    case actionTypes.SET_REFRESH_HOME:
      return {
        ...state,
        shouldRefreshHome: action.payload,
      };
    case actionTypes.SET_REFRESH_HOME_VIDEO:
      return {
        ...state,
        shouldRefreshHomeVideo: action.payload,
      };
    case actionTypes.SWITCH_TO_TAB_INDEX:
      return {
        ...state,
        switchToTabIndex: action.switchToTabIndex,
      };
    default:
      return state;
  }
}
