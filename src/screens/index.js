import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';

import Provider from '../redux/provider';
import AccountSetting from './account-setting';
import AccountSettingItem from './account-setting-item';
import BottomSheet from './bottom-sheet';
import ChangeAccountLogin from './change-account-login';
import ChatDetail from './chat-detail';
import ChatList from './chat-list';
import CreateImagePost from './create-image-post';
import PreviewPost from './create-image-post/preview-post';
import CreateImageStory from './create-image-story';
import InputStoryImagesDescription from './create-image-story/input-description-view';
import CreateVideoPost from './create-video-post';
import CreateVideoStory from './create-video-story';
import InputStoryVideoDescription from './create-video-story/input-description-view';
import TrimmerView from './create-video-story/trimmer-view';
import Dialog from './dialog';
// import VideoDetail from './video-detail';
import FavoriteList from './favorite-list';
import FavoriteVideo from './favorite-video';
import FavoriteListings from './favorite_listings';
import FavoriteStoryImage from './favorite_story_image';
import FavoriteStoryVideo from './favorite_story_video';
import Feedback from './feedback';
import ForgotPassword from './forgot-password';
import Friend from './friend';
import FullImagesView from './full-images-view';
import Home from './home';
import HomeStoryPictures from './home-story-pictures';
import HomeStoryVideos from './home-story-videos';
import HomeVideos from './home-videos';
import Login from './login';
import ManageListings from './manage-listings';
import ManageStoryImage from './manage-story-image';
import ManageStoryVideo from './manage-story-video';
import ManageVideo from './manage-video';
import Menu from './menu';
import MusicList from './music-list';
import MusicStore from './music-store';
import MusicTopics from './music-topics';
import Notification from './notification';
import PageWebview from './page-webview';
import PostDetail from './post-detail';
import PostsByCategory from './posts-by-category';
import Profile from './profile';
import ProfileEdit from './profile-edit';
import ProfileSeller from './profile-seller';
import PushPost from './push-post';
import Rating from './rating';
import RatingDetail from './rating-detail';
import Recharge from './recharge';
import Register from './register';
import Report from './report';
import ReportProblem from './report-problem';
import SavedList from './saved-list';
import Screens from './screens';
import Search from './search';
import SearchHistory from './search-history';
import SearchMusic from './search-music';
import SearchResult from './search-result';
import Splash from './splash-screen';
import VideoList from './video-list';
import ViewImage from './view-image';
import EditImagePost from './edit-image-post';
import PreviewEditPost from './edit-image-post/preview-post';
import EditVideoPost from './edit-video-post';
import ManagerDevices from './manage-devices';
import VerifyTwoSteps from './verify-two-steps';
import VideoPlayerScreen from './video-player';

const registerScreen = (screenName, Component, store = null) => {
  if (store) {
    Navigation.registerComponent(
      screenName,
      () => props =>
        (
          <Provider store={store}>
            <Component {...props} />
          </Provider>
        ),
      () => Component,
    );
  } else {
    Navigation.registerComponent(
      screenName,
      () => props =>
        (
          // <Layout>
          <Component {...props} />
          // </Layout>
        ),
      () => Component,
    );
  }
};

export const registerScreens = store => {
  registerScreen(Screens.Splash, Splash, store);

  registerScreen(Screens.Menu, Menu, store);
  registerScreen(Screens.Home, Home, store);
  registerScreen(Screens.HomeVideos, HomeVideos, store);
  registerScreen(Screens.HomeStoryPictures, HomeStoryPictures, store);
  registerScreen(Screens.HomeStoryVideos, HomeStoryVideos, store);
  registerScreen(Screens.ManageListings, ManageListings, store);
  registerScreen(Screens.FavoriteList, FavoriteList, store);
  registerScreen(Screens.FavoriteListings, FavoriteListings);
  registerScreen(Screens.ManageVideo, ManageVideo, store);
  registerScreen(Screens.FavoriteVideo, FavoriteVideo);
  registerScreen(Screens.FavoriteStoryImage, FavoriteStoryImage, store);
  registerScreen(Screens.FavoriteStoryVideo, FavoriteStoryVideo, store);
  registerScreen(Screens.ManageStoryVideo, ManageStoryVideo, store);
  registerScreen(Screens.ManageStoryImage, ManageStoryImage, store);
  registerScreen(Screens.Friend, Friend);
  registerScreen(Screens.VideoList, VideoList);
  registerScreen(Screens.Recharge, Recharge);
  registerScreen(Screens.PushPost, PushPost);
  registerScreen(Screens.SavedList, SavedList);
  registerScreen(Screens.PostsByCategory, PostsByCategory, store);

  registerScreen(Screens.Login, Login, store);
  registerScreen(Screens.ProfileEdit, ProfileEdit, store);
  registerScreen(Screens.Profile, Profile, store);
  registerScreen(Screens.Register, Register, store);
  registerScreen(Screens.ForgotPassword, ForgotPassword, store);

  registerScreen(Screens.PageWebview, PageWebview);
  registerScreen(Screens.Dialog, Dialog);
  registerScreen(Screens.BottomSheet, BottomSheet, store);
  registerScreen(Screens.FullImagesView, FullImagesView);

  registerScreen(Screens.PostDetail, PostDetail, store);
  registerScreen(Screens.ChatDetail, ChatDetail, store);
  registerScreen(Screens.Rating, Rating, store);
  registerScreen(Screens.RatingDetail, RatingDetail, store);
  registerScreen(Screens.Report, Report, store);
  registerScreen(Screens.ProfileSeller, ProfileSeller, store);

  registerScreen(Screens.Search, Search, store);
  registerScreen(Screens.SearchHistory, SearchHistory, store);
  registerScreen(Screens.SearchResult, SearchResult, store);

  registerScreen(Screens.Notification, Notification, store);
  registerScreen(Screens.ChatList, ChatList, store);
  registerScreen(Screens.AccountSetting, AccountSetting, store);
  registerScreen(Screens.AccountSettingItem, AccountSettingItem, store);

  registerScreen(Screens.CreateVideoPost, CreateVideoPost, store);
  registerScreen(Screens.CreateImagePost, CreateImagePost, store);
  registerScreen(Screens.PreviewPost, PreviewPost, store);

  registerScreen(
    Screens.CreateImageStory,
    gestureHandlerRootHOC(CreateImageStory),
    store,
  );
  registerScreen(
    Screens.CreateVideoStory,
    gestureHandlerRootHOC(CreateVideoStory),
    store,
  );
  registerScreen(Screens.MusicStore, MusicStore);
  registerScreen(Screens.ChangeAccountLogin, ChangeAccountLogin, store);
  registerScreen(Screens.TrimmerView, TrimmerView);
  registerScreen(
    Screens.InputVideoStoryDescription,
    InputStoryVideoDescription,
    store,
  );
  registerScreen(Screens.MusicTopics, MusicTopics);
  registerScreen(Screens.MusicList, MusicList);
  registerScreen(Screens.SearchMusic, SearchMusic);
  registerScreen(
    Screens.InputImagesStoryDescription,
    InputStoryImagesDescription,
    store,
  );
  registerScreen(Screens.ReportProblem, ReportProblem);
  registerScreen(Screens.Feedback, Feedback);
  registerScreen(Screens.ViewImage, ViewImage);

  registerScreen(Screens.EditImagePost, EditImagePost);
  registerScreen(Screens.PreviewEditPost, PreviewEditPost);
  registerScreen(Screens.EditVideoPost, EditVideoPost);
  registerScreen(Screens.ManagerDevices, ManagerDevices);
  registerScreen(Screens.VerifyTwoSteps, VerifyTwoSteps);

  registerScreen(Screens.VideoPlayerScreen, VideoPlayerScreen, store);
};
