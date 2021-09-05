import actionTypes from './type';

export function setPassData(passData) {
  return { type: actionTypes.SET_PASS_DATA, passData };
}

export function setPassStoryImage(passData) {
  return { type: actionTypes.SET_PASS_STORY_IMAGE, passData };
}

export function setPassStoryVideo(passData) {
  return { type: actionTypes.SET_PASS_STORY_VIDEO, passData };
}

export function setRefreshHomeFlag(flag) {
  return { type: actionTypes.SET_REFRESH_HOME, payload: flag };
}

export function setRefreshHomeVideoFlag(flag) {
  return { type: actionTypes.SET_REFRESH_HOME_VIDEO, payload: flag };
}

export function switchToTabIndex(tabIndex) {
  return {
    type: actionTypes.SWITCH_TO_TAB_INDEX,
    switchToTabIndex: tabIndex,
  };
}
