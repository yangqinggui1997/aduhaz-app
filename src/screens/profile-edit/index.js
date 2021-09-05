import React, { useCallback, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import DropDownPicker from 'react-native-dropdown-picker';

import { openPicker } from '../../commons/image-picker-helper';

import { Layout, NavBar, LoadingView, InputGroup } from '../../components';
import apiServices from '../../services';
import { RESPONSE_ERROR_CODE, RESPONSE_STATUS } from '../../commons/constants';
import Utils from '../../commons/utils';
import FastImage from 'react-native-fast-image';
import Images from '../../assets/images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import { useDispatch } from 'react-redux';
import { wp } from '../../commons/responsive';
import style from './style';
import storage from '../../storage';
import * as appActions from '../../redux/store/reducers/app/action';
import User from '../../models/user';
import { mt, mb } from '../../commons/styles';

const ProfileEdit = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);

  const [avatar, setAvatar] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [error, setError] = React.useState('');
  // const [idNumber, setIdNumber] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onPressPhoto = useCallback(() => {
    // Galleries
    openPicker()
      .then(async image => {
        console.log('###image data', image);
        if (Utils.isAndroid()) {
          image.path = image.path.startsWith('file://')
            ? image.path
            : `file://${image.path}`;
        }
        setAvatar(image);
      })
      .catch(error => {
        console.log(`###Image picker error: ${error}`);
      });
  }, []);

  const updateProfile = useCallback(async () => {
    let newProfile = {
      email: email,
      full_name: fullName,
      phone_number: phoneNumber,
      address: address,
      sex: gender,
      id_user: storage.user.id,
      // identity_card: idNumber,
    };
    if (avatar && avatar.path) {
      newProfile.avatarFile = avatar;
    }
    try {
      setIsLoading(true);
      const { data } = await apiServices.updateProfileByForm(newProfile);
      console.log('updateProfileByForm: ', data);

      if (data && data.status === RESPONSE_STATUS.OK) {
        const response = await apiServices.getProfile();
        let user = newProfile;
        if (
          response.data.status === RESPONSE_STATUS.OK &&
          response.data.user_info
        ) {
          user = { ...response.data.user_info };
        }
        console.log('new profile: ', user);
        dispatch(appActions.updateUserInfo(User.clone(user)));
        Alert.alert(t('updated'));
        navigation.pop();
        return;
      }
      if (
        data?.status == RESPONSE_STATUS.ERROR &&
        data?.code == RESPONSE_ERROR_CODE.EMAIL_EXIST_UPDATE
      ) {
        setError(t('email_exist'));
      }
    } catch (error) {
      console.log('updateProfileByForm - error: ', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [email, fullName, phoneNumber, address, gender, avatar]);

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.getProfile();
      setIsLoading(false);
      console.log(data);
      if (data.status == RESPONSE_STATUS.OK && data.user_info) {
        let user = { ...data.user_info };
        console.log('###user_info: ', user);
        setEmail(user.email);
        setFullName(user.hoten);
        setPhoneNumber(user.sodienthoai);
        setAddress(user.diachi);
        setGender(user.gioitinh);
        // setIdNumber(user.cmnd);
        setAvatar({ icon: user.icon });
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  // console.log(avatar);
  // console.log(avatar.path);
  const defaultImage =
    'http://beepeers.com/assets/images/commerces/default-image.jpg';
  const uri = avatar.path || avatar.icon;
  const avatarView = !uri ? (
    <View style={[style.avatarView, style.marginTop]}>
      {/* 
    <Text style={style.photoDes}>{t('no_file_chosen')}</Text> */}
      <FastImage
        style={style.postImage}
        source={{
          uri: defaultImage,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity
        onPress={onPressPhoto}
        style={style.chooseFileButtonView}>
        <Text style={style.chooseFileButton}>{t('choose_file')}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={[style.avatarView, style.marginTop]}>
      <FastImage
        style={style.postImage}
        source={{
          uri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity style={style.clearIcon} onPress={() => setAvatar({})}>
        <AntDesign name={Images.ant_icon_close_circle} size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  const [openGenderPicker, setOpenGenderPicker] = React.useState(false);
  const [generItems, setGenerItems] = React.useState([
    { label: t('male'), value: 1 },
    { label: t('female'), value: 2 },
  ]);

  // <ImageView source={avatar.path} style={style.avatarUpload} />;
  const isDisabledButton = !email || !fullName || !phoneNumber;
  return (
    <Layout>
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
      <NavBar
        parentComponentId={componentId}
        showCloseButton
        title={t('personal_infomation')}
      />
      <ScrollView style={style.container} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'column',
            height: Utils.getScreenHeight(),
          }}>
          <View style={{}}>
            <Text style={style.textName}>{t('member_photos') + '(*)'}</Text>
          </View>
          {avatarView}
          <View style={{}}>
            <Text style={style.textName}>{t('email') + '(*)'}</Text>
          </View>
          <InputGroup
            placeholder={t('email') + '(*)'}
            onChangeText={email => {
              error && setError('');
              setEmail(email);
            }}
            value={email}
          />

          <View style={style.marginTop}>
            <Text style={style.textName}>{t('full_name') + '(*)'}</Text>
          </View>
          <InputGroup
            placeholder={t('full_name') + '(*)'}
            onChangeText={fullName => setFullName(fullName)}
            value={fullName}
          />

          <View style={style.marginTop}>
            <Text style={style.textName}>{t('phone_number') + '(*)'}</Text>
          </View>
          <InputGroup
            placeholder={t('phone_number') + '(*)'}
            onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
            value={phoneNumber}
          />

          <View style={style.marginTop}>
            <Text style={style.textName}>{t('address') + '(*)'}</Text>
          </View>
          <InputGroup
            placeholder={t('address') + '(*)'}
            onChangeText={address => setAddress(address)}
            value={address}
          />

          <View style={style.marginTop}>
            <Text style={style.textName}>{t('gender') + '(*)'}</Text>
          </View>

          <DropDownPicker
            style={style.dropDown}
            open={openGenderPicker}
            value={gender}
            items={generItems}
            setOpen={setOpenGenderPicker}
            setValue={setGender}
            setItems={setGenerItems}
            dropDownDirection={'BOTTOM'}
            placeholderStyle={{ color: colors.flatGrey }}
            placeholder={t('selectGender')}
            textStyle={{ marginHorizontal: wp(7) }}
          />
        </View>
      </ScrollView>

      <View style={[style.profileEditButtonView, style.marginTop]}>
        <TouchableOpacity
          disabled={isDisabledButton}
          style={
            isDisabledButton ? style.disabledButton : style.profileEditButton
          }
          onPress={updateProfile}>
          <Text style={style.profileEdiText}>{t('update')}</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={[mt(10), mb(10), style.error]}>* {error}</Text>
      ) : null}
    </Layout>
  );
};

export default ProfileEdit;
