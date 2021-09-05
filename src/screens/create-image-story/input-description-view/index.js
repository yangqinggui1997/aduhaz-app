import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  FlatList,
} from 'react-native';
import { useNavigation } from '../../../hooks';
import {
  NavBar,
  Layout,
  PopupDialog,
  UploadProgressView,
  showUploadSongPopup,
  AppSlider,
} from '../../../components';
import DocumentPicker from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import ViewShot from 'react-native-view-shot';
import ImageThumbnailsView from '../../../components/image-thumbnails-view';
import Sound from 'react-native-sound';

import style from './styles';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';
import images from '../../../assets/images';
import { STORY_FONTS } from '../../../theme/fonts';

import apiServices from '../../../services';
import { RESPONSE_STATUS, POST_STORY_TYPE } from '../../../commons/constants';
import ImgToBase64 from 'react-native-image-base64';
import Screens from '../../screens';
import FastImage from 'react-native-fast-image';
import Utils from '../../../commons/utils';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import {
  setPassData,
  setPassStoryImage,
} from '../../../redux/store/reducers/bottomTab/action';
import StoryImageItem from '../../../models/story-imge';

const InputDescriptionView = ({
  componentId,
  imageFiles,
  onCreateSuccess,
  storyItem,
  type,
  onFinishUpdateStory,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const dispatch = useDispatch();

  const [content, setContent] = useState(
    storyItem ? storyItem.description : '',
  );
  const [selectedColor, setSelectedColor] = useState(
    storyItem ? storyItem.descriptionColor : colors.STORY_COLOR_LIST[0],
  );
  const [selectedFont, setSelectedFont] = useState(
    storyItem
      ? STORY_FONTS.filter(font => font.name === storyItem.descriptionFont)[0]
      : STORY_FONTS[0],
  );
  const [showColorList, setShowColorList] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const viewShot = useRef(null);
  const sound = useRef(null);

  const trimTimeRef = useRef({ start: 0, end: 60 });
  const [trimTime, setTrimTime] = useState({ start: 0, end: 60 });
  const [maxDuration, setMaxDuration] = useState(10);
  const [startSongTimer, setStartSongTimer] = useState(false);

  useEffect(() => {
    console.log('###selectedSong: ', selectedSong);
    let duration = 60;
    if (selectedSong && selectedSong.duration) {
      duration = parseInt(selectedSong.duration);
      const time = {
        start: 0,
        end: duration,
      };
      setTrimTime(time);
      trimTimeRef.current = time;
      console.log('###time: ', time);
    }
    setMaxDuration(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSong]);

  useEffect(() => {
    let interval;
    if (startSongTimer) {
      if (sound.current) {
        interval = setInterval(() => {
          sound.current.getCurrentTime((atSeconds, playingState) => {
            console.log('###play atSeconds: ', atSeconds);
            if (atSeconds > trimTimeRef.current.end) {
              sound.current.stop();
              setIsPlaying(false);
              clearInterval(interval);
            }
          });
        }, 1000);
      }
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSongTimer]);

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.stop();
        sound.current.release();
      }
    };
  }, []);

  const onLeftPress = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, []);

  const onDismiss = () => {
    if (_.isFunction(onCreateSuccess)) {
      onCreateSuccess();
    }
    Navigation.dismissAllModals();
  };

  const onPost = async () => {
    setIsLoading(true);
    try {
      const thumbnailFile = await viewShot.current.capture();
      const base64 = await ImgToBase64.getBase64String(thumbnailFile);
      const response = await apiServices.createImageStory(
        {
          description: content,
          description_color: selectedColor,
          description_font: selectedFont.name,
          poster: `data:image/${thumbnailFile
            .split('.')
            .pop()};base64,${base64}`,
          images: imageFiles,
          ...(selectedSong
            ? {
                id_song: selectedSong.id,
                start: trimTimeRef.current.start,
                end: trimTimeRef.current.end,
              }
            : {}),
          // mask: [],
        },
        e => {
          setUploadProgress(e.loaded / e.total);
        },
      );
      const result = response.data;
      console.log(response);
      if (result.status == RESPONSE_STATUS.OK) {
        console.log('CREATE RESULT: ', result);
        const getStoryResponse = await apiServices.getImageStoryById({
          id: result.id,
        });
        dispatch(
          setPassStoryImage(StoryImageItem.clone(getStoryResponse.data.data)),
        );
        Alert.alert(
          t('complete'),
          t('createStorySuccess'),
          [
            {
              text: t('ok'),
              onPress: () => onDismiss(),
            },
          ],
          {
            onDismiss: () => onDismiss(),
          },
        );
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
      setIsLoading(false);
      setUploadProgress(0);
    } catch (error) {
      console.log('POST ERROR: ', JSON.stringify(error));
      Alert.alert(t('error'), t('someThingWentWrong'));
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const onUpdateStoryImage = async () => {
    setIsLoading(true);
    setUploadProgress(1);
    try {
      const response = await apiServices.updateImageStory({
        id_story: storyItem.id,
        id_song: storyItem.song ? storyItem.song.id : '',
        description: content,
        description_color: selectedColor,
        description_font: selectedFont.name,
        _method: 'PUT',
      });
      if (
        response &&
        response.data &&
        response.data.status === RESPONSE_STATUS.OK
      ) {
        Alert.alert(
          t('complete'),
          t('updateStorySuccess'),
          [
            {
              text: t('ok'),
              onPress: () => {
                if (_.isFunction(onFinishUpdateStory)) {
                  onFinishUpdateStory();
                }
                Navigation.dismissModal(componentId);
              },
            },
          ],
          {
            onDismiss: () => {
              if (_.isFunction(onFinishUpdateStory)) {
                onFinishUpdateStory();
              }
              Navigation.dismissModal(componentId);
            },
          },
        );
      } else if (response?.data?.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: response?.data?.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
      setIsLoading(false);
      setUploadProgress(0);
    } catch (error) {
      console.log('on update image story error: ', JSON.stringify(error));
      Alert.alert(t('error'), t('someThingWentWrong'));
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const onChangeFont = () => {
    const currentFontIndex = STORY_FONTS.findIndex(
      f => f.name === selectedFont.name,
    );
    if (currentFontIndex < STORY_FONTS.length - 1) {
      setSelectedFont(STORY_FONTS[currentFontIndex + 1]);
    } else {
      setSelectedFont(STORY_FONTS[0]);
    }
  };

  const onPressedMusics = () => {
    navigation.showModal(Screens.MusicStore, {
      onFinish: newSong => {
        console.log(newSong);
        setSelectedSong(newSong);
        sound.current = new Sound(newSong.directory, null, error => {
          if (error) {
            return;
          } else {
            if (sound.current) {
              setSelectedSong({
                ...newSong,
                duration: sound.current.getDuration(),
              });
            }
          }
        });
      },
    });
  };

  const onPressUploadAudio = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'cachesDirectory',
      });
      if (res.type.includes('audio')) {
        showUploadSongPopup({
          songItem: res,
          onFinish: newSong => {
            setSelectedSong(newSong);
            sound.current = new Sound(
              newSong.songItem.fileCopyUri,
              null,
              error => {
                if (error) {
                  return;
                } else {
                  if (sound.current) {
                    setSelectedSong({
                      ...newSong,
                      duration: sound.current.getDuration(),
                    });
                  }
                }
              },
            );
          },
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const onPressedRemoveSong = () => {
    if (sound.current) {
      setStartSongTimer(false);
      sound.current.stop();
      sound.current.release();
      sound.current = null;
    }
    setSelectedSong(null);
    setIsPlaying(false);
  };

  const renderPostButton = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          type === POST_STORY_TYPE.NEW ? onPost() : onUpdateStoryImage()
        }
        disabled={_.isEmpty(content)}>
        <Text
          style={[
            style.postButtonText,
            { color: !_.isEmpty(content) ? colors.black : colors.flatGrey11 },
          ]}>
          {t('createPostButton')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <TouchableWithoutFeedback
        style={style.container}
        onPress={Keyboard.dismiss}>
        <View style={style.container}>
          <NavBar
            parentComponentId={componentId}
            showCloseButton
            accessoryRight={renderPostButton}
            title={
              type === POST_STORY_TYPE.NEW
                ? t('createImageStoryTitle')
                : t('editStory')
            }
            onLeftPress={onLeftPress}
          />
          <View style={style.separator} />
          <TextInput
            style={[
              style.contentInput,
              { color: selectedColor, fontFamily: selectedFont.name },
            ]}
            maxLength={150}
            value={content}
            numberOfLines={4}
            placeholder={t('createStoryContentPlaceholder')}
            onChangeText={text => setContent(text)}
          />
          {!showColorList && (
            <View style={style.toolbarContainer}>
              <TouchableOpacity onPress={() => setShowColorList(true)}>
                <Image
                  source={images.icon_color_wheel}
                  style={style.iconColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={style.fontButton}
                onPress={() => onChangeFont()}>
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: selectedFont.name,
                  }}>
                  {selectedFont.title}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {showColorList && (
            <View style={style.toolbarContainer}>
              <FlatList
                data={colors.STORY_COLOR_LIST}
                horizontal={true}
                // style={{ width: '100%', height: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps="always"
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setShowColorList(false);
                      setSelectedColor(item);
                    }}>
                    <View style={[style.iconColor, { backgroundColor: item }]}>
                      {item === selectedColor && (
                        <View style={style.selectedDot} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ width: wp(16) }} />
                )}
                ListHeaderComponent={() => (
                  <TouchableOpacity
                    style={[style.closeListButton, { marginLeft: 0 }]}
                    onPress={() => {
                      setShowColorList(false);
                    }}>
                    <Ionicons
                      name="close-outline"
                      color={colors.flatGrey11}
                      size={18}
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => 'key' + index.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          <ViewShot ref={viewShot} style={style.imagesContainer}>
            <ImageThumbnailsView
              images={imageFiles}
              // onSelectImage={onSelectImage}
            />
          </ViewShot>
          {selectedSong && (
            <View style={style.songAndTrimContainer}>
              <View style={style.songContainer}>
                <TouchableOpacity
                  style={style.musicIconContainer}
                  disabled={sound.current === null}
                  onPress={() => {
                    if (!isPlaying) {
                      setIsPlaying(true);
                      console.log(
                        '###trimTimeRef.current: ',
                        trimTimeRef.current,
                      );
                      sound.current.setCurrentTime(trimTimeRef.current.start);
                      sound.current.play(success => {
                        setIsPlaying(false);
                      });
                      setStartSongTimer(true);
                    } else {
                      setStartSongTimer(false);
                      sound.current.stop();
                      setIsPlaying(false);
                    }
                  }}>
                  <FastImage
                    style={style.musicIcon}
                    source={{
                      uri: selectedSong.icon,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <Ionicons
                    name={
                      !isPlaying
                        ? 'play-circle-outline'
                        : 'pause-circle-outline'
                    }
                    color={colors.black}
                    size={24}
                  />
                </TouchableOpacity>

                <View style={style.musicDetail}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}>
                    {selectedSong.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={style.author}>
                    {selectedSong.single_name}
                  </Text>
                  <Text style={style.author}>
                    {selectedSong.duration
                      ? Utils.getSongDurationString(selectedSong.duration)
                      : '--:--'}
                  </Text>
                  {/* <Text style={style.author}>3:33</Text> */}
                </View>
                <TouchableOpacity
                  onPress={() => onPressedRemoveSong()}
                  style={style.removeSongButton}>
                  <Ionicons
                    name="close-outline"
                    size={18}
                    color={colors.black}
                  />
                </TouchableOpacity>
              </View>
              <View style={style.trimSongContainer}>
                <Text style={style.trimSongTitle}>{`${t('trimSong')}: ${
                  trimTimeRef.current.start
                    ? Utils.getSongDurationString(trimTimeRef.current.start)
                    : '0:0'
                } - ${
                  trimTimeRef.current.end
                    ? Utils.getSongDurationString(trimTimeRef.current.end)
                    : '--'
                }`}</Text>
                <AppSlider
                  style={style.sliderStyle}
                  rangeSlider={true}
                  min={0}
                  max={maxDuration}
                  selectedMin={trimTime.start}
                  selectedMax={trimTime.end}
                  step={10}
                  onValueChanged={(low, high, _) => {
                    if (
                      trimTimeRef.current.start !== parseInt(low) ||
                      trimTimeRef.current.end !== parseInt(high)
                    ) {
                      const time = {
                        start: low ? parseInt(low) : 0,
                        end: high ? parseInt(high) : 60,
                      };
                      setTrimTime(time);
                      trimTimeRef.current = time;
                    }
                  }}
                  renderRail={() => <View style={style.sliderRailContainer} />}
                  renderRailSelected={() => (
                    <View style={style.sliderRailSelectedContainer} />
                  )}
                  renderThumb={() => (
                    <View style={style.sliderThumbContainer}>
                      <View style={style.sliderThumbInside} />
                    </View>
                  )}
                />
              </View>
            </View>
          )}
          {type === POST_STORY_TYPE.NEW && (
            <View style={style.footer}>
              <TouchableOpacity
                onPress={() => onPressedMusics()}
                style={style.footerButton}>
                <View style={style.footerIcon}>
                  <Ionicons
                    name="musical-notes-outline"
                    size={26}
                    color={colors.black}
                  />
                </View>
                <Text style={style.footerText}>
                  {t('createStoryToolbarMusics')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onPressUploadAudio}
                style={style.footerButton}>
                <View style={style.footerIcon}>
                  <Ionicons
                    name="arrow-up-outline"
                    size={26}
                    color={colors.black}
                  />
                </View>
                <Text style={style.footerText}>
                  {t('createStoryToolbarUploadMusics')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {isLoading && (
        <PopupDialog>
          <UploadProgressView progress={uploadProgress} />
        </PopupDialog>
      )}
    </Layout>
  );
};

export default InputDescriptionView;
