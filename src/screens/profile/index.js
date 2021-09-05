import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../hooks';
import apiServices from '../../services';
import { Layout, NavBar, LoadingView, ProfileView } from '../../components';
import images from '../../assets/images';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Screens from '../screens';
import RechargePackage from '../../components/recharge-package';
import storage from '../../storage';
import {
  RESPONSE_STATUS,
  RESPONSE_ERROR_CODE,
  USER_POST_PER_PAGE,
} from '../../commons/constants';
import {
  flexRow,
  justifyBetween,
  ml,
  mr,
  mt,
  pb,
  pdH,
  pt,
  flex1,
} from '../../commons/styles';
import { wp } from '../../commons/responsive';

import style from './style';
import TabViewProfile from './tab-view-profile';
// import FastImage from 'react-native-fast-image';
import VideoPostModel from '../../models/video_post';
import * as appActions from '../../redux/store/reducers/app/action';
import { useSelector, useDispatch } from 'react-redux';
import User from '../../models/user';
import PostModel from '../../models/post';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from '../../theme/colors';

const Profile = ({ componentId }) => {
  const scrollViewRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const navigation = useNavigation(componentId);
  const [interactItemIndex, setInteractItemIndex] = useState(0); // used for pause another video when play specify video

  const onLeftPress = useCallback(() => {
    navigation.pop();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [money, setMoney] = useState(0);
  const [videos, setVideos] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });
  const [posts, setPosts] = useState({
    data: [],
    total: 0,
  });

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiServices.getSalingPost({
        post_per_page: USER_POST_PER_PAGE.POST,
      });

      setIsLoading(false);

      console.log('getSalingPost', response.data);
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        var _imagePosts = response.data.data.map(p => PostModel.clone(p));
        return setPosts({
          data: _imagePosts,
          total: response.data.total,
        });
      }
    } catch (error) {}
  };

  const onPressRating = () => {
    navigation.push(Screens.RatingDetail, {
      userId: user.id,
    });
  };

  const fetchVideos = async () => {
    var _videos = [...videos.data];
    setIsLoading(true);
    const response = await apiServices.getVideos({
      id_user: user.id,
      post_per_page: 30,
      page: videos.currentPage,
    });
    setIsLoading(false);

    try {
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (videos.currentPage <= 1) {
          _videos = response.data.posts.map(p => VideoPostModel.clone(p));
          return setVideos({
            data: _videos,
            currentPage: 1,
            total: response.data.total,
          });
        } else {
          _videos = _videos.concat(
            response.data.posts.map(p => VideoPostModel.clone(p)),
          );
          return setVideos({
            data: _videos,
            currentPage: videos.currentPage,
            total: response.data.total,
          });
        }
      }
    } catch (error) {
      console.log('fetch videos error: ', error);
    }
  };
  const setTotal = (
    postsTotal = posts.total,
    videoTotal = videos.data.length,
  ) => {
    console.log('setTotal', postsTotal);
    console.log('setTotal', videoTotal);
  };
  const loadData = async () => {
    await Promise.all([getProfile(), fetchVideos(), getPosts(), getMoney()]);
    return setTotal();
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    setTotal();
    return;
  }, [posts]);

  useEffect(() => {
    setTotal();
    return;
  }, [videos.data]);
  const getMoney = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.getMoney();
      setIsLoading(false);
      console.log('Get-Money', data);
      if (data.status == RESPONSE_STATUS.OK && data.money) {
        return setMoney(data.money || 0);
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  };
  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.getProfile();
      setIsLoading(false);
      console.log('getProfile', data);
      if (data.status == RESPONSE_STATUS.OK && data.user_info) {
        let userInfo = data.user_info;
        let _user = User.clone(userInfo);
        return dispatch(appActions.updateUserInfo(_user));
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  };

  const onPressFollower = () => {
    navigation.push(Screens.Friend);
  };

  const onPressFollowing = () => {
    navigation.push(Screens.Friend);
  };

  return (
    <Layout>
      <NavBar
        parentComponentId={componentId}
        showCloseButton
        onLeftPress={onLeftPress}
        title={t('personal')}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
        {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
        <ProfileView componentId={componentId} />
        <View
          style={{
            flexDirection: 'column',
            marginHorizontal: 16,
          }}>
          <View style={[style.avatarView]}>
            <View
              style={[
                style.analystics,
                justifyBetween,
                { flexDirection: 'row' },
              ]}>
              <TouchableOpacity onPress={onPressFollower}>
                <View style={[flexRow, style.alignEnd]}>
                  <IconMaterialCommunityIcons
                    name="signal-variant"
                    color={colors.grey}
                    size={wp(17)}
                    style={[mr(5)]}
                  />
                  <Text style={[style.textView]}>
                    {t('has')}{' '}
                    <Text style={style.textBold}>
                      {user?.amount_of_follower}
                    </Text>{' '}
                    {t('follower')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressFollowing}>
                <View style={[flexRow, style.alignEnd]}>
                  <IconAntDesign
                    name={images.profile_icon_watching}
                    color={colors.grey}
                    size={wp(17)}
                    style={[mr(5)]}
                  />
                  <Text style={[style.textView]}>
                    {t('following')}{' '}
                    <Text style={style.textBold}>
                      {user?.amount_of_following || 0}
                    </Text>{' '}
                    {t('people')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={onPressRating} style={[mt(10), flexRow]}>
            <IconEvilIcons
              name={images.icon_rate}
              size={wp(20)}
              style={[mr(5), ml(-3)]}
              color={colors.grey}
            />
            <Text style={[style.grayColor, style.textView]}>
              {t('rating')}:{' '}
              <Text style={[style.blackColor, style.textView]}>
                {user && user.point_of_evaluate
                  ? (Math.round(user.point_of_evaluate * 100) / 100).toFixed(1)
                  : 0.0}{' '}
                <Fontisto name="star" style={style.iconStar} />
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={[mt(10), flexRow]}>
            <IconEvilIcons
              name={images.icon_profile_location}
              color={colors.grey}
              size={wp(20)}
              style={[mr(5), ml(-3)]}
            />
            <Text style={[style.grayColor, style.textView]}>
              {t('address')}:{' '}
              <Text style={[style.blackColor, style.textView]}>
                {(user && user.diachi) || t('not_provided')}{' '}
              </Text>
            </Text>
          </View>
          <View style={[mt(10), flexRow]}>
            <IconEvilIcons
              name={images.icon_check}
              color={colors.grey}
              size={wp(20)}
              style={[mr(5), ml(-3)]}
            />
            <Text style={[style.grayColor, style.textView]}>
              {t('provided')}:{' '}
            </Text>
            <View style={style.curcleIcon}>
              <IconEvilIcons
                name={images.icon_profile_location}
                color={colors.grey}
                size={wp(17)}
                style={[mr(5)]}
              />
            </View>
            <View style={style.iconAwesome}>
              <IconFontAwesome
                name={images.icon_phone}
                color={colors.grey}
                size={wp(15)}
                style={[mr(5)]}
              />
            </View>
            <View style={[style.curcleIcon]}>
              <IconFontisto
                name={images.icon_mail}
                color={colors.grey}
                size={wp(13)}
                style={[mr(5)]}
              />
            </View>
          </View>
          <TabViewProfile
            posts={posts}
            videos={videos}
            navigation={navigation}
          />
        </View>
      </ScrollView>

      <View style={(style.marginTop, style.rechargePackage)}>
        <RechargePackage value={money} />
      </View>
    </Layout>
  );
};

export default Profile;
