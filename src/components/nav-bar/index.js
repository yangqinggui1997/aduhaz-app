import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import ImageView from '../image-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from '../../commons/utils';
import colors from '../../theme/colors';
import images from '../../assets/images';
import style from './style';
import { styles } from '../post-menu/style';
import { useNavigation } from '../../hooks';

const NavBar = memo(
  ({
    title = '',
    styleTitle = {},
    onLeftPress = null,
    showCloseButton = false,
    accessoryRight = null,
    parentComponentId = '',
    showLeftIcon = true,
    ...props
  }) => {
    const navigation = useNavigation(parentComponentId);

    const renderIcon = () => {
      if (showCloseButton) {
        return (
          <Ionicons
            name={'close-outline'}
            size={30}
            color={props.iconColor ? props.iconColor : colors.black}
          />
        );
      }

      return (
        <Ionicons
          name={'arrow-back-outline'}
          size={30}
          color={props.iconColor ? props.iconColor : colors.black}
        />
      );
    };

    const renderAccessoryRight = () => {
      if (accessoryRight) {
        if (Utils.isFunction(accessoryRight)) {
          return accessoryRight();
        } else {
          return accessoryRight;
        }
      }
    };

    const onPress = () => {
      if (onLeftPress) {
        return onLeftPress();
      }

      return navigation.pop();
    };

    return (
      <View {...props} style={[style.container, props.style]}>
        <View style={style.titleContainer}>
          <Text
            style={[
              style.screenTitle,
              { color: props.titleColor ?? colors.black },
              styleTitle,
            ]}>
            {title}
          </Text>
        </View>
        {showLeftIcon ? (
          <TouchableOpacity onPress={onPress} style={style.iconContainer}>
            {renderIcon()}
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={style.rightContainer}>
          {renderAccessoryRight()}
        </TouchableOpacity>
      </View>
    );
  },
);

export default NavBar;
