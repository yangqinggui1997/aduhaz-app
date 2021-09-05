import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useState } from 'react';
import { useRef } from 'react';

import VideoControl from '../../../lib/video-player-control';
import Utils from '../../commons/utils';

const PlayerState = {
  NONE: 'NONE',
  PLAY: 'PLAY',
  STOP: 'STOP',
  PAUSE: 'PAUSE',
  RESUME: 'RESUME',
};

const VideoPlayer = ({
  videoUrl,
  thumnailUrl,
  defaultMuted,
  hideControlsOnStart,
  loop,
  playerState,
  autoplay,
  onEnd,
  onLoadStart,
  onLoad,
  onProgress,
  onPaused,
  ...props
}) => {
  const [videoPlayerState, setVideoPlayerState] = useState(playerState);
  const player = useRef(null);

  useEffect(() => {
    if (playerState !== videoPlayerState) {
      switch (playerState) {
        case PlayerState.PLAY:
          if (player.current) {
            console.log('play()');
            player.current.play();
          }
          break;
        case PlayerState.STOP:
          if (player.current) {
            console.log('stop()');
            player.current.stop();
          }
          break;
        case PlayerState.PAUSE:
          if (player.current) {
            console.log('pause()');
            player.current.pause();
          }
          break;
        case PlayerState.RESUME:
          if (player.current) {
            console.log('resume()', videoUrl);
            player.current.resume();
          }
          break;
      }
      setVideoPlayerState(playerState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerState]);

  const onError = error => {
    console.log(`VideoPlayer - error: ${JSON.stringify(error)}`);
  };

  const _onEnd = () => {
    console.log('VideoPlayer - onEnd');
    if (onEnd) {
      onEnd();
    }
  };

  return (
    <VideoControl
      {...props}
      ref={player}
      video={{ uri: Utils.getCachedVideoUrl(videoUrl) }}
      thumbnail={!_.isEmpty(thumnailUrl) ? { uri: thumnailUrl } : null}
      defaultMuted={defaultMuted}
      hideControlsOnStart={hideControlsOnStart}
      loop={loop}
      autoplay={autoplay}
      onError={onError}
      onEnd={_onEnd}
      onLoadStart={() => {
        // Utils.cacheVieo(Utils.detachVideoFileUrl(videoUrl));
        // console.log('VIDEO LOAD START: ', decodeURI(videoUrl))
        if (_.isFunction(onLoadStart)) {
          onLoadStart();
        }
      }}
      onLoad={e => {
        if (_.isFunction(onLoad)) {
          onLoad(e);
        }
      }}
      onProgress={onProgress}
      onPaused={onPaused}
    />
  );
};

VideoPlayer.PlayerState = PlayerState;

VideoPlayer.propTypes = {
  ...VideoControl.propTypes,
  videoUrl: PropTypes.string,
  thumnailUrl: PropTypes.string,
  defaultMuted: PropTypes.bool,
  hideControlsOnStart: PropTypes.bool,
  hideControlsOnPaused: PropTypes.bool,
  disableControls: PropTypes.bool,
  loop: PropTypes.bool,
  controlsTimeout: PropTypes.number,
  playerState: PropTypes.string,
  autoplay: PropTypes.bool,
  pauseOnPress: PropTypes.bool,
  resizeMode: PropTypes.string,
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  onEnd: PropTypes.func,
  onLoad: PropTypes.func,
  onMutePress: PropTypes.func,
  customStyles: PropTypes.object,
};

VideoPlayer.defaultProps = {
  ...VideoControl.defaultProps,
  videoUrl: '',
  thumnailUrl: '',
  defaultMuted: true,
  hideControlsOnStart: true,
  hideControlsOnPaused: true,
  disableControls: false,
  loop: true,
  pauseOnPress: true,
  controlsTimeout: 3000,
  playerState: PlayerState.NONE,
  autoplay: false,
  resizeMode: 'cover',
  videoWidth: 1280,
  videoHeight: 720,
  onEnd: null,
  onLoad: null,
  onMutePress: null,
  customStyles: {
    controls: {
      height: 18,
      marginTop: -18,
    },
    playIcon: {
      padding: 0,
      marginHorizontal: 5,
      height: 20,
      width: 20,
    },
    volumeIcon: {
      padding: 0,
      marginHorizontal: 5,
      height: 20,
      width: 20,
    },
    fullIcon: {
      padding: 0,
      marginHorizontal: 5,
      height: 20,
      width: 20,
    },
    seekBarKnob: {
      width: 16,
      height: 16,
    },
  },
};

export default VideoPlayer;
