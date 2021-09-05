import React from 'react';
import { View } from 'react-native';
import { fullScreenOptions } from '../../commons/options';
import { WebviewWrapper, NavBar, Layout } from '../../components';

const PageWebview = ({
  componentId,
  title = '',
  url = '',
  showAsModal = false,
  onClosePress = null, // for modal only
  onLoadEnd = null,
  ...props
}) => {
  console.log(url);
  console.log(title);
  return (
    <Layout>
      {showAsModal ? (
        <NavBar
          title={title}
          parentComponentId={componentId}
          showCloseButton
          onLeftPress={() => onClosePress && onClosePress(componentId)}
        />
      ) : (
        <NavBar title={title} parentComponentId={componentId} />
      )}
      <WebviewWrapper
        {...props}
        source={{ uri: url }}
        androidHardwareAccelerationDisabled={true}
        mediaPlaybackRequiresUserAction={true}
        onLoadEnd={navState => onLoadEnd && onLoadEnd(componentId, navState)}
      />
    </Layout>
  );
};

PageWebview.options = fullScreenOptions;

export default PageWebview;
