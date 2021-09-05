import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import Images from '../../assets/images';
import colors from '../../theme/colors';
import styles from './style';
import Utils from '../../commons/utils';
import Screens from '../screens';
import storage from '../../storage';
import { Layout, NavBar, ImageView, LoadingView } from '../../components';
import { useNavigation } from '../../hooks';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as appActions from '../../redux/store/reducers/app/action';
import { useDispatch } from 'react-redux';
import apiServices from '../../services';
import User from '../../models/user';

const ChangeAccountLogin = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [users, setUsers] = useState(storage.recentLoggedInUsers);
  const [isLoading, setIsLoading] = useState(false);
  const onPressBack = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, [componentId]);
  const onPressLogin = useCallback(() => {
    navigation.push(Screens.Login);
  }, [navigation]);
  const onPressRegister = useCallback(() => {
    navigation.push(Screens.Register);
  }, [navigation]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(appActions.signOut());
  }, [dispatch]);
  const onPressLoginAccount = async key => {
    try {
      setIsLoading(true);
      const data = storage.recentLoggedInUsers[key];
      console.log('Recent data - onPressLoginAccount: ', data);
      // call refresh token API
      const rsp = await apiServices.refreshAccessToken(data.refresh_token);
      if (Utils.isResponseSuccess(rsp)) {
        const { token } = rsp.data;
        data.token = token;
        dispatch(appActions.signIn(data));
        // get user profile
        const profileRsp = await apiServices.getProfile();
        if (Utils.isResponseSuccess(profileRsp)) {
          const { user_info } = profileRsp.data;
          dispatch(appActions.updateUserInfo(User.clone(user_info)));
        }
        Navigation.dismissModal(componentId);
      } else {
        onPressDeleteAccount(key);
        // show invalide account
        Alert.alert(t('error'), t('login_fail'), [
          {
            text: t('login'),
            onPress: () => {
              navigation.push(Screens.Login);
            },
          },
        ]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('onPressLoginAccount - error: ', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const onPressDeleteAccount = async key => {
    console.log(key);
    setIsLoading(true);
    const data = await storage.removeRecentLoggedInUsers(key);
    setUsers(data);
    setIsLoading(false);
  };

  const renderUserItems = () => {
    const listItemsData = [];
    for (const [key, item] of Object.entries(users)) {
      console.log(key, item);
      if (typeof item === 'object' && item) {
        listItemsData.push(
          <View style={styles.itemAccount} key={key}>
            <View style={styles.itemContent}>
              <TouchableOpacity
                style={styles.contentAccount}
                onPress={() => onPressLoginAccount(key)}>
                <FastImage
                  source={{
                    uri: item.icon || Images.empty,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.avatar}
                />
                <Text style={styles.accountName}>{item.hoten}</Text>
              </TouchableOpacity>
              <View style={styles.deleteAccount}>
                <TouchableOpacity onPress={() => onPressDeleteAccount(key)}>
                  <Ionicons
                    name={'close-outline'}
                    size={30}
                    color={colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>,
        );
      }
    }

    return listItemsData;
  };

  return (
    <Layout behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <NavBar
        parentComponentId={componentId}
        showCloseButton
        onLeftPress={onPressBack}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContent}>
            <ImageView style={styles.logo} source={Images.appIcon} />
          </View>
        </View>
        <View style={styles.mainContent}>
          {renderUserItems()}
          <View style={styles.item}>
            <TouchableOpacity style={styles.itemContent} onPress={onPressLogin}>
              <AntDesign
                style={styles.icon}
                name="plus"
                size={15}
                color={colors.green}
              />
              <Text style={styles.des}>{t('login_by_another_account')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.footer} onPress={onPressRegister}>
        <Text style={styles.desFooter}>{t('do_not_have_an_account')}</Text>
      </TouchableOpacity>
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </Layout>
  );
};
export default ChangeAccountLogin;
