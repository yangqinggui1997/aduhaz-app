import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { wp } from '../../commons/responsive';
import { Button, Input, Layout, NavBar } from '../../components';
import colors from '../../theme/colors';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import storage from '../../storage';
import apiService from '../../services';
import Utils from '../../commons/utils';
import styles from './style';
import Loading from '../../components/loading-view';
import { useNavigation } from '../../hooks';
import { RESPONSE_STATUS } from '../../commons/constants';
import {
  flexRow,
  justifyBetween,
  ml,
  mr,
  mt,
  pb,
  pdH,
  pt,
  flex1,
} from '../../commons/styles';
import moment from 'moment';

function ManagerDevices({ componentId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [isLoading, setIsLoading] = React.useState(false);
  const [devices, setDevices] = React.useState([]);
  const getDevices = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiService.getDevices();
      console.log('getDevices', data);
      if (data?.status == RESPONSE_STATUS.OK) {
        setDevices(data.devices);
      }
    } catch (error) {
      console.log('getDevices - error', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDevices();
  }, []);
  const renderItem = ({ item, index }) => {
    if (!item?.name) {
      return null;
    }
    return (
      <View style={styles.itemDevice}>
        <View style={styles.contentDevice}>
          <Text style={styles.title}>
            {item.name} - {item.address}
          </Text>
          <Text style={styles.time}>
            {item.time ? moment.unix(item.time).format('DD-MM-YYYY') : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => onPressRemoveDevices(item.id)}>
          <Text style={styles.delete}>{t('delete')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const removeDevices = async id => {
    try {
      setIsLoading(false);
      const { data } = await apiService.removeDevice({ id_device: id });
      console.log('removeDevice', data);
      if (data?.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('updated'));
        return getDevices();
      } else {
        Alert.alert(t('update_error'));
      }
    } catch (error) {
      console.log('removeDevice - error', error);
      Alert.alert(t('update_error'));
    } finally {
      setIsLoading(false);
    }
  };
  const onPressRemoveDevices = async id => {
    Alert.alert(t('confirmDelete'), t('desConfirmDelete'), [
      {
        onPress: () => removeDevices(id),
      },
    ]);
  };
  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('manage_devices')} />
      <View style={styles.container}>
        <FlatList
          data={devices}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(_, index) => 'key' + index.toString()}
        />
        {isLoading && <Loading loading={isLoading} fullscreen />}
      </View>
    </Layout>
  );
}

export default ManagerDevices;
