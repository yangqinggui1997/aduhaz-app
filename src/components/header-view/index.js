import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import images from '../../assets/images';
import styles from './style';
import colors from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { flexRow, ml } from '../../commons/styles';
import ImageView from '../image-view';
import _ from 'lodash';

const HeaderView = ({
  rightItems = [],
  showLogo = false,
  spinningLogo = false,
  title = '',
  navigation,
  onBack,
  ...props
}) => {
  const onBackPressed = () => {
    if (onBack && _.isFunction(onBack)) {
      onBack();
    } else if (navigation) {
      navigation.pop();
    }
  };

  const getFormatNotifyNumber = notifyNumber => {
    let num = notifyNumber;
    if (notifyNumber > 99) {
      num = '99+';
    }
    return num;
  };

  const renderLogo = () => {
    if (spinningLogo) {
      return (
        <ImageView
          style={styles.spinningLogo}
          source={images.spinning_logo}
          resizeMode={ImageView.resizeMode.contain}
        />
      );
    }
    return (
      <ImageView
        style={styles.logo}
        source={images.appIcon}
        resizeMode={ImageView.resizeMode.contain}
      />
    );
  };

  return (
    <View style={[styles.navBar, props.style]}>
      <View style={styles.menuBar}>
        <View style={styles.leftItems}>
          {navigation && (
            <TouchableOpacity onPress={() => onBackPressed()}>
              <Ionicons
                name={'arrow-back-outline'}
                size={30}
                color={colors.black}
              />
            </TouchableOpacity>
          )}
          {showLogo && renderLogo()}
        </View>
        <View style={[styles.rightItems, flexRow]}>
          {rightItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={index === 0 ? {} : ml(12)}
              onPress={item.onPress}>
              <View style={styles.rightItem}>
                <Ionicons name={item.ionIcon} size={30} color={colors.black} />
                {item.notifyNumber ? (
                  <View style={styles.notifyNumber}>
                    <Text style={styles.notifyNumberText}>
                      {getFormatNotifyNumber(item.notifyNumber)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HeaderView;
