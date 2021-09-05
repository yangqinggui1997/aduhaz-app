import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import images from '../../assets/images';
import { IMAGE_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import { wp } from '../../commons/responsive';
import { flexRow, ml } from '../../commons/styles';
import Utils from '../../commons/utils';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import apiServices from '../../services';
import { Colors } from '../../theme';
import colors from '../../theme/colors';
import Fonts, { STORY_FONTS } from '../../theme/fonts';
import SpinningImage from '../spinning-image';
import Video from '../video-player';
import style from './style';
import AutoScrolling from 'react-native-auto-scrolling';
import ImageView from '../image-view';
import storage from '../../storage';

const StoryVideoView = ({
  onShare,
  onPressComments,
  onFollow,
  item,
  show,
  preLoad,
  componentId,
  ...props
}) => {
  const navigation = useNavigation(componentId);
  const { t } = useTranslation();
  const [storyItem, setStoryItem] = useState(item);
  const [play, setPlay] = useState(null);
  const [playerState, setPlayerState] = useState(Video.PlayerState.NONE);
  const isMyStory =
    storage.isLoggedIn() && storyItem?.user?.id === storage.user?.id;

  useEffect(() => {
    if (item.id !== storyItem.id) {
      setStoryItem(item);
    }
  }, [item]);

  useEffect(() => {
    if (preLoad) {
      // console.log('SHOW');
      setPlayerState(Video.PlayerState.PLAY);
    } else {
      setPlayerState(Video.PlayerState.STOP);
    }
  }, [preLoad]);

  useEffect(() => {
    if (show) {
      setPlayerState(Video.PlayerState.PLAY);
    } else {
      setPlayerState(Video.PlayerState.STOP);
    }
  }, [show]);

  useEffect(() => {
    if (play !== null) {
      if (play) {
        setPlayerState(Video.PlayerState.RESUME);
      } else {
        setPlayerState(Video.PlayerState.PAUSE);
      }
    }
  }, [play]);

  const onPressedShareButton = () => {
    if (_.isFunction(onShare)) {
      onShare();
    }
  };

  const onPressedFollowButton = () => {
    if (_.isFunction(onFollow)) {
      onFollow();
    }
  };

  const onPressedCommentsButton = () => {
    if (_.isFunction(onPressComments)) {
      onPressComments(item);
    }
  };

  const onPressedLikeButton = async () => {
    try {
      const request = storyItem.liked
        ? apiServices.unlikeImageStory(storyItem.id)
        : apiServices.likeImageStory(storyItem.id);
      const response = await request;
      if (response.data.status == RESPONSE_STATUS.OK) {
        setStoryItem({
          ...storyItem,
          liked: storyItem.liked ? 0 : 1,
          likes: storyItem.liked ? storyItem.likes - 1 : storyItem.likes + 1,
        });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const playPauseVideo = () => {
    setPlay(play === null ? false : !play);
  };

  const handlePressUsername = () => {
    console.log('handlePressUsername');
    console.log('isMyStory', isMyStory);
    console.log(
      `storage.isLoggedIn(): ${storage.isLoggedIn()} - storyItem?.user?.id: ${
        storyItem?.user?.id
      } - storage.user?.id: ${storage.user?.id}`,
    );
    navigation.push(Screens.ProfileSeller, {
      userId: storyItem?.user?.id,
    });
  };

  const renderOnlineStatus = user => {
    let backgroundColor = Colors.orange;
    if (user && user.lastOnline && user.lastOnline.seconds) {
      const lastOnline = moment(user.lastOnline.seconds * 1000).valueOf();
      if (moment().valueOf() - lastOnline < 60 * 1000) {
        backgroundColor = Colors.green;
      }
    }
    return <View style={[style.onlineStatus, { backgroundColor }]} />;
  };

  return (
    <View style={props.style}>
      <View style={style.container}>
        <View
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}>
          <View
            style={[
              style.videoContainer,
              { justifyContent: 'center', alignItems: 'center' },
            ]}>
            <FastImage
              source={{
                uri: Utils.getResizedImageUri(item.poster, IMAGE_TYPE.MEDIUM),
              }}
              style={
                storyItem?.video?.video_width > storyItem?.video?.video_height
                  ? {
                      width: Dimensions.get('screen').width,
                      aspectRatio: storyItem?.video?.video_height
                        ? storyItem?.video?.video_width /
                          storyItem?.video?.video_height
                        : 1,
                    }
                  : { width: Dimensions.get('screen').width, height: '100%' }
              }
              resizeMode={
                storyItem?.video?.video_width > storyItem?.video?.video_height
                  ? FastImage.resizeMode.cover
                  : FastImage.resizeMode.cover
              }
            />
          </View>

          {preLoad && (
            <Video
              videoUrl={
                !_.isEmpty(storyItem.video.encoded)
                  ? storyItem.video.encoded
                  : storyItem.video.directory
              }
              thumnailUrl={Utils.getResizedImageUri(
                storyItem.poster,
                IMAGE_TYPE.MEDIUM,
              )}
              style={{
                width: Dimensions.get('screen').width,
                height: '100%',
              }}
              customStyles={{
                videoWrapper: {
                  width: Dimensions.get('screen').width,
                  height: '100%',
                  justifyContent: 'center',
                },
                video:
                  storyItem?.video?.video_width > storyItem?.video?.video_height
                    ? {
                        width: Dimensions.get('screen').width,
                        aspectRatio: storyItem?.video?.video_height
                          ? storyItem?.video?.video_width /
                            storyItem?.video?.video_height
                          : 1,
                      }
                    : { width: Dimensions.get('screen').width, height: '100%' },
                thumbnail:
                  storyItem?.video?.video_width > storyItem?.video?.video_height
                    ? {
                        width: Dimensions.get('screen').width,
                        aspectRatio: storyItem?.video?.video_height
                          ? storyItem?.video?.video_width /
                            storyItem?.video?.video_height
                          : 1,
                      }
                    : { width: Dimensions.get('screen').width, height: '100%' },
                seekBar: {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
              }}
              videoWidth={storyItem?.video?.video_width}
              videoHeight={storyItem?.video?.video_height}
              resizeMode={'cover'}
              autoplay={false}
              loop={true}
              disableControls={true}
              playerState={playerState}
              defaultMuted={false}
              muted={!show}
              onLoadStart={() => {
                if (!show) {
                  setPlayerState(Video.PlayerState.STOP);
                }
              }}
            />
          )}
          <View
            style={[
              style.videoContainer,
              { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            ]}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={style.videoContainer}
          onPress={() => playPauseVideo()}>
          {!_.isEmpty(storyItem.mask) && (
            <FastImage
              style={{ width: '100%', height: '100%' }}
              source={{ uri: storyItem.mask }}
              resizeMode={FastImage.resizeMode.stretch}
            />
          )}
          {show && play === false && (
            <View style={style.playButtonContainer}>
              <Image source={images.icon_play_video} style={style.playButton} />
            </View>
          )}
        </TouchableOpacity>
        <View style={style.userInfoContainer}>
          <TouchableOpacity onPress={handlePressUsername} disabled={isMyStory}>
            <SpinningImage
              style={style.avatarContainer}
              imageStyle={style.avatar}
              source={{
                uri: storyItem.user?.icon,
                priority: FastImage.priority.normal,
              }}
              stopAnimation={!show}
            />
            {renderOnlineStatus(storyItem.user)}
          </TouchableOpacity>

          <View>
            <View style={flexRow}>
              <TouchableOpacity
                onPress={handlePressUsername}
                disabled={isMyStory}>
                <Text style={style.name}>{storyItem.user?.name || ''}</Text>
              </TouchableOpacity>
              <Text style={style.name}> - </Text>
              <TouchableOpacity onPress={() => onPressedFollowButton()}>
                <Text style={style.follow}>
                  {t(!item.user?.follow_status ? 'follow' : 'following')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[ml(3), { color: colors.white, fontSize: 12 }]}>
              {Utils.getPostTime(
                new Date(storyItem.createdAt.replace(' ', 'T') + '.000Z'),
              )}
            </Text>
          </View>
        </View>
        <View style={style.actionButtonContainer}>
          <TouchableOpacity
            style={style.actionButton}
            delayPressIn={300}
            onPress={() => onPressedLikeButton()}>
            <Ionicons
              name={'heart'}
              size={40}
              color={storyItem.liked ? colors.crimsonRed : colors.white}
            />
            <Text style={style.actionCounter}>
              {Utils.parseInteraction(storyItem.likes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.actionButton}
            onPress={() => onPressedCommentsButton()}>
            <Ionicons
              name={'chatbubble-ellipses'}
              size={40}
              color={colors.white}
            />
            <Text style={style.actionCounter}>
              {Utils.parseInteraction(storyItem.comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[style.actionButton, { marginTop: wp(16) }]}
            onPress={() => onPressedShareButton()}>
            <Ionicons name={'arrow-redo'} size={40} color={colors.white} />
            {/* <Text style={style.actionCounter}>999</Text> */}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: wp(16),
          bottom: wp(20),
          width: '75%',
        }}>
        <Text
          style={{
            fontFamily: STORY_FONTS.find(
              font => font.name === storyItem.descriptionFont,
            )
              ? storyItem.descriptionFont
              : Fonts.Regular,
            fontSize: 20,
            color:
              storyItem.descriptionColor &&
              storyItem.descriptionColor.includes('#')
                ? storyItem.descriptionColor
                : colors.white,
          }}>
          {item.description}
        </Text>
        <View style={[flexRow, { marginTop: wp(4), alignItems: 'center' }]}>
          {show && (
            <ImageView
              style={{
                width: 24,
                height: 14,
                marginRight: 10,
                tintColor: colors.orange,
              }}
              source={images.playing_icon}
            />
          )}
          {!show && (
            <Text style={{ color: colors.white, fontSize: 15 }}>
              {storyItem.song
                ? `${storyItem.song.name} - ${storyItem.song.single_name}`
                : `${t('originalSound')}  `}
            </Text>
          )}
          {show && (
            <AutoScrolling style={{ width: 130 }} endPaddingWidth={10}>
              <Text style={{ color: colors.white, fontSize: 15 }}>
                {storyItem.song
                  ? `${storyItem.song.name} - ${storyItem.song.single_name} `
                  : `${t('originalSound')}  `}
              </Text>
            </AutoScrolling>
          )}
        </View>
      </View>
    </View>
  );
};

StoryVideoView.propTypes = {};

export default StoryVideoView;
