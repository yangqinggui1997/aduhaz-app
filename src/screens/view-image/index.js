import * as React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import style from './style';
import colors from '../../theme/colors';
import ImageView from '../../components/image-view';
import Images from '../../assets/images';
import LoadingComponent from '../../components/loading-view';
import { useNavigation } from '../../hooks';
import { Navigation } from 'react-native-navigation';
import { wp } from '../../commons/responsive';

function ViewImageScreen(props) {
  const {
    images,
    enableImageZoom,
    selectedIndex,
    resizeMode,
    componentId,
    onClose,
  } = props;
  const navigation = useNavigation(componentId);

  const imageUrls = images.map(url => ({ url }));

  const renderImage = prop => {
    return (
      <ImageView
        {...prop}
        style={{ flex: 1 }}
        source={{
          uri: prop.source.uri,
          priority: ImageView.priority.normal,
        }}
        resizeMode={resizeMode}
        placeholderImage={Images.empty}
      />
    );
  };

  const renderIndicator = (currentIndex, allSize) => {
    if (allSize > 1) {
      const listIndicator = [...Array(allSize)].map((_, i) => (
        <View
          style={[style.normalDot, i === currentIndex - 1 && style.activeDot]}
        />
      ));
      return <View style={style.indicatorContainer}>{listIndicator}</View>;
    }
    return null;
  };

  const loadingRender = () => <LoadingComponent loading />;

  const onPressClose = () => {
    onClose?.();
    Navigation.dismissModal(componentId);
  };

  return (
    <View style={style.container}>
      <TouchableOpacity style={style.closeBtn} onPress={onPressClose}>
        <Ionicons style={style.closeIcon} name="close-outline" size={wp(27)} />
      </TouchableOpacity>
      <ImageViewer
        imageUrls={imageUrls}
        enableImageZoom={enableImageZoom}
        renderImage={renderImage}
        renderIndicator={renderIndicator}
        loadingRender={loadingRender}
        index={selectedIndex}
        enableSwipeDown
        saveToLocalByLongPress={false}
        onSwipeDown={onPressClose}
        backgroundColor={colors.white}
      />
    </View>
  );
}

ViewImageScreen.propTypes = {};
ViewImageScreen.defaultProps = {};

export default ViewImageScreen;
