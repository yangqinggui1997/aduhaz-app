import React, { useState } from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';
import colors from '../../theme/colors';
import styles from './style';
import RechargePackage from '../../components/recharge-package';
import storage from '../../storage';
import _ from 'lodash';

const Recharge = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const data = [
    {
      package: '1.500.000',
      paymentCode: '11621922',
      method: t('topupCredit'),
      time: '18/05/2021 16:00',
      type: t('domestic'),
      status: 1,
      id: 1,
    },
    {
      package: '1.000.000',
      paymentCode: '121a21922b',
      method: t('withdraw'),
      time: '12/06/2021 16:00',
      type: t('domestic'),
      status: 0,
      id: 2,
    },
    {
      package: '22.500.000',
      paymentCode: '116ss21922a',
      method: t('topupCredit'),
      time: '18/07/2021 18:00',
      type: t('domestic'),
      status: 1,
      id: 3,
    },
    {
      package: '1.000.000',
      paymentCode: '121a21922b',
      method: t('withdraw'),
      time: '12/06/2021 16:00',
      type: t('domestic'),
      status: 0,
      id: 4,
    },
    {
      package: '22.500.000',
      paymentCode: '116ss21922a',
      method: t('topupCredit'),
      time: '18/07/2021 18:00',
      type: t('domestic'),
      status: 1,
      id: 5,
    },
    {
      package: '1.000.000',
      paymentCode: '121a21922b',
      method: t('withdraw'),
      time: '12/06/2021 16:00',
      type: t('domestic'),
      status: 0,
      id: 6,
    },
    {
      package: '22.500.000',
      paymentCode: '116ss21922a',
      method: t('topupCredit'),
      time: '18/07/2021 18:00',
      type: t('domestic'),
      status: 1,
      id: 7,
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.paymentCode}>{item.paymentCode}</Text>
        <View style={styles.paymentDetailsView}>
          <Text style={styles.paymentDetails}>
            {t('paymentPackage')}: {item.package}
          </Text>
          <Text style={styles.paymentDetails}>
            {t('method')}: {item.method}
          </Text>
          <Text style={styles.paymentDetails}>
            {t('date')}: {item.time}
          </Text>
          <Text style={styles.paymentDetails}>
            {t('type')}: {item.type}
          </Text>
        </View>
        <View style={styles.statusView}>
          <Ionicons
            name={
              item.status === 1
                ? images.ionicons_ios_checkmark_circle
                : images.ionicons_info_circle
            }
            size={15}
            color={colors.black}
          />
        </View>
      </View>
    );
  };

  return (
    <Layout style={styles.container}>
      <NavBar parentComponentId={componentId} title={t('payment')} />
      <View style={styles.contentView}>
        <View style={styles.topView}>
          <Text style={styles.balance}>{t('accountBalance')}</Text>
          <Text style={styles.balanceNumber}>
            {!_.isEmpty(storage.user.money) ? storage.user.money : 0} VND
          </Text>
        </View>

        <View style={styles.headerView}>
          <Text style={[styles.headerText, { textAlign: 'left' }]}>
            {t('paymentCode')}
          </Text>
          <Text style={[styles.headerText, { textAlign: 'center' }]}>
            {t('details')}
          </Text>
          <Text style={[styles.headerText, { textAlign: 'right' }]}>
            {t('status')}
          </Text>
        </View>

        <FlatList
          data={data}
          style={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          bounces={false}
        />

        <RechargePackage style={styles.rechargePackage} />
      </View>
    </Layout>
  );
};

export default Recharge;
