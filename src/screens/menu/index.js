import React, { useCallback, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';

import { Layout, NavBar, showListSelectionView } from '../../components';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { MENU_LIST } from '../../commons/constants';
import images from '../../assets/images';
import Colors from '../../theme/colors';
import styles from './style';
import { useSelector, useDispatch } from 'react-redux';
import storage from '../../storage';
import apiServices from '../../services';
import FastImage from 'react-native-fast-image';
import * as appActions from '../../redux/store/reducers/app/action';
import _ from 'lodash';

const Menu = ({ homeComponentId, componentId }) => {
  const { user } = useSelector(state => state.app);
  console.log('###user: ', user);
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [isShowFavoriteList, setIsShowFavoriteList] = useState(false);
  const [isShowSettingList, setIsShowSettingList] = useState(false);
  const [isShowHelpList, setIsShowHelpList] = useState(false);
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
  const dispatch = useDispatch();

  const toggleSwitch = () =>
    setIsToggleEnabled(previousState => !previousState);

  const onPressCloseMenu = useCallback(() => {
    Navigation.dismissAllModals();
  }, []);

  const onExpandList = name => {
    switch (name) {
      case MENU_LIST.FAVORITE_LIST:
        if (isShowFavoriteList) {
          setIsShowFavoriteList(false);
        } else {
          setIsShowFavoriteList(true);
        }
        break;
      case MENU_LIST.SETTING_LIST:
        if (isShowSettingList) {
          setIsShowSettingList(false);
        } else {
          setIsShowSettingList(true);
        }
        break;
      case MENU_LIST.HELP:
        if (isShowHelpList) {
          setIsShowHelpList(false);
        } else {
          setIsShowHelpList(true);
        }
        break;
    }
  };

  const checkLogin = (targetScreen, data = null) => {
    if (!storage.isLoggedIn()) {
      let screenName = Screens.Login;
      if (Object.entries(storage.recentLoggedInUsers).length > 0) {
        screenName = Screens.ChangeAccountLogin;
      }
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: screenName,
              },
            },
          ],
          options: {
            topBar: {
              visible: false,
            },
          },
        },
      });
    } else {
      navigation.push(targetScreen, data);
    }
  };

  const onLogout = async () => {
    try {
      console.log('Recent data - onLogout: ', storage.user);
      await apiServices.logout();
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(appActions.signOut());
      navigation.push(Screens.ChangeAccountLogin);
    }
  };

  const onPressProfile = () => {
    checkLogin(Screens.Profile);
  };

  const onPressManageListings = () => {
    checkLogin(Screens.ManageListings);
  };

  const onPressSavedList = () => {
    checkLogin(Screens.SavedList);
  };

  const onPressManageVideo = () => {
    checkLogin(Screens.ManageVideo);
  };

  const onPressFavoriteList = () => {
    checkLogin(Screens.FavoriteList, { homeComponentId: homeComponentId });
  };

  const onPressManageStoryVideo = () => {
    checkLogin(Screens.ManageStoryVideo);
  };

  const onPressManageStoryImage = () => {
    checkLogin(Screens.ManageStoryImage, { homeComponentId: homeComponentId });
  };

  const onPressFriend = () => {
    checkLogin(Screens.Friend);
  };

  const onPressRecharge = () => {
    checkLogin(Screens.Recharge);
  };
  const onPressAccountLogin = () => {
    checkLogin(Screens.AccountSetting);
  };
  const onPressShowWebview = pageName => {
    const dataWebview = {
      safe: {
        url: 'https://aduhaz.com/an-toan-mua-ban?header=false',
        title: t('safe'),
      },
      pushNew: {
        url: 'https://aduhaz.com/trung-tam-tro-giup?header=false',
        title: t('pushNew'),
      },
      requirement: {
        url: 'https://aduhaz.com/quy-dinh-can-biet?header=false',
        title: t('requirement'),
      },
      termsOfService: {
        url: 'https://aduhaz.com/dieu-khoan-dich-vu?header=false',
        title: t('termsOfService'),
      },
      privacyPolicy: {
        url: 'https://aduhaz.com/chinh-sach-quyen-rieng-tu?header=false',
        title: t('privacyPolicy'),
      },
    };

    if (dataWebview[pageName]) {
      checkLogin(Screens.PageWebview, {
        ...dataWebview[pageName],
        componentId,
        onClosePress: navigation.pop(),
      });
    }
  };

  const onLanguagePress = () => {
    showListSelectionView({
      title: t('menu'),
      items: [t('english'), t('vietnam'), t('china'), t('thailand')],
      showRadioButton: false,
      height: 200,
      onSelectedItem: async selectedIndex => {
        switch (Number(selectedIndex)) {
          case 0:
            await storage.saveUserLanguage('en');
            dispatch(appActions.appStartInitializing());
            break;
          case 1:
            await storage.saveUserLanguage('vi');
            dispatch(appActions.appStartInitializing());
            break;
          case 2:
            await storage.saveUserLanguage('zh');
            dispatch(appActions.appStartInitializing());
            break;
          case 3:
            await storage.saveUserLanguage('th');
            dispatch(appActions.appStartInitializing());
            break;
          default:
            break;
        }
      },
    });
  };

  const getSavedLanguage = () => {
    let lang;
    switch (storage.userLanguage) {
      case 'en':
        lang = t('english');
        break;
      case 'vi':
        lang = t('vietnam');
        break;
      case 'zh':
        lang = t('china');
        break;
      case 'th':
        lang = t('thailand');
        break;
    }
    return lang;
  };

  return (
    <Layout>
      <View style={styles.container}>
        <NavBar
          parentComponentId={componentId}
          showCloseButton
          onLeftPress={onPressCloseMenu}
          title={t('account')}
        />
        <View style={styles.accountView}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: user && user.icon ? user.icon : '',
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity onPress={onPressProfile}>
            <Text style={styles.viewYourAccount}>
              {(user && user.hoten) || t('viewYourAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.list}>
          <TouchableOpacity
            style={styles.meunuItem}
            onPress={onPressManageListings}>
            <Icon name={images.icon_list} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('managePost')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={onPressManageVideo}>
            <Icon name={images.icon_video_camera} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('manageVideo')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={onPressManageStoryImage}>
            <Icon name={images.icon_image} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('manageImageStory')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={onPressManageStoryVideo}>
            <Icon name={images.icon_video} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('manageVideoStory')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={onPressFavoriteList}>
            <Icon name={images.icon_favorite} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('favoriteList')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.meunuItem} onPress={onPressSavedList}>
            <Icon name={images.icon_saved} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('savedList')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.meunuItem, styles.paymentButton]}
            onPress={onPressRecharge}>
            <View style={styles.flexDirectionRow}>
              <Icon name={images.icon_payment} size={18} color="black" />
              <Text style={styles.menuTitle}>{t('payment')}</Text>
            </View>
            {user ? (
              <View style={styles.flexDirectionRow}>
                <Text style={styles.balance}>{t('balance')}</Text>
                <Text style={styles.balance}>
                  {!_.isEmpty(user.money) ? user.money : 0}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity style={styles.meunuItem} onPress={onPressFriend}>
            <Icon name={images.icon_friend} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('friend')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.meunuItem, styles.topBorder]}
            onPress={() => onExpandList(MENU_LIST.SETTING_LIST)}>
            <Icon name={images.icon_setting} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('setting')}</Text>
          </TouchableOpacity>

          {isShowSettingList && (
            <View style={styles.favoriteList}>
              <TouchableOpacity
                style={styles.meunuItem}
                onPress={onPressAccountLogin}>
                <Icon
                  name={images.icon_account_setting}
                  size={18}
                  color="black"
                />
                <Text style={styles.menuTitle}>{t('accountSetting')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.meunuItem, styles.languageRow]}
                onPress={onLanguagePress}>
                <View style={styles.flexDirectionRow}>
                  <Icon name={images.icon_language} size={18} color="black" />
                  <Text style={styles.menuTitle}>{t('language')}</Text>
                </View>
                {getSavedLanguage() ? (
                  <Text style={styles.selectedLanguage}>
                    {getSavedLanguage()}
                  </Text>
                ) : null}
              </TouchableOpacity>

              {/* <TouchableOpacity style={[styles.meunuItem, styles.darkmodeView]}>
                <View style={styles.flexDirectionRow}>
                  <Icon name={images.icon_darkmode} size={18} color="black" />
                  <Text style={styles.menuTitle}>{t('darkmode')}</Text>
                </View>
                <Switch
                  trackColor={{ false: Colors.flatGrey, true: Colors.green }}
                  thumbColor={false ? Colors.flatYellow : Colors.flatGray}
                  ios_backgroundColor={Colors.flatGrey02}
                  onValueChange={toggleSwitch}
                  value={isToggleEnabled}
                />
              </TouchableOpacity> */}
            </View>
          )}

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={() => onExpandList(MENU_LIST.HELP)}>
            <Icon name={images.icon_help} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('help')}</Text>
          </TouchableOpacity>

          {isShowHelpList && (
            <View style={styles.favoriteList}>
              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => onPressShowWebview('safe')}>
                <Icon name={images.icon_lock} size={18} color="black" />
                <Text style={styles.menuTitle}>{t('safe')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => onPressShowWebview('pushNew')}>
                <Icon name={images.icon_up} size={18} color="black" />
                <Text style={styles.menuTitle}>{t('pushNew')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => onPressShowWebview('termsOfService')}>
                <MaterialIcon
                  name="miscellaneous-services"
                  size={18}
                  color="black"
                />
                <Text style={styles.menuTitle}>{t('termsOfService')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => onPressShowWebview('privacyPolicy')}>
                <MaterialIcon name="policy" size={18} color="black" />
                <Text style={styles.menuTitle}>{t('privacyPolicy')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => {
                  checkLogin(Screens.Feedback);
                }}>
                <Icon name={images.icon_feedback} size={18} color="black" />
                <Text style={styles.menuTitle}>{t('feedback')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.meunuItem}
                onPress={() => {
                  checkLogin(Screens.ReportProblem);
                }}>
                <Icon name={images.icon_report} size={18} color="black" />
                <Text style={styles.menuTitle}>{t('report')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.meunuItem}
            onPress={() => onPressShowWebview('requirement')}>
            <Icon name={images.icon_bookmark} size={18} color="black" />
            <Text style={styles.menuTitle}>{t('requirement')}</Text>
          </TouchableOpacity>

          {storage.isLoggedIn() ? (
            <TouchableOpacity
              style={[styles.meunuItem, styles.logout]}
              onPress={onLogout}>
              <Icon name={images.icon_logout} size={18} color="black" />
              <Text style={styles.menuTitle}>{t('logout')}</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </Layout>
  );
};

export default Menu;
