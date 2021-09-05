import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageThumbnailsView from '../image-thumbnails-view';
import SpinningImage from '../spinning-image';
import moment from 'moment';

import style from './style';
import { wp } from '../../commons/responsive';
import { flexRow, ml } from '../../commons/styles';
import colors from '../../theme/colors';
import Fonts, { STORY_FONTS } from '../../theme/fonts';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Screens from '../../screens/screens';
import Utils from '../../commons/utils';
import apiServices from '../../services';
import { IMAGE_TYPE, RESPONSE_STATUS } from '../../commons/constants';

import SoundPlayer from 'react-native-sound-player';
import { useNavigation } from '../../hooks';
import images from '../../assets/images';

import AutoScrolling from 'react-native-auto-scrolling';
import ImageView from '../image-view';
import storage from '../../storage';

const StoryPicturesView = ({
  item,
  onShare,
  onPressComments,
  onMoveToNext,
  show = false,
  preLoad = false,
  componentId,
  onFollow,
  ...props
}) => {
  const navigation = useNavigation(componentId);
  const { t } = useTranslation();
  const [storyImages, setStoryImages] = useState(
    item.images.map(image => image.directory),
  );
  const [storyItem, setStoryItem] = useState(item);

  const intervalRef = useRef(null);
  const onFinishedPlayingSubscription = useRef(null);
  const onFinishedLoadingSubscription = useRef(null);
  const onFinishedLoadingURLSubscription = useRef(null);
  const onFinishedLoadingFileSubscription = useRef(null);

  const isMyStory =
    storage.isLoggedIn() && storyItem?.user?.id === storage.user?.id;

  useEffect(() => {
    if (item.id !== storyItem.id) {
      setStoryItem(item);
      setStoryImages(item.images.map(image => image.directory));
      if (show) {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
        intervalRef.current = setTimeout(() => {
          if (_.isFunction(onMoveToNext)) {
            stopSound();
            onMoveToNext();
          }
        }, 6000);
      }
    }
  }, [item]);

  useEffect(() => {
    if (show) {
      intervalRef.current = setTimeout(() => {
        if (_.isFunction(onMoveToNext)) {
          onMoveToNext();
          stopSound();
        }
      }, 6000);
      console.log('SHOW');

      if (isItemSongPlayable()) {
        registerSoundListener();
        try {
          let songUrl = item.song.directory;
          if (item.clip_audio && !_.isEmpty(item.clip_audio)) {
            songUrl = item.clip_audio;
          }
          SoundPlayer.playUrl(songUrl);
        } catch (error) {
          console.log('PLAY SOUND: ', error);
        }
      } else {
        stopSound();
      }
    } else {
      clearTimeout(intervalRef.current);
      if (item.song) {
        removeSoundListener();
      }
    }
  }, [show]);

  const isItemSongPlayable = () => {
    return item && item.song && item.song.directory && item.song.duration;
  };

  const registerSoundListener = () => {
    onFinishedPlayingSubscription.current = SoundPlayer.addEventListener(
      'FinishedPlaying',
      data => {
        console.log('###FinishedPlaying - data: ', data);
      },
    );
    onFinishedLoadingSubscription.current = SoundPlayer.addEventListener(
      'FinishedLoading',
      data => {
        console.log('###FinishedLoading - data: ', data);
      },
    );
    onFinishedLoadingFileSubscription.current = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      data => {
        console.log('###FinishedLoadingFile - data: ', data);
      },
    );
    onFinishedLoadingURLSubscription.current = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      data => {
        console.log('###FinishedLoadingURL - data: ', data);
      },
    );
  };

  const removeSoundListener = () => {
    if (onFinishedPlayingSubscription.current) {
      onFinishedPlayingSubscription.current.remove();
    }
    if (onFinishedLoadingSubscription.current) {
      onFinishedLoadingSubscription.current.remove();
    }
    if (onFinishedLoadingURLSubscription.current) {
      onFinishedLoadingURLSubscription.current.remove();
    }
    if (onFinishedLoadingFileSubscription.current) {
      onFinishedLoadingFileSubscription.current.remove();
    }
  };

  const stopSound = () => {
    SoundPlayer.stop();
  };

  const onPressedShareButton = () => {
    if (_.isFunction(onShare)) {
      onShare();
    }
  };

  const onPressedCommentsButton = () => {
    if (_.isFunction(onPressComments)) {
      onPressComments(item);
    }
  };

  const handlePressFollow = async () => {
    if (_.isFunction(onFollow)) {
      onFollow();
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
          liked: !storyItem.liked,
          numberOfLikes: storyItem.liked
            ? storyItem.numberOfLikes - 1 >= 0
              ? storyItem.numberOfLikes - 1
              : 0
            : storyItem.numberOfLikes + 1,
        });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onCancelAutoMoveNext = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onSelectImage = ({ image, index }) => {
    Navigation.showOverlay({
      component: {
        name: Screens.FullImagesView,
        options: {
          overlay: {
            interceptTouchOutside: false,
          },
          layout: {
            componentBackgroundColor: 'transparent',
          },
          modalPresentationStyle: 'overCurrentContext',
        },
        passProps: {
          images: storyImages,
          selectedIndex: index,
        },
      },
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

  return (
    <View style={props.style} onTouchStart={() => onCancelAutoMoveNext()}>
      <View style={style.container}>
        <View style={style.picturesContainer}>
          {/* <FastImage
            source={{ uri: item.poster }}
            style={style.picturesContainer}
            resizeMode={FastImage.resizeMode.cover}
          /> */}
          {/* {preLoad && ( */}
          <ImageThumbnailsView
            images={item.images}
            onSelectImage={onSelectImage}
          />
          {/* )} */}
        </View>
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
              <TouchableOpacity onPress={() => handlePressFollow()}>
                <Text style={style.follow}>
                  {t(!item.user?.follow_status ? 'follow' : 'following')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[ml(2), { color: colors.white, fontSize: 12 }]}>
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
              {Utils.parseInteraction(storyItem.numberOfLikes)}
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
              {Utils.parseInteraction(storyItem.numberOfComments)}
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
        {storyItem.song && (
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
                {`${storyItem.song.name} - ${storyItem.song.single_name}`}
              </Text>
            )}
            {show && (
              <AutoScrolling style={{ width: 130 }} endPaddingWidth={10}>
                <Text style={{ color: colors.white, fontSize: 15 }}>
                  {`${storyItem.song.name} - ${storyItem.song.single_name} `}
                </Text>
              </AutoScrolling>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

StoryPicturesView.propTypes = {};

export default StoryPicturesView;
