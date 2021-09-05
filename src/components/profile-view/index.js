import React, { useState, useCallback } from 'react';
import { Text, TouchableOpacity, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import style from './style';
import images from '../../assets/images';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import Screens from '../../screens/screens';
import * as appActions from '../../redux/store/reducers/app/action';
import { useSelector, useDispatch } from 'react-redux';
import User from '../../models/user';
import { openPicker } from '../../commons/image-picker-helper';
import { useNavigation } from '../../hooks';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Utils from '../../commons/utils';

const ProfileView = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const { user } = useSelector(state => state.app);
  const [coverPhoto, setCoverPhoto] = useState({});
  const [loading, setLoading] = useState(false);

  const onPressPhoto = useCallback(() => {
    console.log('###onPressPhoto');
    // Galleries
    openPicker()
      .then(async image => {
        console.log('###image data', image);
        if (Utils.isAndroid()) {
          image.path = image.path.startsWith('file://')
            ? image.path
            : `file://${image.path}`;
        }
        setCoverPhoto({ ...image });
      })
      .catch(error => {
        console.log(`###Image picker error: ${error}`);
      });
  }, []);
  const getProfile = async () => {
    try {
      // setIsLoading(true);
      const { data } = await apiServices.getProfile();
      // setIsLoading(false);
      console.log(data);
      if (data.status == RESPONSE_STATUS.OK && data.user_info) {
        let userInfo = data.user_info;
        let user = User.clone(userInfo);
        return dispatch(appActions.updateUserInfo(user));
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  };

  const updateCoverPhoto = useCallback(async () => {
    setLoading(true);
    const { data } = await apiServices.updateCoverPhoto(coverPhoto, user.id);
    setLoading(false);
    console.log('updateCoverPhoto - data', data);
    if (data && data.status == RESPONSE_STATUS.OK) {
      Alert.alert(t('updated'));
      setCoverPhoto({});
      return getProfile();
    }
  }, [coverPhoto, user]);
  const uriCoverPhoto =
    coverPhoto.path || (user && user.cover_photo ? user.cover_photo : null);
  return (
    <View>
      <View style={[style.flexRow]}>
        <FastImage
          style={style.banner}
          source={
            uriCoverPhoto
              ? {
                  uri: uriCoverPhoto,
                  priority: FastImage.priority.normal,
                }
              : images.banner_default
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        {!coverPhoto.path ? (
          <TouchableOpacity
            style={style.coverPhoto}
            disabled={loading}
            onPress={onPressPhoto}>
            <MaterialIcons name="photo-camera" style={style.coverPhotoIcon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={style.coverPhoto} onPress={updateCoverPhoto}>
            <Text style={style.coverPhotoText}>{t('update')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[style.avatarView, style.borderBottom]}>
        <View>
          <FastImage
            source={{
              uri: (user && user.icon) || images.empty,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={style.avatar}
          />
          <Text style={style.name}>{user?.hoten}</Text>
        </View>
        <View style={style.analystics}>
          <View style={[style.editProfile]}>
            <TouchableOpacity
              style={style.editProfileButton}
              onPress={() => navigation.push(Screens.ProfileEdit)}>
              <Text style={style.profileEdiText}>
                <FontAwesome5 name="user-edit" style={style.profileEdiButton} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ProfileView;
