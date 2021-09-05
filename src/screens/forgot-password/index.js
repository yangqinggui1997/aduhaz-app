import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout, InputGroup } from '../../components';
import style from './style';
import { useNavigation } from '../../hooks';
import apiServices from '../../services';
import LoadingView from '../../components/loading-view';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const ForgotPassword = ({ componentId }) => {
  const navigation = useNavigation(componentId);

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailOption, setIsEmailOption] = React.useState(true);

  const sendEmail = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await apiServices.forgotPassword(email);
      setIsLoading(false);
      console.log('send Email', data);
      if (data.status == RESPONSE_STATUS.OK) {
        alert(t('send_email_forgot_password', { email }));
        Navigation.dismissModal(componentId);
      } else {
        alert(t('send_forgot_fail'));
      }
    } catch (error) {
      console.log('getProfile -> error', error);
    }
  }, [email]);

  let description = t('des_forgot_password');
  let placeholder = t('email') + '(*)';
  let buttonText = t('search_account_by_phone');
  let icon = <Ionicons name="mail" style={style.iconInput} />;
  if (!isEmailOption) {
    description = t('des_forgot_password_by_phone_number');
    placeholder = t('phone_number') + '(*)';
    buttonText = t('search_account_by_email');
    icon = <Icon name="mobile-phone" style={style.iconEvilIconsInput} />;
  }
  const onPressChange = () => {
    setIsEmailOption(!isEmailOption);
  };
  const inputData = (
    <InputGroup
      placeholder={placeholder}
      value={email}
      onChangeText={value => setEmail(value)}
      accessoryLeft={icon}
    />
  );
  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('forgot_password')} />
      <ScrollView style={style.container}>
        {/* <View style={style.flexColum} >
          <View style={style.borderBottom}>
            <View style={style.borderLeft}></View>
            <Text style={style.title}></Text>
          </View>
        </View> */}
        <Text style={[style.des, style.marginTop]}>{description}</Text>
        <Text style={[style.des, style.marginTop]}>{placeholder}</Text>
        {inputData}
        <View style={[style.marginTop, style.buttonView]}>
          <TouchableOpacity style={style.changeOption} onPress={onPressChange}>
            <Text style={style.optionText}>{buttonText}</Text>
          </TouchableOpacity>
          <View style={style.sendButtonView}>
            <TouchableOpacity
              style={style.forgotPasswordButton}
              onPress={sendEmail}>
              <Text style={style.forgotPasswordButtonText}>{t('to_send')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
      </ScrollView>
    </Layout>
  );
};

export default ForgotPassword;
