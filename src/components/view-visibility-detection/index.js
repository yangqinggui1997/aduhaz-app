import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, View } from 'react-native';

const window = Dimensions.get('window');

const MEASURE_DIRECTION = {
  VERTICAL: 'VERTICAL',
  HORIZONTAL: 'HORIZONTAL',
};

const VisibilityDetectionView = ({
  onChange = () => {},
  enableTimer = false,
  delay = 500,
  measuring = false,
  measureDirection = MEASURE_DIRECTION.VERTICAL,
  ...props
}) => {
  const currentRect = useRef({
    rectTop: 0,
    rectBottom: 0,
    rectLeft: 0,
    rectRight: 0,
  });
  const myView = useRef(null);
  const lastVisiblePercentage = useRef(null);
  const interval = useRef(null);

  useEffect(() => {
    console.log('measuring updated: ', measuring);
    if (measuring) {
      measure();
    }
  }, [measure, measuring]);

  useEffect(() => {
    console.log('enableTimer updated: ', enableTimer);
    if (enableTimer) {
      startWatching();
    } else {
      stopWatching();
    }
    return () => {
      stopWatching();
    };
  }, [enableTimer, startWatching]);

  const startWatching = useCallback(() => {
    if (interval.current) {
      return;
    }
    interval.current = setInterval(() => {
      measure();
    }, delay);
  }, [delay, measure]);

  const stopWatching = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  };

  const measure = useCallback(() => {
    myView.current.measure((x, y, width, height, pageX, pageY) => {
      currentRect.current = {
        rectTop: pageY,
        rectBottom: pageY + height,
        rectLeft: pageX,
        rectRight: pageX + width,
      };
      isInViewPort();
    });
  }, [isInViewPort]);

  const isInViewPort = useCallback(() => {
    let visiblePercentage = 0;
    switch (measureDirection) {
      case MEASURE_DIRECTION.VERTICAL:
        {
          const viewHeight =
            currentRect.current.rectBottom - currentRect.current.rectTop;
          const topHidden = Math.abs(Math.min(0, currentRect.current.rectTop));
          const bottomHidden = Math.max(
            0,
            currentRect.current.rectBottom - window.height,
          );
          const visibleHeight = viewHeight - topHidden - bottomHidden;
          visiblePercentage =
            visibleHeight > 0 ? visibleHeight / viewHeight : 0;
        }
        break;
      case MEASURE_DIRECTION.HORIZONTAL:
        {
          const viewWidth =
            currentRect.current.rectRight - currentRect.current.rectLeft;
          const leftHidden = Math.abs(
            Math.min(0, currentRect.current.rectLeft),
          );
          const rightHidden = Math.max(
            0,
            currentRect.current.rectRight - window.width,
          );
          const visibleWidth = viewWidth - leftHidden - rightHidden;
          visiblePercentage = visibleWidth > 0 ? visibleWidth / viewWidth : 0;
        }
        break;
      default:
        break;
    }
    // console.log('currentRect.current: ', currentRect.current);
    // console.log(
    //   'lastVisiblePercentage.current - visiblePercentage: ',
    //   lastVisiblePercentage.current,
    //   visiblePercentage,
    // );
    if (lastVisiblePercentage.current !== visiblePercentage) {
      onChange(visiblePercentage);
      lastVisiblePercentage.current = visiblePercentage;
    }
  }, [measureDirection, onChange]);

  return (
    <View ref={myView} {...props}>
      {props.children}
    </View>
  );
};

VisibilityDetectionView.MeasureDirection = MEASURE_DIRECTION;

export default VisibilityDetectionView;
