import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Navigation } from 'react-native-navigation';
import _ from 'lodash';

import { styles } from './style';
import Screens from '../../screens/screens';
import { useTranslation } from 'react-i18next';

FAIcon.loadFont();
const maxHeight = Dimensions.get('screen').height * 0.7;

export default function showMenuPostSelection({
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
  data = null,
  componentId,
}) {
  const popupHeight = data.length * 54 > maxHeight ? maxHeight : data.length * 54
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <PostMenu
            data={data}
            componentId={componentId}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
            height={popupHeight}
          />
        ),
        height: popupHeight,
      },
    },
  });
}

const PostMenu = ({ data, onClose, height , onSelectedItem }) => {
  const { t } = useTranslation();

  const onSelectOption = item => {
    if (_.isFunction(onSelectedItem)) {
      onSelectedItem(item);
    }
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  return (
    <ScrollView scrollEnabled={height === maxHeight} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={styles.gridContainer}>
        {data.map((grid, index) => {
          console.log('🚀 ~ file: index.js ~ line 66 ~ {data.map ~ grid', grid);
          return (
            <TouchableOpacity
              key={grid.icon}
              onPress={() => onSelectOption(grid)}
              style={[
                styles.gridButtonContainer,
                index < data.length - 1 ? styles.borderBottom : {},
              ]}
              disabled={grid.disabled}>
              <View style={[styles.gridButton]}>
                <Image source={grid.icon} style={styles.gridIcon} />
              </View>
              <View style={styles.gridTitleContainer}>
                <Text style={styles.gridTitle}>{t(grid.label)}</Text>
                {grid.desc && grid.desc != '' && (
                  <Text style={styles.gridDesc}>{t(grid.desc)}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
