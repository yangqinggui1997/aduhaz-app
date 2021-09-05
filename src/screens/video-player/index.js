import React, { useState, useEffect } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import { Navigation } from 'react-native-navigation';

import styles from './style';

export default function VideoPlayerScreen({
  componentId,
  url,
  toggleResizeModeOnFullscreen = true,
  controlAnimationTiming = 500,
  doubleTapTime = 130,
  playInBackground = false,
  playWhenInactive = false,
  resizeMode = 'contain',
  isFullscreen = true,
  showOnStart = true,
  paused = false,
  repeat = true,
  muted = false,
  volume = 0.5,
  title = '',
  rate = 1,
  ...props
}) {
  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  const onBackPress = () => {
    Navigation.dismissModal(componentId);
  };

  return (
    <VideoPlayer
      source={{
        uri: url,
      }}
      style={styles.container}
      onBack={() => onBackPress()}
      toggleResizeModeOnFullscreen={toggleResizeModeOnFullscreen}
      controlAnimationTiming={controlAnimationTiming}
      doubleTapTime={doubleTapTime}
      playInBackground={playInBackground}
      playWhenInactive={playWhenInactive}
      resizeMode={resizeMode}
      isFullscreen={isFullscreen}
      showOnStart={showOnStart}
      paused={paused}
      repeat={repeat}
      muted={muted}
      volume={volume}
      title={title}
      rate={rate}
      {...props}
    />
  );
}
