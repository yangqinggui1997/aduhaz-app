import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { alignCenter, flex1, flexRow } from '../../commons/styles';
import { useTranslation } from 'react-i18next';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Utils from '../../commons/utils';
import Video from 'react-native-video';
import colors from '../../theme/colors';
import styles from './style';
import _ from 'lodash';
import moment from 'moment';
import showStoryCommentsView from '../../components//story-comments';

const UserVideoStory = ({
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

  const onPressStoryComments = story => {
    showStoryCommentsView({ storyId: story.id });
  };

  return (
    <View style={styles.parrentView}>
      <View style={styles.itemContainer}>
        <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
          {item.description}
        </Text>
        <View style={styles.videoContainer}>
          {canPlayVideo ? (
            <Video
              source={{
                uri: item.video.directory,
              }}
              style={flex1}
              controls={false}
              resizeMode={'stretch'}
              paused={pause}
              volume={playerVolume}
            />
          ) : (
            <FastImage
              style={flex1}
              source={{
                uri: item.poster,
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
                canPlayVideo
                  ? pause
                    ? images.icon_play
                    : images.icon_pause
                  : images.icon_play
              }
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
          {/* <Text style={styles.videoLength}>{item.length}</Text> */}
        </View>
        <View style={styles.descriptionView}>
          <Text style={styles.time}>
            {Utils.getPostTime(
              new Date(item.createdAt.replace(' ', 'T') + '.000Z'),
            )}
          </Text>
          <TouchableOpacity onPress={onPressMenuButton}>
            <Ionicons
              name={images.ionicons_menu}
              size={24}
              color={colors.flatGrey01}
            />
          </TouchableOpacity>
        </View>
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
          onPress={() => onPressStoryComments(item)}>
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
    </View>
  );
};

UserVideoStory.propTypes = {};

export default UserVideoStory;
