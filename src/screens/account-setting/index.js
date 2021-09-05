import React, { useState, useEffect } from 'react';
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
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
//AntDesign
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import images from '../../assets/images';
import { KeyboardView, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import ImageView from '../../components/image-view';
import DatePicker from 'react-native-date-picker';

import { useDispatch, useSelector } from 'react-redux';
import * as appActions from '../../redux/store/reducers/app/action';

import { PopupSelectDate, LoadingView } from '../../components';
import Screens from '../../screens/screens';
import storage from '../../storage';
import apiServices from '../../services';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';
import moment from 'moment';
import User from '../../models/user';

const AccountSetting = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const { user } = useSelector(state => state.app);
  // const userProfile = storage.user || {};
  const [profile, setProfile] = React.useState(user);
  const [birthday, setBirthday] = React.useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('AccountSetting - user', user);

  const onPressBack = () => {
    // Navigation.dismissModal(componentId);
    // checkLogin(Screens.Menu);
    navigation.pop();
  };
  const onPressOut = () => {
    Navigation.dismissModal(componentId);
  };
  const getProfile = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.getProfile();
      setIsLoading(false);
      if (data.status == RESPONSE_STATUS.OK && data.user_info) {
        let userInfo = data.user_info;
        let user = User.clone({ ...user, ...userInfo });
        if (user.ngaysinh) {
          user.ngaysinh = moment.unix(user.ngaysinh).format('DD/MM/YYYY');
          const date = moment.unix(user.ngaysinh).format('YYYY-MM-DD');

          setBirthday(new Date(date));
        }
        await dispatch(appActions.updateUserInfo(user));
        setProfile(user);
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  };

  const openScreen = (targetScreen, data) => {
    if (!storage.isLoggedIn()) {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: Screens.Login,
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

  useEffect(() => {
    getProfile();
  }, []);

  const renderProperties = (index, item) => {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        style={[style.itemContent, style.borderBottom]}>
        <Text style={style.titleItem}> {t(item.title)}</Text>
        <View style={style.detailItem}>
          <AntDesign
            name="right"
            style={style.iconDetail}
            color={colors.flatBlack02}
          />
          <Text style={style.titleItem}>{item.value}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  let onPressSaveBirthDate = async value => {
    try {
      const { data } = await apiServices.updateProfile(
        'date_of_birth',
        moment(value).unix(),
      );
      console.log(data);
      if (data && data.status == RESPONSE_STATUS.OK) {
        getProfile();
        Alert.alert(t('updated'));
      }
    } catch (err) {
      console.log('error save data', err);
    }
  };

  const dateRender = [
    {
      title: 'full_name',
      field: 'hoten',
      value: user.hoten,
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('edit') + ' ' + t('full_name'),
          value: user.hoten,
          field: 'hoten',
          inputField: 'full_name',
          onUpdateSuccess: () => {
            getProfile();
          },
        });
      },
    },
    {
      title: 'phone_number',
      field: 'sodienthoai',
      value: user.sodienthoai,
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('edit') + ' ' + t('phone_number'),
          value: user.sodienthoai,
          field: 'sodienthoai',
          inputField: 'phone_number',
          onUpdateSuccess: () => {
            getProfile();
          },
        });
      },
    },
    {
      title: 'email',
      field: 'email',
      value: user.email,
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('edit') + ' ' + t('email'),
          value: user.email,
          field: 'email',
          inputField: 'email',
          onUpdateSuccess: () => {
            getProfile();
          },
        });
      },
    },
    {
      title: 'birthday',
      field: 'ngaysinh',
      inputField: 'date_of_birth',
      value: user.ngaysinh,
      onPress: () => {
        setModalVisible(!modalVisible);
      },
    },
    {
      title: 'gender',
      field: 'gioitinh', //
      value: user.gioitinh == 1 ? t('male') : t('female'),
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('edit') + ' ' + t('gender'),
          value: user.gioitinh,
          field: 'gioitinh',
          inputField: 'sex',
          onUpdateSuccess: () => {
            getProfile();
          },
        });
      },
    },
    {
      title: 'add_link_account',
      field: '',
      value: '',
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('add_link_account'),
          value: '',
          field: 'linkAccount',
        });
      },
    },
    // {
    //   title: 'account_security',
    //   field: '',
    //   value: '',
    //   onPress: () => {
    //     openScreen(Screens.AccountSettingItem, {
    //       title: t('account_security'),
    //       value: '',
    //       field: 'accountSecurity',
    //     });
    //   },
    // },
    {
      title: 'change_password',
      field: '',
      value: '',
      onPress: () => {
        openScreen(Screens.AccountSettingItem, {
          title: t('change_password'),
          value: null,
          field: 'changePassword',
        });
      },
    },
  ];
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
        <Text style={style.titleHeader}> {t('accountSetting')}</Text>
        <TouchableOpacity style={style.exit} onPress={onPressOut}>
          <Ionicons name="exit-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </View>
      {/* <ScrollView style={style.content}> */}
      <FlatList
        data={dateRender}
        renderItem={({ item, index }) => renderProperties(index, item)}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
        bounces={false}
      />
      <PopupSelectDate
        onSubmit={onPressSaveBirthDate}
        value={birthday}
        isVisible={modalVisible}
        closePopup={() => setModalVisible(false)}
      />
      {/* </ScrollView> */}
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </Layout>
  );
};
//exit-outline
export default AccountSetting;
