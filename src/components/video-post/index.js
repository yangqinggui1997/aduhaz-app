import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { alignCenter, flex1, flexRow } from '../../commons/styles';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Utils from '../../commons/utils';
import moment from 'moment';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import Colors from '../../theme/colors';
import styles from './style';

const VideoPost = ({
  componentId,
  item,
  showPostDetail = false,
  onFinish,
  ...props
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const unlikeVideoPost = async id => {
    try {
      const response = await apiServices.unlikePost(id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onFinish();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <View style={[styles.itemContainer]}>
      <TouchableOpacity
        style={styles.itemVideoContainer}
        onPress={() => {
          navigation.push(Screens.VideoList, { videoId: item.id });
        }}>
        <FastImage
          style={styles.itemImage}
          source={{
            uri: item.icon,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}></FastImage>

        <Image
          style={styles.itemVideoIcon}
          resizeMode="contain"
          source={images.icon_play_video}
        />
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={[flexRow, alignCenter]}>
          <Ionicons name={images.ionicons_eye} size={16} color={Colors.black} />
          <Text style={styles.footerItemText} t>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.views)}
            </Text>
            <Text> </Text>
            <Text>{item.views > 1 ? t('postViews') : t('postView')}</Text>
          </Text>
        </View>
        <View style={[flexRow, alignCenter]}>
          <Ionicons
            name={images.ionicons_thumbs_up}
            size={16}
            color={Colors.black}
          />
          <Text style={styles.footerItemText} t>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.likes)}
            </Text>
            <Text> </Text>
            <Text>{item.likes > 1 ? t('postLikes') : t('postLike')}</Text>
          </Text>
        </View>
        <View style={[flexRow, alignCenter]}>
          <Ionicons
            name={images.ionicons_chat_bubble}
            size={16}
            color={Colors.black}
          />
          <Text style={styles.footerItemText} t>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.comments)}
            </Text>
            <Text> </Text>
            <Text>
              {item.comments > 1 ? t('postComments') : t('postComment')}
            </Text>
          </Text>
        </View>
      </View>

      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemName}>
        {item.postTitle}
      </Text>

      <View style={styles.bottomView}>
        <View style={styles.timeView}>
          <Icon
            name={images.icon_history}
            size={12}
            color={Colors.flatGrey03}
          />
          <Text style={styles.time}>
            {Utils.getPostTime(moment.unix(item.postDate).toDate())}
          </Text>
        </View>
        <TouchableOpacity onPress={() => unlikeVideoPost(item.id)}>
          <Icon
            name={images.icon_favorite_highlight}
            size={26}
            color={Colors.crimsonRed}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

VideoPost.propTypes = {};

export default VideoPost;
