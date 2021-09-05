import React, { useCallback, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { LoadingView, InputGroup } from '../../components';
import { AppleButton } from '@invertase/react-native-apple-authentication';

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
import Icon from 'react-native-vector-icons/FontAwesome';
import apiServices from '../../services';

import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import style from './style';
import Screens from '../../screens/screens';
import images from '../../assets/images';
import Utils from '../../commons/utils';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';
import * as appActions from '../../redux/store/reducers/app/action';
import { GOOGLE_WEB_CLIENT_ID } from '../../commons/constants';
import storage from '../../storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import _ from 'lodash';
import { mr } from '../../commons/styles';

const Login = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    _configureGoogleSignIn();
  }, []);

  const onFinishedLogin = async user => {
    Navigation.dismissModal(componentId);
    const data = storage.recentLoggedInUsers;
    data[user.id] = user;

    console.log('list-user-data', data);
    await storage.saveRecentLoggedInUsers(data);

    if (storage.fcmToken && !_.isEmpty(storage.fcmToken)) {
      apiServices
        .updateFcmToken(storage.fcmToken)
        .then(rsp => console.log('updateFcmToken - rsp.data: ', rsp.data))
        .catch(error => console.log('updateFcmToken - error: ', error));
    }
  };

  const onPressRegister = useCallback(() => {
    navigation.push(Screens.Register);
  }, []);

  const onPressForgotPassword = useCallback(() => {
    navigation.push(Screens.ForgotPassword);
  }, []);
  const onPressLogin = useCallback(async () => {
    console.log(`send-login - email: ${email}, password: ${password}`);
    setIsLoading(true);
    const { data } = await apiServices.login(email.trim(), password.trim());
    setIsLoading(false);
    console.log(data);
    if (data.status == RESPONSE_STATUS.OK) {
      // await storage.saveUser(data.user_info);
      const userInfo = data.user_info;
      dispatch(
        appActions.signIn({
          ...userInfo,
          token: data.token,
          refresh_token: data.refresh_token,
        }),
      );
      // callback
      onFinishedLogin({
        ...userInfo,
        token: data.token,
        refresh_token: data.refresh_token,
      });
    } else if (data.status == RESPONSE_STATUS.ERROR) {
      switch (data.code) {
        case RESPONSE_ERROR_CODE.EMAIL_NOT_EXISTS:
          console.log('email_not_exist');
          break;
        case RESPONSE_ERROR_CODE.EMAIL_PASSWORD_WRONG:
          console.log('email_password_wrong');
          break;
        case RESPONSE_ERROR_CODE.VALIDATE_FAIL:
          console.log('validate_fail');
          break;

        default:
          console.log(data.code);
          break;
      }
      Alert.alert(t('email_password_wrong'));
    } else {
      console.log('something_went_wrong', data.status);

      Alert.alert(t('email_password_wrong'));
    }
    setIsLoading(false);
  }, [dispatch, email, password]);
  const onLeftPress = useCallback(() => {
    Navigation.dismissModal(componentId);
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
              onFinishedLogin(dataResponse);
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
      console.log(res);

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
        onFinishedLogin({
          ...userInfo,
          token: data.token,
          refresh_token: data.refresh_token,
        });
      } else {
        console.warn('onPressGoogleLogin ~ res', data);
        Alert.alert(t('error'), t('login_fail'));
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
          Alert.alert(t('error'), t('login_fail'));
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
          onFinishedLogin({
            ...userInfo,
            token: data.token,
            refresh_token: data.refresh_token,
          });
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

  const signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <NavBar
        parentComponentId={componentId}
        onLeftPress={onLeftPress}
        title={t('login')}
        styleTitle={style.title}
      />
      <ScrollView
        style={style.container}
        showsHorizontalScrollIndicator={false}>
        {/* <View style={[style.borderBottom]}>
          <View style={style.borderLeft}></View>
          <Text style={style.title}>{t('login')}</Text>
        </View> */}
        <InputGroup
          placeholder={t('email') + '(*)'}
          value={email}
          onChangeText={value => setEmail(value)}
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
        <View style={[style.textButtonDes, style.marginTop]}>
          <TouchableOpacity onPress={onPressForgotPassword}>
            <Text style={style.colorRed}>{t('forgot_password')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressRegister}>
            <Text style={style.colorRed}>{t('do_not_have_an_account')}</Text>
          </TouchableOpacity>
        </View>
        <View style={[style.loginButtonView, style.marginTop]}>
          <TouchableOpacity
            disabled={!email || !password}
            style={style.loginButton}
            onPress={onPressLogin}>
            <Text style={style.loginButtonText}>{t('login')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[style.loginButton, style.fbBackgroud, style.marginTop]}
          onPress={onPressFacebookLogin}>
          <Icon name={images.vicon_facebook} style={[style.iconFb, mr(2)]} />
          <Text style={style.textLoginBy}>{t('login_by_facebook')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[style.loginButton, style.ggBackgroud, style.marginTop]}
          onPress={onPressGoogleLogin}>
          <Icon name={images.icon_google} style={[style.iconGG, mr(2)]} />
          <Text style={style.textLoginBy}>{t('login_by_google')}</Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[style.loginButton, style.appleBackground, style.marginTop]}
            onPress={onPressAppleLogin}>
            <Icon name={images.icon_apple} size={15} color="#fff" />
            <Text style={style.textLoginBy}>{t('login_by_apple')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </Layout>
  );
};

export default Login;
