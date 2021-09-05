import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import Video from '../../components/video-player';
import { POST_STORY_TYPE } from '../../commons/constants';
import { useNavigation } from '../../hooks';
import { NavBar, Layout } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import InputTextStickerView from './input-text-sticker';
import PinchableImage from '../../components/pinchable-image';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import showStickerSelectionView from '../../components/sticker-selection-view';
import ViewShot from 'react-native-view-shot';
import style from './styles';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import Screens from '../screens';

const CreateVideoStory = gestureHandlerRootHOC(
  ({ componentId, videoFile, onCreateSuccess }) => {
    const { t } = useTranslation();
    const navigation = useNavigation(componentId);

    const [isLoading, setIsLoading] = useState(false);
    const [showInputText, setShowInputText] = useState(false);
    const [stickers, setStickers] = useState([]);
    const [showDeleteSticker, setShowDeleteSticker] = useState(false);
    const [canDeleteSticker, setCanDeleteSticker] = useState(false);
    const [playerState, setPlayerState] = useState(Video.PlayerState.AUTOPLAY);
    const [mutedVideo, setMutedVideo] = useState(false);

    const viewShot = useRef(null);

    const onLeftPress = useCallback(() => {
      Navigation.dismissModal(componentId);
    }, []);

    const onNextPress = () => {
      setIsLoading(true);
      setTimeout(() => {
        viewShot.current
          .capture()
          .then(uri => {
            setIsLoading(false);
            setPlayerState(Video.PlayerState.PAUSE);
            console.log('do something with ', uri);
            navigation.showModal(Screens.InputVideoStoryDescription, {
              videoFile,
              stickerMask: `data:image/png;base64,${uri}`,
              mutedVideo,
              onCreateSuccess,
              type: POST_STORY_TYPE.NEW,
            });
          })
          .catch(error => {
            console.log(error);
            setIsLoading(false);
          });
      }, 200);
    };

    const onStickerTouchEnd = (offset, index) => {
      const { top, bottom } = initialWindowMetrics.insets;
      const deletePositionY =
        (Dimensions.get('screen').height - top - bottom - wp(135)) / 2;
      console.log(deletePositionY, offset);

      if (
        Math.abs(offset.x) <= 10 &&
        Math.abs(offset.y - deletePositionY) <= 20
      ) {
        var _stickers = [...stickers];
        _stickers.splice(index, 1);
        setStickers(_stickers);
      }
      setShowDeleteSticker(false);
    };

    const onPressedStickers = () => {
      showStickerSelectionView({
        onSelected: sticker => {
          var _stickers = [...stickers];
          _stickers.push({
            type: 'IMAGE',
            source: sticker,
          });
          setStickers(_stickers);
        },
      });
    };

    const onFinishSelectMusic = song => {
      setSelectedSong(song);
    };

    const renderPostButton = () => {
      if (isLoading) {
        return (
          <Progress.Circle
            size={30}
            indeterminate={true}
            color={'black'}
            borderWidth={1.5}
          />
        );
      }
      return (
        <TouchableOpacity onPress={() => onNextPress()}>
          <Text style={style.postButtonText}>{t('next')}</Text>
        </TouchableOpacity>
      );
    };

    const renderStickerView = (sticker, index) => {
      const { top, bottom } = initialWindowMetrics.insets;
      const screenHeight = Dimensions.get('screen').height;
      const screenWidth = Dimensions.get('screen').width;
      const topPosition =
        (screenHeight - top - bottom - wp(55) - (sticker.height ?? wp(150))) /
        2;
      const leftPosition = (screenWidth - (sticker.width ?? wp(150))) / 2;
      const deletePositionY = (screenHeight - top - bottom - wp(135)) / 2;
      if (sticker.type === 'TEXT') {
        return (
          <View
            key={JSON.stringify(sticker)}
            style={{
              position: 'absolute',
              top: topPosition,
              left: leftPosition,
            }}
            onTouchEnd={() => setShowInputText(true)}>
            <PinchableImage
              imageStyle={{
                width: sticker.width ?? wp(150),
                height: sticker.height ?? wp(150),
              }}
              imageSource={{ uri: sticker.uri }}
              onTouchStart={() => {
                setShowDeleteSticker(true);
              }}
              onTouchMove={offset => {
                const canDelete =
                  Math.abs(offset.x * offset.scale) <= 10 &&
                  Math.abs(offset.y * offset.scale - deletePositionY) <= 20;
                if (canDelete !== canDeleteSticker) {
                  setCanDeleteSticker(canDelete);
                }
              }}
              onTouchEnd={offset => onStickerTouchEnd(offset, index)}
            />
          </View>
        );
      } else if (sticker.type === 'IMAGE') {
        return (
          <View
            key={JSON.stringify(sticker)}
            style={{
              position: 'absolute',
              top: topPosition,
              left: leftPosition,
            }}>
            <PinchableImage
              imageStyle={{ width: wp(150), height: wp(150) }}
              imageSource={sticker.source}
              onTouchStart={() => {
                setShowDeleteSticker(true);
              }}
              onTouchMove={offset => {
                const canDelete =
                  Math.abs(offset.x) <= 10 &&
                  Math.abs(offset.y - deletePositionY) <= 20;
                if (canDelete !== canDeleteSticker) {
                  setCanDeleteSticker(canDelete);
                }
              }}
              onTouchEnd={offset => onStickerTouchEnd(offset, index)}
            />
          </View>
        );
      }
      return <View />;
    };

    return (
      <Layout style={style.container}>
        <TouchableWithoutFeedback
          style={style.container}
          onPress={Keyboard.dismiss}>
          <View style={style.container}>
            <NavBar
              style={{ zIndex: 9999 }}
              parentComponentId={componentId}
              showCloseButton
              accessoryRight={renderPostButton}
              title={t('createVideoStoryTitle')}
              onLeftPress={onLeftPress}
            />
            <View style={style.separator} />
            <View style={style.videoContainer}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}>
                <Video
                  videoUrl={videoFile.path}
                  style={{ width: '100%', height: '100%' }}
                  customStyles={{
                    videoWrapper: {
                      width: Dimensions.get('screen').width,
                      height: '100%',
                      justifyContent: 'center',
                    },
                    video:
                      videoFile.width > videoFile.height
                        ? {
                            width: Dimensions.get('screen').width,
                            aspectRatio: videoFile.height
                              ? videoFile.width / videoFile.height
                              : 1,
                          }
                        : {
                            width: Dimensions.get('screen').width,
                            height: '100%',
                          },
                    seekBar: {
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                    },
                  }}
                  resizeMode={'cover'}
                  autoplay={true}
                  loop={true}
                  disableControls={false}
                  playerState={playerState}
                  defaultMuted={false}
                  muted={mutedVideo}
                />
              </View>

              <ViewShot
                style={style.stickersContainer}
                ref={viewShot}
                options={{ format: 'png', quality: 1, result: 'base64' }}>
                <View style={style.stickersContainer}>
                  {stickers.map((sticker, index) =>
                    renderStickerView(sticker, index),
                  )}
                </View>
              </ViewShot>
            </View>
            {!showDeleteSticker && (
              <View style={style.footer}>
                <TouchableOpacity
                  style={style.footerButton}
                  onPress={() => setShowInputText(true)}>
                  <View style={style.footerIcon}>
                    <Ionicons
                      name="text-outline"
                      size={26}
                      color={colors.white}
                    />
                  </View>
                  <Text style={style.footerText}>
                    {t('createStoryToolbarText')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.footerButton}
                  onPress={() => onPressedStickers()}>
                  <View style={style.footerIcon}>
                    <Ionicons
                      name="happy-outline"
                      size={26}
                      color={colors.white}
                    />
                  </View>
                  <Text style={style.footerText}>
                    {t('createStoryToolbarStickers')}
                  </Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={style.footerButton}
                    onPress={() => setMutedVideo(!mutedVideo)}>
                    <View style={style.footerIcon}>
                      <Ionicons
                        name={
                          mutedVideo
                            ? 'volume-mute-outline'
                            : 'volume-high-outline'
                        }
                        size={30}
                        color={colors.white}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {showDeleteSticker && (
              <View
                style={[
                  style.footer,
                  { flexDirection: 'column', justifyContent: 'center' },
                  { transform: [{ scale: canDeleteSticker ? 1.2 : 1 }] },
                ]}>
                <View style={style.footerIcon}>
                  <Ionicons
                    name="trash-outline"
                    size={26}
                    color={colors.white}
                  />
                </View>
                <Text style={style.footerText}>
                  {t('createStoryToolbarDelete')}
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        {showInputText && (
          <View style={style.addTextStickerContainer}>
            <InputTextStickerView
              onCancel={() => setShowInputText(false)}
              onFinish={sticker => {
                var _stickers = [...stickers];
                _stickers.push(sticker);
                setStickers(_stickers);
                setShowInputText(false);
              }}
            />
          </View>
        )}
      </Layout>
    );
  },
);

export default CreateVideoStory;
