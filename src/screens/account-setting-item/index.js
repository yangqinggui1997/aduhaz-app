import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { mt } from '../../commons/styles';

import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'; //Entypo
import IconEntypo from 'react-native-vector-icons/Entypo'; //Entypo
import AntDesign from 'react-native-vector-icons/AntDesign'; //FontAwesome5
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; //FontAwesome5
//Entypo
//AntDesign
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import images from '../../assets/images';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import ImageView from '../../components/image-view';
import {
  showMenuNotification,
  KeyboardView,
  Layout,
  LoadingView,
} from '../../components';
import Screens from '../screens';
import storage from '../../storage';
import apiServices from '../../services';
import {
  RESPONSE_STATUS,
  RESPONSE_ERROR_CODE,
  GOOGLE_WEB_CLIENT_ID,
} from '../../commons/constants';
import DatePicker from 'react-native-date-picker';
import FastImage from 'react-native-fast-image';

import { useDispatch, useSelector } from 'react-redux';
import * as appActions from '../../redux/store/reducers/app/action';
import User from '../../models/user';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import _ from 'lodash';
import { wp } from '../../commons/responsive';
import { getUserProfile, login, Constants } from 'react-native-zalo-kit';

const AccountSetting = ({
  componentId,
  title = null,
  value = '',
  inputField = '',
  field = null,
  onUpdateSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const [newValue, setNewValue] = useState(value);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [renewPassword, setRenewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = React.useState('');
  // SEX
  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const [generItems, setGenerItems] = useState([
    { label: t('male'), value: 1 },
    { label: t('female'), value: 2 },
  ]);

  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.getProfile();
      console.log('getProfile', data);
      if (data.status == RESPONSE_STATUS.OK && data.user_info) {
        let userInfo = data.user_info;
        return dispatch(appActions.updateUserInfo(userInfo));
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    } finally {
      setIsLoading(false);
    }
  };
  const { user } = useSelector(state => state.app);

  console.log('user in app', user);
  const _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      offlineAccess: false,
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  };
  useEffect(() => {
    getProfile();

    _configureGoogleSignIn();
  }, []);
  const onPressZaloLink = useCallback(async () => {
    console.log('onPressZaloLink');
    try {
      const oauthCode = await login();
      console.log(oauthCode);
      // const userProfile = await getUserProfile();
      // console.log(userProfile);

      /*
        returns: {
          id: 'user_id_1',
          name: 'user name',
          phoneNumber: 'phone number',
          gender: 'male',
          birthday: '01/01/2020',
          picture: {
            data: {
              url: 'http://image.example',
            },
          }
        }
      */
    } catch (error) {
      console.log(error);
    }
  }, []);
  const onPressFacebookLink = useCallback(async () => {
    // do logout first
    LoginManager.logOut();
    // call login
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      return;
    }
    const data = await AccessToken.getCurrentAccessToken();
    console.log('dat-token-fb', data);
    if (!data) {
      Alert.alert(t('something_went_wrong'));
      return;
    }
    try {
      const { accessToken } = data;
      const infoRequest = new GraphRequest(
        '/me',
        {
          accessToken,
          parameters: {
            fields: {
              string: 'email,name,first_name,last_name,picture',
            },
          },
        },
        async (err, res) => {
          console.log('onFacebookButtonPress -> res', res);
          if (err) {
            Alert.alert(t('error'), t('failed'));
          } else {
            const { id, email } = res;
            console.log('log in with facebook-res', res);
            const addSocialLinkRes = await apiServices.addSocialLink({
              id_social_account: id,
              email,
              type_social_account: 1,
            });
            console.log('data - link gg account', addSocialLinkRes);
            if (addSocialLinkRes.data?.status === RESPONSE_STATUS.OK) {
              Alert.alert(t('updated'));
              Navigation.dismissAllModals();
            } else {
              Alert.alert(t('error'), t('cannotLinkSocialAccount'));
            }
          }
        },
      );
      // request user info
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (err) {
      console.log('onFacebookButtonPress -> err', err);
      Alert.alert(t('error'), t('cannotLinkSocialAccount'));
    }
  }, [dispatch]);

  const onPressUnlink = useCallback(async (type = 1) => {
    try {
      const { data } = await apiServices.removeSocialLink({
        type_social_account: type,
      });
      console.log('data - unlink gg account', data);
      if (data?.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('updated'));
        Navigation.dismissAllModals();
      }
    } catch (err) {
      console.log('error - unlink google', err);
    }
  }, []);
  const onPressUnlinkGG = async () => {
    return onPressUnlink(2);
  };
  const onPressUnlinkFB = async () => {
    return onPressUnlink(1);
  };
  const onPressUnlinkTwitter = async () => {
    return onPressUnlink(3);
  };
  const onPressUnlinkZalo = async () => {
    return onPressUnlink(3);
  };
  const turnOnVerifications = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.turnOnVerifications();
      console.log('turnOnVerifications', data);
      if (data?.status == RESPONSE_STATUS.OK) {
        console.log('ok');
        Alert.alert(t('updated'));
      }
      return getProfile();
    } catch (error) {
      console.log('turnOffVerifications', error);
    } finally {
      setIsLoading(false);
    }
  };
  const turnOffVerifications = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.turnOffVerifications();
      console.log('turnOffVerifications', data);
      if (data?.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('updated'));
      }
      return getProfile();
    } catch (error) {
      console.log('turnOffVerifications', error);
    } finally {
      setIsLoading(false);
    }
  };
  const onPressVerify = async () => {
    if (!user.verifications?.length) {
      Alert.alert(t('turnOnVerifyTwoSteps'), null, [
        {
          title: t('ok'),
          onPress: () => turnOnVerifications(),
        },
      ]);
      return;
    }
    Alert.alert(t('turnOffVerifyTwoSteps'), null, [
      {
        title: t('ok'),
        onPress: () => turnOffVerifications(),
      },
    ]);
  };
  const onPressGoogleLink = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // do sign out first
      await GoogleSignin.signOut();
      // call sign in
      const res = await GoogleSignin.signIn();
      console.log(res);

      const {
        idToken,
        user: { email, familyName, givenName, name, photo, id },
      } = res;
      const { data } = await apiServices.addSocialLink({
        id_social_account: id,
        email,
        type_social_account: 2,
      });
      console.log('data - link gg account', data);
      if (data?.status === RESPONSE_STATUS.OK) {
        Alert.alert(t('updated'));
        Navigation.dismissAllModals();
      } else {
        Alert.alert(t('error'), t('cannotLinkSocialAccount'));
      }
    } catch (err) {
      console.log('sign in with google error: ', err);
      switch (err.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          console.log('User has cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          console.log('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          console.log('play_service not available');
          break;
        default:
          Alert.alert(t('error'), t('cannotLinkSocialAccount'));
      }
    }
  }, [dispatch]);

  const onPressBack = () => {
    navigation.pop();
  };
  const onPressForgotPassword = useCallback(() => {
    navigation.push(Screens.ForgotPassword);
  }, []);

  let onPressSave = useCallback(async () => {
    try {
      const { data } = await apiServices.updateProfile(inputField, newValue);
      console.log('updateProfile', data);
      if (data && data.status == RESPONSE_STATUS.OK) {
        if (_.isFunction(onUpdateSuccess)) {
          onUpdateSuccess();
        }
        Alert.alert(t('updated'));
        navigation.pop();
      }
      if (
        data?.status == RESPONSE_STATUS.ERROR &&
        data?.code == RESPONSE_ERROR_CODE.EMAIL_EXIST_UPDATE
      ) {
        setError(t('email_exist'));
      }
    } catch (err) {
      console.log('error save data', err);
    }
  }, [newValue]);
  let disabledSave = !newValue || newValue == value;

  let saveButton = (
    <TouchableOpacity
      style={style.save}
      onPress={onPressSave}
      disabled={disabledSave}>
      <IconEntypo
        style={disabledSave ? style.disableButton : style.saveButton}
        name="check"
        size={20}
        color={colors.black}
      />
    </TouchableOpacity>
  );

  let inputUpdate = <Text style={style.loadingText}> {t('loading')}</Text>;

  switch (field) {
    case 'sodienthoai':
      inputUpdate = (
        <View style={style.inputData}>
          <TextInput
            editable
            keyboardType="numeric"
            placeholder={t(title)}
            onChangeText={setNewValue}
            value={newValue}
          />
        </View>
      );
      break;
    case 'hoten':
    case 'email':
      inputUpdate = (
        <View>
          <View style={style.inputData}>
            <TextInput
              editable
              placeholder={t(title)}
              onChangeText={text => {
                error && setError('');
                setNewValue(text);
              }}
              value={newValue}
            />
          </View>
          {error ? <Text style={[mt(10), style.error]}>* {error}</Text> : null}
        </View>
      );
      break;
    case 'linkAccount':
      saveButton = null;

      const dateRender = [
        {
          icon: (
            <MaterialIcons name="facebook" color={colors.blueFB} size={30} />
          ),
          des: t('link_by_facebook'),
          onPressUnlink: onPressUnlinkFB,
          isLinked: user && user.id_facebook && user.id_facebook != '0',
          onPress: onPressFacebookLink,
        },
        {
          icon: (
            <Ionicons name="logo-google" color={colors.redGoogle} size={30} />
          ),
          des: t('link_by_google'),
          isLinked: user && user.id_google && user.id_google != '0',
          onPress: onPressGoogleLink,
          onPressUnlink: onPressUnlinkGG,
        },
        // {
        //   icon: (
        //     <IconEntypo
        //       name="twitter-with-circle"
        //       color={colors.primary}
        //       size={30}
        //     />
        //   ),
        //   isLinked: user?.id_twitter && user?.id_twitter != '0',
        //   onPressUnlink: onPressUnlinkTwitter,
        //   des: t('link_by_twitter'),
        // },
        // {
        //   icon: (
        //     <ImageView
        //       style={style.icon}
        //       source={images.icon_zalo}
        //       resizeMode={ImageView.resizeMode.cover}
        //     />
        //   ),
        //   isLinked: user?.id_zalo && user?.id_zalo != '0',
        //   onPressUnlink: onPressUnlinkZalo,
        //   des: t('link_by_zalo'),
        //   onPress: onPressZaloLink,
        // },
      ]; //IconEntypo
      const renderItem = (index, item) => {
        return (
          <View style={style.containerLink}>
            <View style={style.itemLinkAccount}>
              {item.icon}
              <Text style={style.linkItemText}>{item.des}</Text>
              <TouchableOpacity
                disabled={!item.onPress}
                onPress={item.isLinked ? item.onPressUnlink : item.onPress}
                style={style.linkItemButton}>
                <Text style={style.linkItemButtonTxt}>
                  {item.isLinked ? t('unlink') : t('link')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      };
      inputUpdate = (
        <FlatList
          data={dateRender}
          renderItem={({ item, index }) => renderItem(index, item)}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
          keyExtractor={(_, index) => 'key' + index.toString()}
          bounces={false}
        />
      );
      break;
    case 'accountSecurity':
      saveButton = null;
      inputUpdate = (
        <View>
          <View style={[style.itemContent, style.borderBottom]}>
            <TouchableOpacity
              onPress={() => navigation.push(Screens.ManagerDevices)}>
              <Text style={style.titleItem}> {t('manage_devices')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[style.itemContent, style.borderBottom]}>
            <TouchableOpacity onPress={onPressVerify}>
              <Text style={style.titleItem}> {t('verify_two_steps')}</Text>
            </TouchableOpacity>
            <View style={style.detailItem}>
              <Text style={style.valueItem}>
                {user.verifications?.length ? t('enabled') : t('disabled')}
              </Text>
            </View>
          </View>
        </View>
      );
      break;
    case 'changePassword':
      saveButton = null;
      const [isPassOldPassword, setIsPassOldPassword] = useState(false);
      const [textError, setTextError] = useState('');

      const errDiv = textError ? (
        <View style={[style.textButtonDes, style.marginTop]}>
          <Text style={style.errText}>{textError}</Text>
        </View>
      ) : null;
      const checkOldPassWord = useCallback(async () => {
        try {
          setIsLoading(true);
          const { data } = await apiServices.checkPassword(oldPassword);
          setIsLoading(false);

          console.log(data);
          return data && data.check_status;
        } catch (err) {
          console.log('Check old password error - ' + err);
        }
      }, [oldPassword]);
      const changePassword = useCallback(async () => {
        try {
          setIsLoading(true);
          const { data } = await apiServices.changePassword(newPassword);
          setIsLoading(false);

          console.log(data);
          return data;
        } catch (err) {
          console.log('Check old password error - ' + err);
        }
      }, [newPassword]);
      let inputPassword = (
        <View>
          <Text style={style.descriptionText}>
            {t('description_enter_old_password')}
          </Text>
          <View style={[style.inputDataPassword, style.marginTop]}>
            <TextInput
              editable
              secureTextEntry={true}
              placeholder={t('old_password')}
              onChangeText={setOldPassword}
              value={oldPassword}
            />
          </View>
          <View style={[style.textButtonDes, style.marginTop]}>
            <TouchableOpacity onPress={onPressForgotPassword}>
              <Text style={style.colorRed}>{t('forgot_password') + '?'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
      if (isPassOldPassword) {
        inputPassword = (
          <View>
            <View style={style.inputDataPassword}>
              <TextInput
                editable
                secureTextEntry={true}
                placeholder={t('new_password')}
                onChangeText={setNewPassword}
                value={newPassword}
              />
            </View>
            <View style={[style.inputDataPassword, style.marginTop]}>
              <TextInput
                editable
                secureTextEntry={true}
                placeholder={t('retype_password')}
                onChangeText={setRenewPassword}
                value={renewPassword}
              />
            </View>
          </View>
        );
      }
      const onPressNext = async () => {
        if (isPassOldPassword) {
          await changePassword();
          Alert.alert(t('changed_password'));
          Navigation.dismissAllModals();
          return;
        }
        const checkPwd = await checkOldPassWord();
        if (checkPwd) {
          setTextError('');
          return setIsPassOldPassword(true);
        }
        setTextError(t('wrong_password'));
      };
      inputUpdate = (
        <View>
          {inputPassword}

          <View style={[style.sendButtonView, style.marginTop]}>
            <TouchableOpacity
              disabled={isLoading || newPassword != renewPassword}
              style={style.nextButton}
              onPress={onPressNext}>
              <Text style={style.forgotPasswordButtonText}>
                {isLoading ? t('loading') : t('next')}
              </Text>
            </TouchableOpacity>
          </View>
          {errDiv}
        </View>
      );
      break;
    case 'gioitinh':
      inputUpdate = (
        <View style={style.viewPicker}>
          <DropDownPicker
            style={style.dropDownPicker}
            open={openGenderPicker}
            value={newValue}
            items={generItems}
            setOpen={setOpenGenderPicker}
            setValue={setNewValue}
            setItems={setGenerItems}
            dropDownDirection={'BOTTOM'}
            placeholderStyle={{ color: colors.flatGrey }}
            placeholder={t('selectGender')}
            textStyle={{ marginHorizontal: wp(7) }}
          />
        </View>
      );
      break;
  }
  return (
    <Layout
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={[style.header, style.borderBottom]}>
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={colors.flatBlack02}
          />
        </TouchableOpacity>
        <Text style={style.titleHeader}> {title}</Text>
        {saveButton}
      </View>
      {isLoading && <LoadingView loading={isLoading} fullscreen />}
      <KeyboardView>
        <ScrollView style={style.content} showsVerticalScrollIndicator={false}>
          {inputUpdate}
        </ScrollView>
      </KeyboardView>
    </Layout>
  );
};
//exit-outline
export default AccountSetting;
