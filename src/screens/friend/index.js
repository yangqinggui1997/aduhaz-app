import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout } from '../../components';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import colors from '../../theme/colors';
import styles from './style';
import { useNavigation } from '../../hooks';
import Screens from '../screens';
import FriendModel from '../../models/friend';
import apiServices from '../../services';
import Icon from 'react-native-vector-icons/Ionicons';
import { RESPONSE_STATUS } from '../../commons/constants';

const Friend = ({ componentId }) => {
  const navigation = useNavigation(componentId);
  const { t } = useTranslation();
  const [followers, setFollowers] = useState({
    data: [],
    currentPage: 0,
    total: 0,
  });
  const [followings, setFollowings] = useState({
    data: [],
    currentPage: 0,
    total: 0,
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [tabData, setTabData] = useState([]);

  const onPressTab = index => {
    setSelectedTabIndex(index);
    setTabData(index === 0 ? followers.data : followings.data);
  };

  useEffect(() => {
    fetchFollowingList();
  }, [followings.currentPage]);

  useEffect(() => {
    fetchFollowerList();
  }, [followers.currentPage]);

  const handleLoadMore = () => {
    if (selectedTabIndex === 0) {
      setFollowers({
        data: followers.data,
        currentPage: followers.currentPage + 1,
        total: followers.total,
      });
    } else {
      setFollowings({
        data: followings.data,
        currentPage: followings.currentPage + 1,
        total: followings.total,
      });
    }
  };

  const onRefresh = () => {
    setFollowers({
      data: [],
      currentPage: 0,
      total: 0,
    });
    setFollowings({
      data: [],
      currentPage: 0,
      total: 0,
    });
  };

  const fetchFollowerList = async () => {
    var _followers = [...followers.data];
    try {
      const response = await apiServices.getFollower({
        page: followers.currentPage === 0 ? 1 : followers.currentPage,
        user_per_page: 6,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (response.data.data.length > 0) {
          if (followers.currentPage <= 1) {
            _followers = response.data.data.map(obj => FriendModel.clone(obj));
            setFollowers({
              data: _followers,
              total: response.data.total,
              currentPage: 1,
            });
          } else {
            _followers = _followers.concat(
              response.data.data.map(obj => FriendModel.clone(obj)),
            );
            setFollowers({
              data: _followers,
              total: response.data.total,
              currentPage: followers.currentPage,
            });
          }
          if (selectedTabIndex === 0) {
            setTabData(_followers);
          }
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchFollowingList = async () => {
    var _followings = [...followings.data];
    try {
      const response = await apiServices.getFollowings({
        page: followings.currentPage === 0 ? 1 : followings.currentPage,
        user_per_page: 6,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (response.data.data.length > 0) {
          if (followings.currentPage <= 1) {
            _followings = response.data.data.map(obj => FriendModel.clone(obj));
            setFollowings({
              data: _followings,
              total: response.data.total,
              currentPage: 1,
            });
          } else {
            _followings = _followings.concat(
              response.data.data.map(obj => FriendModel.clone(obj)),
            );
            setFollowings({
              data: _followings,
              total: response.data.total,
              currentPage: followings.currentPage,
            });
          }
          if (selectedTabIndex === 1) {
            setTabData(_followings);
          }
        } else if (
          response.data.data.length === 0 &&
          followings.currentPage <= 1
        ) {
          _followings = [];
          setFollowings({
            data: _followings,
            total: response.data.total,
            currentPage: 1,
          });
          if (selectedTabIndex === 1) {
            setTabData(_followings);
          }
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const unfollow = async id => {
    try {
      const response = await apiServices.unfollow(id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const follow = async id => {
    try {
      const response = await apiServices.follow(id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onPressViewSellerProfile = (id) =>
    navigation.push(Screens.ProfileSeller, {
      userId: id,
    });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>onPressViewSellerProfile(item.id)}
        style={styles.itemFriendContainer}>
        <View style={styles.avatarAndName}>
          <FastImage
            style={styles.accountAvatar}
            source={{
              uri: item.avatar,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.nameContainer}>
            <Text style={[styles.name]} numberOfLines={1} ellipsizeMode="tail">
              {item.userName}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.followButton}
          onPress={() =>
            selectedTabIndex === 0
              ? item.friendStatus === 0
                ? follow(item.id)
                : unfollow(item.id)
              : unfollow(item.id)
          }>
          <Icon
            name={
              selectedTabIndex === 0
                ? item.friendStatus === 0
                  ? images.ionicons_add
                  : images.ionicons_ios_checkmark
                : images.ionicons_ios_checkmark
            }
            size={15}
            color={colors.flatGreen}
          />
          <Icon
            name={images.ionicons_person_sharp}
            size={15}
            color={colors.flatGreen}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <NavBar parentComponentId={componentId} title={t('friend')} />
        <View style={styles.contentView}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => onPressTab(0)}
              style={selectedTabIndex === 0 ? styles.selectedTab : styles.tab}>
              <Text
                style={
                  selectedTabIndex === 0
                    ? styles.selectedTabTitle
                    : styles.tabTitle
                }>
                {t('follower').toUpperCase()}
              </Text>
              <Text
                style={
                  selectedTabIndex === 0
                    ? styles.selectedTabTitle
                    : styles.tabTitle
                }>
                ({followers.total})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressTab(1)}
              style={selectedTabIndex === 1 ? styles.selectedTab : styles.tab}>
              <Text
                style={
                  selectedTabIndex === 1
                    ? styles.selectedTabTitle
                    : styles.tabTitle
                }>
                {t('following').toUpperCase()}
              </Text>
              <Text
                style={
                  selectedTabIndex === 1
                    ? styles.selectedTabTitle
                    : styles.tabTitle
                }>
                ({followings.total})
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tabData}
            style={styles.list}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            bounces={false}
            keyExtractor={item => item.id.toString()}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
          />
        </View>
      </View>
    </Layout>
  );
};

export default Friend;
