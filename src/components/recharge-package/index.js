import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import styles from './style';
import apiServices from '../../services';
import MoneyPackageModel from '../../models/money-package';
import { RESPONSE_STATUS } from '../../commons/constants';

const RechargePackage = ({ rechargePackage, ...props }) => {
  const { t } = useTranslation();
  const [isDropDown, setIsDropDown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);
  const [moneyPackage, setMoneyPackage] = useState([]);
  const [userWallet, setUserWallet] = useState(0);

  useEffect(() => {
    fetchMoneyPackage();
    fetchMoney();
  }, []);

  const fetchMoneyPackage = async () => {
    var _moneyPackage = [];
    try {
      const response = await apiServices.getMoneyPackages();
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        _moneyPackage = response.data.data.map(obj =>
          MoneyPackageModel.clone(obj),
        );
      }
      setMoneyPackage(_moneyPackage);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchMoney = async () => {
    try {
      const response = await apiServices.getMoney();
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        setUserWallet(response.data.money);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const onItemRechargePress = value => {
    setSelectedItem(value);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemRechargeContainer}
        onPress={() => onItemRechargePress(item.id)}>
        <Ionicons
          name={
            selectedItem === item.id
              ? images.ionicons_radio_button_on
              : images.ionicons_radio_button_off
          }
          size={25}
          color={
            selectedItem === item.id ? colors.flatGreen : colors.flatGrey01
          }
        />
        <Text
          style={[
            styles.itemLabel,
            selectedItem === item.id ? styles.selectedItemLabel : {},
          ]}>
          {item.title} (+{item.discount}%)
        </Text>
        <Text style={styles.currency}>VND</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={props.style}>
      <View style={styles.walletDetail}>
        <Text style={styles.walletCoin}>{t('coinWallet')}</Text>
        <Text style={styles.walletCoin}>{userWallet ? userWallet : 0} VND</Text>
      </View>

      <TouchableOpacity
        style={styles.rechargePackage}
        onPress={() => {
          setIsDropDown(prev => !prev);
        }}>
        <Text style={styles.rechargeTitle}>{t('rechargePackage')}</Text>
        <View style={styles.iconDropDown}>
          <Ionicons
            name={
              isDropDown ? images.ionicons_caret_up : images.ionicons_caret_down
            }
            size={15}
            color={colors.black}
          />
        </View>
      </TouchableOpacity>

      {isDropDown && (
        <FlatList
          data={moneyPackage}
          style={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
        />
      )}

      <TouchableOpacity
        style={[
          styles.depositNowContainer,
          selectedItem === 0
            ? styles.depositNowButtonDisableColor
            : styles.depositNowButtonEnableColor,
        ]}
        disabled={selectedItem === 0}>
        <Text style={styles.depositNow}>{t('depositNow')}</Text>
      </TouchableOpacity>
    </View>
  );
};

RechargePackage.propTypes = {};

export default RechargePackage;
