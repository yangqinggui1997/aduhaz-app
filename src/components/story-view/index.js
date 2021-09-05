import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';

import images from '../../assets/images';
import { RESPONSE_STATUS } from '../../commons/constants';
import { wp } from '../../commons/responsive';
import {
  alignCenter,
  flex1,
  flexRow,
  justifyCenter,
  ml,
  mt,
  pdV,
} from '../../commons/styles';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import apiServices from '../../services';
import colors from '../../theme/colors';
import style from './style';

const StoryView = ({
  showFavorite = false,
  post,
  onFinish,
  onPress,
  componentId,
  ...props
}) => {
  const navigation = useNavigation(componentId);

  const unlikeStory = async id => {
    try {
      const response = await apiServices.unlikeImageStory(id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onFinish();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onPressed = () => {
    if (_.isFunction(onPress)) {
      onPress();
    }
  };

  const handlePressUsername = () => {
    navigation.push(Screens.ProfileSeller, {
      userId: post?.user?.id,
    });
  };

  const renderOnlineStatus = user => {
    let backgroundColor = colors.orange;
    if (user && user.lastOnline && user.lastOnline.seconds) {
      const lastOnline = moment(user.lastOnline.seconds * 1000).valueOf();
      if (moment().valueOf() - lastOnline < 60 * 1000) {
        backgroundColor = colors.green;
      }
    }
    return <View style={[style.onlineStatus, { backgroundColor }]} />;
  };

  return (
    <TouchableOpacity style={{ ...props.style }} onPress={() => onPressed()}>
      <View style={style.content}>
        {post.poster && post.poster != '' && (
          <FastImage
            style={style.thumb}
            source={{
              uri: post.poster,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <View style={style.mask} />
        <View style={style.header}>
          {post.user && post.user.icon && post.user.icon != '' && (
            <View>
              <FastImage
                style={style.avatar}
                source={{
                  uri: post.user.icon,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              {renderOnlineStatus(post.user)}
            </View>
          )}
          {showFavorite && (
            <TouchableOpacity onPress={() => unlikeStory(post.id)}>
              <Icon
                name={images.icon_favorite_highlight}
                size={26}
                color={colors.crimsonRed}
              />
            </TouchableOpacity>
          )}
        </View>
        {post.user && (
          <Text style={style.name}>{post.user.name || post.user.hoten}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

StoryView.propTypes = {};

export default StoryView;
