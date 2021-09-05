import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { alignCenter, flex1, flexRow } from '../../commons/styles';
import { useTranslation } from 'react-i18next';
import showPostCommentsView from '../../components/post-comments';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Utils from '../../commons/utils';
import moment from 'moment';
import Video from 'react-native-video';
import colors from '../../theme/colors';
import styles from './style';
import _ from 'lodash';

const UserVideo = ({
  item,
  isInteract = false,
  onInteract,
  onOpenMenu,
  onOnpenStatistical,
  ...props
}) => {
  const { t } = useTranslation();
  const [playerVolume, setPlayerVolume] = useState(30);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [pause, setPause] = useState(true);

  useEffect(() => {
    if (!isInteract) {
      setPause(true);
    }
  });

  const onPressMenuButton = () => {
    if (_.isFunction(onOpenMenu)) {
      onOpenMenu();
    }
  };

  const onPressComments = (postId, totalComments) => {
    showPostCommentsView({ postId, totalComments });
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.videoContainer}>
        {canPlayVideo && isInteract ? (
          <Video
            source={{
              uri: item.videoUrl,
            }}
            style={flex1}
            controls={false}
            resizeMode={'stretch'}
            paused={pause}
            volume={playerVolume}
            onError={error => {
              console.log('Error: ', error);
            }}
          />
        ) : (
          <FastImage
            style={flex1}
            source={{
              uri: item.icon,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}></FastImage>
        )}

        <TouchableOpacity
          onPress={() => {
            setPlayerVolume(playerVolume == 0 ? 30 : 0);
          }}
          style={styles.volumeButton}>
          <Ionicons
            name={
              playerVolume == 0
                ? images.ionicons_volume_mute
                : images.ionicons_volume_med
            }
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!canPlayVideo) {
              setCanPlayVideo(true);
            }
            setPause(prev => !prev);
            onInteract();
          }}
          style={styles.pauseButton}>
          <Ionicons
            name={
              isInteract
                ? pause
                  ? images.icon_play
                  : images.icon_pause
                : images.icon_play
            }
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={[flexRow, alignCenter]}>
          <Ionicons name={images.ionicons_eye} size={18} color={colors.black} />
          <Text style={styles.footerItemText}>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.views)}
            </Text>
          </Text>
        </View>
        <View style={[flexRow, alignCenter]}>
          <Ionicons
            name={
              item.liked ? images.icon_like_highlight_png : images.icon_like_png
            }
            size={18}
            color={item.liked ? colors.red : colors.black}
          />
          <Text style={styles.footerItemText}>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.likes)}
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          style={[flexRow, alignCenter]}
          onPress={() => onPressComments(item.id, item.comments)}>
          <Ionicons
            name={images.ionicons_chat_bubble}
            size={18}
            color={colors.black}
          />
          <Text style={styles.footerItemText}>
            <Text style={{ fontWeight: 'bold' }}>
              {Utils.parseInteraction(item.comments)}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionView}>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.postTitle}
        </Text>
        <TouchableOpacity onPress={onPressMenuButton}>
          <Ionicons
            name={images.ionicons_menu}
            size={24}
            color={colors.flatGrey01}
          />
        </TouchableOpacity>
      </View>

      {/*Chart View*/}
      <View style={styles.chartView}>
        <TouchableOpacity
          style={styles.statisticalView}
          onPress={onOnpenStatistical}>
          <Icon name={images.icon_chart} size={14} color={colors.flatGrey03} />
          <Text style={styles.statistical}>{t('statistical')}</Text>
        </TouchableOpacity>
        <Text style={styles.time}>
          {Utils.getPostTime(moment.unix(item.postDate).toDate())}
        </Text>
      </View>
    </View>
  );
};

UserVideo.propTypes = {};

export default UserVideo;
