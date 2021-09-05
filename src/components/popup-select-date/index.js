import React, { useState, useCallback } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import style from './styles';
import { useTranslation } from 'react-i18next';

const PopupSelectDate = ({
  isVisible = false,
  value = null,
  onPressChange = null,
  closePopup = null,
  onSubmit = null,
  ...props
}) => {
  const [date, setDate] = useState(value);
  const { t } = useTranslation();

  const onPressSubmit = useCallback(async () => {
    // console.log('sumit date', date);
    onSubmit(date);
    closePopup();
  }, [date]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          closePopup();
        }}
        animationType="fade"
        supportedOrientations={['portrait', 'portrait-upside-down']}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={style.closeButton}
              onPress={() => closePopup()}>
              <Ionicons name={'close-outline'} size={30} color="black" />
            </TouchableOpacity>
            <DatePicker
              date={date}
              style={style.datePicker}
              androidVariant="nativeAndroid"
              onDateChange={date => setDate(date)}
              mode="date"
            />
            <View style={style.submitView}>
              <TouchableOpacity style={style.submit} onPress={onPressSubmit}>
                <Text style={style.submitText}>{t('submit')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default PopupSelectDate;
