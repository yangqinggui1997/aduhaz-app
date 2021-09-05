import React, { useState } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { styles } from './style';
import colors from '../../theme/colors';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiServices from '../../services';
import {
  RESPONSE_STATUS,
} from '../../commons/constants';
import Screens from '../../screens/screens';

export default function showMenuHidePost({
  isClosedOnTouchOutside = true,
  item,
  componentId,
  onFinish
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <HidePostView
            componentId={componentId}
            onClose={hideBottomSheet}
            postItem={item}
            onFinish={onFinish}
          />
        ),
        height: 430,
      },
    },
  });
}

const HidePostView = ({ postItem, onClose, onFinish }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState({id: 0, reason: ''});

  const dummyData = [
    { title: t('dont_want_to_sell'), id: 1 },
    { title: t('already_sold_through_ahudaz'), id: 2 },
    { title: t('already_sold_through_another_market_place'), id: 3 },
  ];

  const onItemReasonPress = (item) => {
    setSelectedItem({
      id: item.id,
      reason: item.title,
    });
  };

  const onSubmitButtonPress = () => {
    hidePost();
  };

  const hidePost = async () => {
    try {
      const response = await apiServices.hidePost({
        id_post: postItem.id,
        reason: selectedItem.reason,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        onClose();
        onFinish();
        console.log('Success');
      } else {
        console.log('Error');
      }
    } catch (error) {
      
    }
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemReasonContainer}
        onPress={() => onItemReasonPress(item)}>
        <Ionicons
          name={
            selectedItem.id === item.id
              ? images.ionicons_radio_button_on
              : images.ionicons_radio_button_off
          }
          size={25}
          color={
            selectedItem.id === item.id ? colors.flatGreen : colors.flatGrey01
          }
        />
        <Text
          style={[
            styles.itemLabel,
            selectedItem.id === item.id ? styles.selectedItemLabel : {},
          ]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.screenTitle}>{t('hide_post')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </View>

      <Text style={styles.hidePostDetails}>{t('hide_post_details')}</Text>
      <Text style={styles.selectReason}>{t('select_reason')}</Text>

      <FlatList
        data={dummyData}
        style={{ flex: 1 }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
      />

      <View style={styles.footerView}>
        <TouchableOpacity
          onPress={onSubmitButtonPress}
          style={[
            styles.footerButton,
            selectedItem.id !== 0 ? styles.footerButtonEnable : {},
          ]}>
          <Text
            style={[
              styles.footerButtonTitle,
              selectedItem.id !== 0 ? styles.footerButtonTitleEnable : {},
            ]}>
            {t('hide_post').toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={[styles.footerButton]}>
          <Text style={styles.footerButtonTitle}>
            {t('cancel').toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
