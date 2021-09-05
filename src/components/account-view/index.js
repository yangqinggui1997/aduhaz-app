import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import styles from './style';
import colors from '../../theme/colors';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import storage from '../../storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountView = ({ componentId, ...props }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const onPressProfileEdit = () => {
    navigation.push(Screens.ProfileEdit);
  };

  return (
    <View style={[props.style, styles.accountView]}>
      <View style={styles.coverImgContainer}>
        <FastImage
          style={styles.coverImg}
          source={{
            uri: '',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      <View style={styles.avatarView}>
        <View>
          <FastImage
            style={styles.accountAvatar}
            source={{
              uri: storage.user && storage.user.icon ? storage.user.icon : '',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.accountName}>{storage.user.hoten}</Text>
        </View>
        <TouchableOpacity
          style={styles.editAccountBtn}
          onPress={onPressProfileEdit}>
          <Icon name={images.ionicons_edit} size={15} color={colors.flatGrey} />
          <Text style={styles.editAccount}>{t('editAccount')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

AccountView.propTypes = {};

export default AccountView;
