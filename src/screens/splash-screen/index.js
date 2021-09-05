import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import images from '../../assets/images';
import style from './style';
import * as appActions from '../../redux/store/reducers/app/action';
import LoadingDots from '../../../lib/react-native-loading-dots';
import Colors from '../../theme/colors';
import storage from '../../storage';
import apiServices from '../../services';
import Utils from '../../commons/utils';

const SplashScreen = () => {
  const dispatch = useDispatch();

  const [isLoading] = useState(false);

  // load user data
  useEffect(() => {
    // load data async
    const loadDataAsync = async () => {
      try {
        if (storage.isLoggedIn()) {
          // load user profile
          const userProfile = await apiServices.getProfile();
          if (Utils.isResponseSuccess(userProfile)) {
            dispatch(appActions.updateUserInfo(userProfile.data.user_info));
          }
        }
      } catch (error) {
        console.log('loadDataAsync: ', error);
      } finally {
        dispatch(appActions.appInitialized());
      }
    };
    loadDataAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDots = () => {
    return (
      <View style={style.dots}>
        <LoadingDots
          dots={3}
          colors={[Colors.flatRed01, Colors.flatRed01, Colors.flatRed01]}
          size={8}
        />
      </View>
    );
  };
  return (
    <View style={style.container}>
      <Image source={images.appIconName} style={style.logo} resizeMode="contain" />
      {isLoading && renderDots()}
    </View>
  );
};

export default SplashScreen;
