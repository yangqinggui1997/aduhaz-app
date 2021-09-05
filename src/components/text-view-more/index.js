import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styles from './style';

const TextViewMore = ({
  renderViewMore,
  renderViewLess,
  numberOfTextLines = 1,
  afterCollapse = () => {},
  afterExpand = () => {},
  textStyle = {},
  children,
}) => {
  const [trimmedTextHeight, setTrimmedTextHeight] = useState(null);
  const [fullTextHeight, setFullTextHeight] = useState(null);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const [isFulltextShown, setIsFulltextShown] = useState(true);
  const [numberOfLines, setNumberOfLines] = useState(numberOfTextLines);

  useEffect(() => {
    console.log(
      `###fullTextHeight: ${fullTextHeight} - trimmedTextHeight: ${trimmedTextHeight} - isFulltextShown: ${isFulltextShown}`,
    );
    if (isFulltextShown && trimmedTextHeight && fullTextHeight) {
      setShouldShowMore(trimmedTextHeight < fullTextHeight);
      setIsFulltextShown(false);
    }
  }, [isFulltextShown, trimmedTextHeight, fullTextHeight]);

  const onLayoutTrimmedText = event => {
    const { height } = event.nativeEvent.layout;

    console.log('###onLayoutTrimmedText - height: ', height);

    setTrimmedTextHeight(height);
  };

  const onLayoutFullText = event => {
    const { height } = event.nativeEvent.layout;

    console.log('###onLayoutFullText - height: ', height);

    setFullTextHeight(height);
  };

  const onPressMore = () => {
    setNumberOfLines(null);
    if (afterExpand) {
      afterExpand();
    }
  };

  const onPressLess = () => {
    setNumberOfLines(numberOfTextLines);
    if (afterCollapse) {
      afterCollapse();
    }
  };

  const getWrapperStyle = () => {
    if (isFulltextShown) {
      return styles.transparent;
    }
    return {};
  };

  const _renderViewMore = () => (
    <Text style={styles.viewMoreText} onPress={onPressMore}>
      View More
    </Text>
  );

  const _renderViewLess = () => (
    <Text style={styles.viewMoreText} onPress={onPressLess}>
      View Less
    </Text>
  );

  const renderFooter = () => {
    if (shouldShowMore === true) {
      if (numberOfLines > 0) {
        if (renderViewMore) {
          return renderViewMore(onPressMore);
        } else {
          return _renderViewMore(onPressMore);
        }
      } else {
        if (renderViewLess) {
          return renderViewLess(onPressLess);
        } else {
          return _renderViewLess(onPressLess);
        }
      }
    }
    return null;
  };

  const renderFullText = () => {
    if (isFulltextShown) {
      return (
        <View onLayout={onLayoutFullText} style={styles.fullTextWrapper}>
          <Text style={textStyle}>{children}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={getWrapperStyle()}>
      <View onLayout={onLayoutTrimmedText}>
        <Text style={textStyle} numberOfLines={numberOfLines}>
          {children}
        </Text>
        {renderFooter()}
      </View>

      {renderFullText()}
    </View>
  );
};

export default TextViewMore;
