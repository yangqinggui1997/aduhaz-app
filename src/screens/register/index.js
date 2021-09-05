import React, { useCallback, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
//EvilIcons
import { InputGroup, LoadingView } from '../../components';
import { useDispatch } from 'react-redux';
import Screens from '../../screens/screens';
import { useNavigation } from '../../hooks';
import * as appActions from '../../redux/store/reducers/app/action';

import { appleAuth } from '@invertase/react-native-apple-authentication';

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

import { GOOGLE_WEB_CLIENT_ID } from '../../commons/constants';
import { NavBar, KeyboardView, Layout } from '../../components';
import style from './style';
import { Navigation } from 'react-native-navigation';
import images from '../../assets/images';
import apiServices from '../../services';
import { RESPONSE_ERROR_CODE, RESPONSE_STATUS } from '../../commons/constants';
import { mb, mt } from '../../commons/styles';

const Register = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);

  const onLeftPress = useCallback(() => {
    navigation.pop();
  }, []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCheckedTerm, setIsCheckedTerm] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rePassword, setRePassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [error, setError] = React.useState('');

  useEffect(() => {
    _configureGoogleSignIn();
  }, []);

  const _configureGoogleSignIn = () => {
    GoogleSignin.configure({
      offlineAccess: false,
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  };

  const onPressFacebookLogin = useCallback(async () => {
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
    if (!data) {
      Alert.alert(t('error'), t('login_fail'));
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
            Alert.alert(t('error'), t('login_fail'));
          } else {
            const { email, name, first_name, last_name, picture } = res;
            console.log('log in with facebook-res', res);

            let resFb = await apiServices.loginFb({
              token: accessToken,
              email,
              fullname: name,
              avatar: picture.data.url,
            });

            console.log('log in with facebook - resFB', resFb);
            if (resFb.data.status == RESPONSE_STATUS.OK) {
              const userInfo = resFb.data.user_info;
              let dataResponse = {
                ...userInfo,
                token: resFb.data.token,
                refresh_token: resFb.data.refresh_token,
              };
              console.log({ dataResponse });
              dispatch(appActions.signIn(dataResponse));
              Navigation.dismissAllModals();
            } else {
              console.warn('onPressFacebookLogin ~ res', data);
              Alert.alert(t('error'), t('login_fail'));
            }
          }
        },
      );
      // request user info
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (err) {
      console.log('onFacebookButtonPress -> err', err);
    }
  }, [dispatch]);

  const onPressGoogleLogin = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // do sign out first
      await GoogleSignin.signOut();
      // call sign in
      const res = await GoogleSignin.signIn();
      console.log('onPressGoogleLogin ~ res', res);

      const {
        idToken,
        user: { email, familyName, givenName, name, photo },
      } = res;
      const { data } = await apiServices.loginGoogle({
        token: idToken,
        email,
        fullname: name,
        avatar: photo,
      });
      console.log(data);
      if (data.status == RESPONSE_STATUS.OK) {
        const userInfo = data.user_info;
        dispatch(
          appActions.signIn({
            ...userInfo,
            token: data.token,
            refresh_token: data.refresh_token,
          }),
        );
        Navigation.dismissAllModals();
      } else {
        console.warn('onPressGoogleLogin ~ res', data);
        Alert.alert(t('register_failed'));
      }
      // TODO send to server
    } catch (err) {
      switch (err.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          console.log(statusCodes.SIGN_IN_CANCELLED);

          break;
        case statusCodes.IN_PROGRESS:
          console.log(statusCodes.IN_PROGRESS);
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);

          break;
        default:
          Alert.alert(t('register_failed'));
      }
    }
  }, [dispatch]);

  const onPressAppleLogin = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('APPLE: ', appleAuthRequestResponse);

    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      try {
        const { data } = await apiServices.loginApple({
          token: appleAuthRequestResponse.authorizationCode,
          email: appleAuthRequestResponse.email,
          fullname: appleAuthRequestResponse.fullName.familyName
            ? `${appleAuthRequestResponse.fullName.familyName} ${appleAuthRequestResponse.fullName.middleName} ${appleAuthRequestResponse.fullName.givenName}`
            : null,
        });
        console.log(data);
        if (data.status == RESPONSE_STATUS.OK) {
          const userInfo = data.user_info;
          dispatch(
            appActions.signIn({
              ...userInfo,
              token: data.token,
              refresh_token: data.refresh_token,
            }),
          );
          Navigation.dismissAllModals();
        } else {
          console.warn('onPressAppleLogin ~ res', data);
          Alert.alert(t('error'), t('login_fail'));
        }
      } catch (err) {
        console.log('sign in with google error: ', err);
        Alert.alert(t('error'), t('login_fail'));
      }
    }
  };

  const onPressRegister = useCallback(async () => {
    setIsLoading(true);
    const { data } = await apiServices.register({
      email,
      password,
      fullname: fullName,
      phone: phoneNumber,
      address,
    });
    setIsLoading(false);

    console.log('data - register', data);
    if (data.status == RESPONSE_STATUS.OK) {
      navigation.push(Screens.Login);
    } else if (data.status == RESPONSE_STATUS.ERROR) {
      switch (data.code) {
        case RESPONSE_ERROR_CODE.EMAIL_EXIST:
          // Alert.alert();
          setError(t('email_exist'));
          // Alert.alert(t('register_failed'));
          break;
        case RESPONSE_ERROR_CODE.VALIDATE_FAIL:
          // Alert.alert(t('validate_fail'));
          Alert.alert(t('register_failed'));
          break;
        default:
          Alert.alert(t('register_failed'));
          break;
      }
    } else {
      Alert.alert(t('register_failed'));
    }
  }, [dispatch, email, password, fullName, phoneNumber, address]);
  const showTermsOfService = () => {
    navigation.push(Screens.PageWebview, {
      url: 'https://aduhaz.com/dieu-khoan-dich-vu/',
      title: t('termsOfService'),
      componentId,
      onClosePress: componentId => {
        const nav = useNavigation(componentId);
        nav.pop();
      },
    });
  };

  const isDisable =
    isLoading ||
    !email ||
    !password ||
    !rePassword ||
    !fullName ||
    !phoneNumber ||
    !(password == rePassword) ||
    !isCheckedTerm;
  return (
    <Layout style={style.container}>
      <NavBar
        title={t('register')}
        onLeftPress={onLeftPress}
        styleTitle={style.title}
      />
      {/* <View style={[style.navBar, style.borderBottom]}>
        <Ionicons
          onPress={onLeftPress}
          name="arrow-back-outline"
          style={style.iconNav}
        />
        <View>
          <Text style={style.title}>{t('register')}</Text>
        </View>
      </View> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardView>
          <InputGroup
            placeholder={t('email') + '(*)'}
            value={email}
            onChangeText={value => {
              error && setError('');
              setEmail(value);
            }}
            accessoryLeft={<Ionicons name="mail" style={style.iconInput} />}
          />
          <InputGroup
            placeholder={t('password') + '(*)'}
            value={password}
            onChangeText={value => setPassword(value)}
            secureTextEntry={true}
            accessoryLeft={
              <EvilIcons name="lock" style={style.iconEvilIconsInput} />
            }
          />
          <InputGroup
            placeholder={t('re_password') + '(*)'}
            value={rePassword}
            onChangeText={value => setRePassword(value)}
            secureTextEntry={true}
            accessoryLeft={
              <EvilIcons name="lock" style={style.iconEvilIconsInput} />
            }
          />
          <InputGroup
            placeholder={t('full_name') + '(*)'}
            value={fullName}
            onChangeText={value => setFullName(value)}
            accessoryLeft={<Ionicons name="people" style={style.iconInput} />}
          />
          <InputGroup
            placeholder={t('phone_number') + '(*)'}
            value={phoneNumber}
            onChangeText={value => setPhoneNumber(value)}
            accessoryLeft={
              <Icon name="mobile-phone" style={style.iconEvilIconsInput} />
            }
          />
          <InputGroup
            placeholder={t('address') + '(*)'}
            value={address}
            onChangeText={value => setAddress(value)}
            accessoryLeft={
              <Icon name="address-card-o" style={style.iconFontAwesomeInput} />
            }
          />
          <View style={[style.marginTop, style.registerTerm]}>
            <Text
              style={
                !isCheckedTerm
                  ? style.registerTermMark
                  : style.registerTermMarkChecked
              }
              onPress={() => setIsCheckedTerm(!isCheckedTerm)}>
              ✓
            </Text>
            <View style={style.registerTermDes}>
              <Text style={style.registerTermText}>
                {t('agree_to_our_terms')}
                <Text
                  style={style.registerTermTextLink}
                  onPress={showTermsOfService}>
                  {t('agree_to_our_terms2')}
                </Text>
                {t('agree_to_our_terms3')}
              </Text>
            </View>
          </View>

          <View style={[style.registerButtonView]}>
            <TouchableOpacity
              disabled={isDisable}
              style={
                isDisable ? style.disabledRegisterButton : style.registerButton
              }
              onPress={onPressRegister}>
              <Text style={style.registerButtonText}>{t('register')}</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={[style.textError, mb(15)]}>* {error}</Text>
          ) : null}

          <View style={style.divider}>
            <View style={style.titleDividerView}>
              <Text style={style.titleDivider}>{t('or_use')}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[style.registerButton, style.fbBackgroud, style.marginTop]}
            onPress={onPressFacebookLogin}>
            <Icon name={images.vicon_facebook} size={15} color="#fff" />
            <Text style={style.textRegisterBy}>
              {t('register_by_facebook')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.registerButton, style.ggBackgroud, style.marginTop]}
            onPress={onPressGoogleLogin}>
            <Icon name={images.icon_google} size={15} color="#fff" />
            <Text style={style.textRegisterBy}>{t('register_by_google')}</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[
                style.registerButton,
                style.appleBackground,
                style.marginTop,
              ]}
              onPress={onPressAppleLogin}>
              <Icon name={images.icon_apple} size={15} color="#fff" />
              <Text style={style.textRegisterBy}>{t('register_by_apple')}</Text>
            </TouchableOpacity>
          )}
        </KeyboardView>
      </ScrollView>
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </Layout>
  );
};

export default Register;
