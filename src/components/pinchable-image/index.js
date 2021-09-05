import _ from 'lodash';
import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  
} from 'react-native-gesture-handler';

export class PinchableImage extends React.Component {
  panRef = React.createRef();
  rotationRef = React.createRef();
  pinchRef = React.createRef();
  dragRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      _isMounted: false,
    };

    /* Pinching */
    this._baseScale = new Animated.Value(1);
    this._pinchScale = new Animated.Value(1);
    this._scale = Animated.multiply(this._baseScale, this._pinchScale);
    this._lastScale = 1;
    this._onPinchGestureEvent = Animated.event(
      [{ nativeEvent: { scale: this._pinchScale } }],
      { useNativeDriver: true },
    );

    /* Rotation */
    this._rotate = new Animated.Value(0);
    this._rotateStr = this._rotate.interpolate({
      inputRange: [-100, 100],
      outputRange: ['-100rad', '100rad'],
    });
    this._lastRotate = 0;
    this._onRotateGestureEvent = Animated.event(
      [{ nativeEvent: { rotation: this._rotate } }],
      { useNativeDriver: true },
    );

    /* Tilt */
    this._tilt = new Animated.Value(0);
    this._tiltStr = this._tilt.interpolate({
      inputRange: [-501, -500, 0, 1],
      outputRange: ['1rad', '1rad', '0rad', '0rad'],
    });
    this._lastTilt = 0;
    this._onTiltGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._tilt } }],
      { useNativeDriver: true },
    );

    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);

    this._lastOffset = { x: 0, y: 0 };
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: e => {
          if (_.isFunction(this.props.onTouchMove)) {
            this.props.onTouchMove({
              x: e.nativeEvent.translationX,
              y: e.nativeEvent.translationY,
            });
          }
        },
      },
    );
  }

  _onRotateHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastRotate += event.nativeEvent.rotation;
      this._rotate.setOffset(this._lastRotate);
      this._rotate.setValue(0);
    }
  };
  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastScale *= event.nativeEvent.scale;
      this._baseScale.setValue(this._lastScale);
      this._pinchScale.setValue(1);
    }
  };
  _onTiltGestureStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastTilt += event.nativeEvent.translationY;
      this._tilt.setOffset(this._lastTilt);
      this._tilt.setValue(0);
    }
  };

  _onHandlerStateChange = event => {
    console.log(event.nativeEvent);

    if (event.nativeEvent.oldState === State.UNDETERMINED) {
      if (_.isFunction(this.props.onTouchStart)) {
        this.props.onTouchStart();
      }
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);

      if (_.isFunction(this.props.onTouchEnd)) {
        this.props.onTouchEnd({ x: this._lastOffset.x, y: this._lastOffset.y });
      }
    }
  };

  render() {
    const { imageSource, imageStyle } = this.props;

    return (
      <React.Fragment>
        <PanGestureHandler
          ref={this.dragRef}
          simultaneousHandlers={[this.rotationRef, this.pinchRef]}
          onGestureEvent={this._onGestureEvent}
          // shouldCancelWhenOutside={true}
          minPointers={1}
          maxPointers={2}
          avgTouches
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View
            style={[
              styles.wrapper,
              imageStyle ?? {},
              {
                transform: [
                  { translateX: this._translateX },
                  { translateY: this._translateY },
                ],
              },
            ]}>
            <RotationGestureHandler
              ref={this.rotationRef}
              simultaneousHandlers={this.pinchRef}
              onGestureEvent={this._onRotateGestureEvent}
              onHandlerStateChange={this._onRotateHandlerStateChange}>
              <Animated.View
                style={[
                  styles.wrapper,
                  {
                    transform: [{ rotate: this._rotateStr }],
                  },
                ]}>
                <PinchGestureHandler
                  ref={this.pinchRef}
                  simultaneousHandlers={this.rotationRef}
                  onGestureEvent={this._onPinchGestureEvent}
                  onHandlerStateChange={this._onPinchHandlerStateChange}>
                  <Animated.View
                    style={[
                      styles.container,
                      imageStyle ?? {},
                      {
                        transform: [{ scale: this._scale }],
                      },
                    ]}
                    collapsable={false}>
                    <Animated.Image
                      resizeMode={'contain'}
                      style={[styles.pinchableImage]}
                      source={imageSource}
                    />
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </RotationGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        {/* { children } */}
      </React.Fragment>
    );
  }
}

export default PinchableImage;

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  pinchableImage: {
    backgroundColor: 'transparent',
    // ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    width: '100%',
    height: '100%'
  },
  wrapper: {
    flex: 1,
  },
});
