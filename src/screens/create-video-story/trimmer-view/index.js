import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import { VideoPlayer, Trimmer } from 'react-native-video-processing';
import { Layout, NavBar } from '../../../components';

import style from './styles';

import colors from '../../../theme/colors';
import { wp } from '../../../commons/responsive';
import images from '../../../assets/images';
import AppSlider from '../../../components/slider';

import { createThumbnail } from 'react-native-create-thumbnail';
import _ from 'lodash';
import { useNavigation } from '../../../hooks';
import Screens from '../../screens';
import Video from 'react-native-video';

const TrimmerView = ({
  componentId,
  videoFile,
  maxDuration,
  onCreateSuccess,
  onFinish,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [trimTime, setTrimTime] = useState({ start: 0, end: 10 });
  const [play, setPlay] = useState(true);
  const [videoThumbs, setVideoThumbs] = useState([]);
  const [videoOrientation, setVideoOrientation] = useState(
    Platform.OS === 'android'
      ? videoFile.width < videoFile.height
        ? 'portrait'
        : 'landscape'
      : '',
  );

  const videoPlayerRef = useRef(null);

  useEffect(() => {
    setTrimTime({
      start: 0,
      end: Platform.OS === 'android' ? maxDuration : videoFile.duration,
    });

    var thumbRequests = [];

    for (var i = 0; i < 10; i++) {
      thumbRequests.push(
        createThumbnail({
          url: videoFile.path,
          timeStamp: i * (videoFile.duration / 10),
        }),
      );
    }
    Promise.all(thumbRequests)
      .then(results => {
        setVideoThumbs(results);
      })
      .catch(e => {
        console.log('###createThumbnail - eror: ', e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressDone = () => {
    const options = {
      startTime: trimTime.start,
      endTime: trimTime.end,
      quality:
        Platform.OS === 'ios'
          ? VideoPlayer.Constants.quality.QUALITY_1280x720
          : null, // iOS only
      saveToCameraRoll: true, // default is false // iOS only
      saveWithCurrentDate: true, // default is false // iOS only
    };
    videoPlayerRef.current
      .trim(options)
      .then(newSource => {
        console.log(newSource);
        if (_.isFunction(onFinish)) {
          Navigation.dismissModal(componentId);
          onFinish({
            ...videoFile,
            path: `${
              !newSource.includes('file://') ? 'file://' : ''
            }${newSource}`,
            duration: maxDuration,
          });
        } else {
          navigation.push(Screens.CreateVideoStory, {
            videoFile: {
              path: `${
                !newSource.includes('file://') ? 'file://' : ''
              }${newSource}`,
              width: videoFile.width,
              height: videoFile.height,
            },
            onCreateSuccess,
          });
        }
      })
      .catch(error => {
        console.log('###trim - error: ', error);
      });
  };

  const renderPostButton = () => {
    return (
      <TouchableOpacity
        onPress={() => onPressDone()}
        disabled={trimTime.end - trimTime.start > maxDuration}>
        <Text
          style={[
            style.doneButtonText,
            {
              color:
                trimTime.end - trimTime.start > maxDuration
                  ? colors.flatGrey11
                  : colors.black,
            },
          ]}>
          {t('done')}
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
            title={t('trimmerViewTitle')}
            onLeftPress={() => Navigation.dismissModal(componentId)}
          />
          <View style={style.separator} />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={style.videoContainer}>
              {videoOrientation === '' && (
                <Video
                  style={{ width: 0, height: 0 }}
                  source={{ uri: videoFile.path }}
                  onLoad={response => {
                    const { width, height, orientation } = response.naturalSize;
                    setVideoOrientation(orientation);
                    console.log(orientation);
                  }}
                />
              )}
              {(videoOrientation !== '' || Platform.OS === 'android') && (
                <VideoPlayer
                  ref={videoPlayerRef}
                  rotate={videoOrientation === 'portrait' ? true : false}
                  startTime={trimTime.start} // seconds
                  endTime={trimTime.end} // seconds
                  currentTime={trimTime.start}
                  play={play} // default false
                  replay={true} // should player play video again if it's ended
                  source={videoFile.path}
                  playerWidth={Dimensions.get('screen').width} // iOS only
                  playerHeight={wp(250)} // iOS only
                  style={{ flex: 1 }}
                  resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                  // onChange={({ nativeEvent }) => console.log({ nativeEvent })} // get Current time on every second
                />
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => setPlay(!play)}>
                <Ionicons
                  name={play ? images.icon_pause : images.icon_play}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginBottom: wp(10) }}>
              <Text
                style={{
                  color:
                    trimTime.end - trimTime.start > maxDuration
                      ? colors.red
                      : colors.black,
                }}>{`${t('totalSelected')}: ${Math.ceil(
                trimTime.end - trimTime.start,
              )}s (${t('maxSelection')} ${maxDuration}s)`}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View>
                {/* {Platform.OS === 'ios' && (
                  <Trimmer
                    source={videoFile.path}
                    height={50}
                    width={Dimensions.get('screen').width - 16}
                    // onTrackerMove={e => console.log(e.currentTime)} // iOS only
                    currentTime={trimTime.start} // use this prop to set tracker position iOS only
                    themeColor={colors.appYellow} // iOS only
                    thumbWidth={20} // iOS only
                    trackerColor={'white'} // iOS only
                    onChange={e => {
                      setTrimTime({ start: e.startTime, end: e.endTime });
                      setPlay(false);
                    }}
                  />
                )}
                {Platform.OS === 'android' && ( */}
                <AppSlider
                  style={style.sliderStyle}
                  rangeSlider={true}
                  min={0}
                  max={videoFile.duration}
                  selectedMin={trimTime.start}
                  selectedMax={trimTime.end}
                  step={1}
                  onValueChanged={(low, high, _) => {
                    if (
                      trimTime.start !== parseInt(low) ||
                      trimTime.end !== parseInt(high)
                    ) {
                      setTrimTime({ start: low, end: high });
                      setPlay(false);
                    }
                  }}
                  renderRail={() => (
                    <View style={style.sliderRailContainer}>
                      {videoThumbs.map(thumb => (
                        <Image
                          key={thumb.path}
                          source={{ uri: thumb.path }}
                          style={style.videoThumb}
                        />
                      ))}
                    </View>
                  )}
                  renderRailSelected={() => (
                    <View style={style.sliderRailSelectedContainer} />
                  )}
                  renderThumb={() => (
                    <View style={style.sliderThumbContainer}>
                      <View style={style.sliderThumbInside} />
                    </View>
                  )}
                />
                {/* )} */}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default TrimmerView;
