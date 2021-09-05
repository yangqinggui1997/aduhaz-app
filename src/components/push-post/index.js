import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { styles } from './style';
import colors from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../../screens/screens';
import FastImage from 'react-native-fast-image';

export default function showPushPostPopup({
  isClosedOnTouchOutside = true,
  pushPostItem,
  componentId,
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
          <PushPost
            componentId={componentId}
            onClose={hideBottomSheet}
            pushPostItem={pushPostItem}
          />
        ),
        height: 400,
      },
    },
  });
}

const PushPost = ({ pushPostItem, onClose }) => {
  const { t } = useTranslation();
  const [selectedItemIndex, setSelectedItemIndex] = useState();
  const [isEnableButtonPay, setIsEnableButtonPay] = useState(false);

  const onDatePushPress = index => {
    setSelectedItemIndex(index);
    setIsEnableButtonPay(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>

        <View style={styles.pushPostPackage}>
          <View style={styles.pushPostDetails}>
            <Text style={styles.pushPostTitle}>{pushPostItem.name}</Text>
            <Text style={styles.pushPostPrice}>
              {pushPostItem.price}/ {pushPostItem.type}
            </Text>
            <Text style={styles.pushPostDes}>{pushPostItem.description}</Text>
          </View>
          <View style={styles.pushPostIcon}>
            <FastImage
              style={styles.icon}
              source={{
                uri: pushPostItem.icon,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        </View>

        <Text style={styles.selectDateTitle}>{t('selectDateToPush')}</Text>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {pushPostItem.times.map((item, index) => (
            <View style={styles.itemDateContainer}>
              <TouchableOpacity
                style={[
                  styles.datePushView,
                  index === selectedItemIndex
                    ? styles.selectedDatePushView
                    : {},
                ]}
                onPress={() => onDatePushPress(index)}>
                <Text
                  style={[
                    styles.dateAmount,
                    index === selectedItemIndex ? { color: colors.white } : {},
                  ]}>
                  {item.ngay}
                </Text>
              </TouchableOpacity>

              {item.promo !== 0 && (
                <View style={styles.discountView}>
                  <Text style={styles.discount}>{item.promo}%</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={onClose}
        style={[
          styles.actionButton,
          isEnableButtonPay ? { backgroundColor: colors.flatGreen } : {},
        ]}>
        <Text
          style={[
            styles.actionButtonTitle,
            isEnableButtonPay ? { color: colors.white } : {},
          ]}>
          {t('charge')} - {pushPostItem.price}/ {pushPostItem.type}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
