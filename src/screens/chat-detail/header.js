import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { wp } from '../../commons/responsive';
import style from '../../components/layout/style';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';

function Header({
  parentComponentId,
  user,
  onMenuPress,
  onLineStatus,
  isModal = false,
}) {
  const navigation = useNavigation(parentComponentId);
  const { t } = useTranslation();

  const handleBack = () => {
    if (isModal) {
      Navigation.dismissModal(parentComponentId);
    } else {
      navigation.pop();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack}>
        <Ionicons name={'arrow-back-outline'} size={30} color={colors.black} />
      </TouchableOpacity>

      <View style={styles.user}>
        <FastImage
          style={styles.avatar}
          source={{
            uri: user?.icon,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View>
          <Text style={style.username}>{user?.name || user?.hoten}</Text>
          <View style={styles.statusBox}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{onLineStatus || ''}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name={'ellipsis-vertical'} size={24} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp(4),
    paddingHorizontal: wp(8),
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomWidth: 1 / 2,
    borderBottomColor: colors.flatGrey12,
  },
  user: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: wp(30),
    height: wp(30),
    marginRight: wp(5),
  },
  username: {
    fontSize: wp(14),
  },
  statusText: {
    fontSize: wp(10),
  },
  statusDot: {
    width: wp(6),
    height: wp(6),
    backgroundColor: colors.green,
    borderRadius: wp(3),
    marginRight: wp(3),
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
