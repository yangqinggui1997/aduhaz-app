import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Navigation } from 'react-native-navigation';

import RBSheet from '../../../lib/react-native-raw-bottom-sheet';
import Colors from '../../theme/colors';

const BottomSheet = ({
  componentId,
  renderBody = null,
  height = 260,
  closeOnDragDown = true,
  keyboardAvoidingViewEnabled = true,
  keyboardAvoidingBehavior = 'padding',
}) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.open();
    }
  }, []);

  const hideBottomSheet = () => {
    if (sheetRef.current) {
      sheetRef.current.close();
    }
  };

  const onRBSheetClosed = () => {
    Navigation.dismissOverlay(componentId);
  };

  return (
    <RBSheet
      ref={sheetRef}
      height={height}
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
      onClose={onRBSheetClosed}
      keyboardAvoidingViewEnabled={keyboardAvoidingViewEnabled}
      keyboardAvoidingBehavior={keyboardAvoidingBehavior}>
      {_.isFunction(renderBody) && renderBody({ hideBottomSheet })}
    </RBSheet>
  );
};

BottomSheet.options = {
  layout: {
    backgroundColor: Colors.transparent,
  },
};

BottomSheet.propTypes = {
  renderBody: PropTypes.func,
  height: PropTypes.number,
  componentId: PropTypes.string,
  closeOnDragDown: PropTypes.bool,
};

BottomSheet.defaultProps = {
  renderBody: null,
  height: 260,
  componentId: null,
  closeOnDragDown: true,
};

export default BottomSheet;
