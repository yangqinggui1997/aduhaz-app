import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { wp } from '../../commons/responsive';
import { ml, mt } from '../../commons/styles';
import { Button, Input, Layout, NavBar } from '../../components';
import colors from '../../theme/colors';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import storage from '../../storage';
import apiService from '../../services';
import Utils from '../../commons/utils';
import Loading from '../../components/loading-view';
import { useNavigation } from '../../hooks';

function Report({ componentId, postId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [inValid, setInValid] = React.useState(false);

  const onPressReWork = useCallback(() => {
    setFullName('');
    setPhoneNumber('');
    setContent('');
  }, []);

  const handleSend = async () => {
    if (phoneNumber?.length && fullName?.length && content?.length) {
      const requestData = {
        phone_number: phoneNumber,
        id_post: postId,
        content,
        full_name: fullName,
      };

      setIsLoading(true);
      try {
        await apiService.postReport(requestData);
        Alert.alert(
          t('sentReportSuccessfully'),
          '',
          [{ text: t('ok'), onPress: () => navigation.pop() }],
          {
            cancelable: false,
          },
        );
      } catch (error) {
        console.log(
          '🚀 ~ file: index.js ~ line 42 ~ handleSend ~ error',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChangePhoneNumber = value => {
    setPhoneNumber(value);

    if (value?.length) {
      const valid = Utils.validateVNPhoneNumber(value);
      if (valid) {
        setInValid(false);
      } else {
        setInValid(true);
      }
    } else {
      setInValid(false);
    }
  };

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('reportViolation')} />
      <View style={styles.container}>
        <ScrollView>
          <Input
            placeholder={`${t('fullName')} (*)`}
            accessoryLeft={
              <SimpleLineIcons
                name="user-female"
                size={20}
                color={colors.flatGrey01}
                style={styles.inputIcon}
              />
            }
            value={fullName}
            onChangeText={value => setFullName(value)}
          />
          <Input
            placeholder={`${t('phoneNumber')} (*)`}
            accessoryLeft={
              <SimpleLineIcons
                name="phone"
                size={20}
                color={colors.flatGrey01}
                style={styles.inputIcon}
              />
            }
            value={phoneNumber}
            onChangeText={handleChangePhoneNumber}
            keyboardType="phone-pad"
          />
          {inValid && (
            <Text style={[styles.requiredText, mt(0)]}>
              {t('inValidPhoneNumber')}
            </Text>
          )}

          <Input
            multiline
            placeholder={`${t('contactContent')} (*)`}
            containerStyle={styles.inputContainerStyle}
            style={styles.inputStyle}
            accessoryLeft={
              <SimpleLineIcons
                name="pencil"
                size={20}
                color={colors.flatGrey01}
                style={styles.inputIcon}
              />
            }
            value={content}
            onChangeText={value => setContent(value)}
          />
          <Text style={styles.requiredText}>{`(*) ${t('requiredInfo')}`}</Text>

          <View style={styles.bottomContainer}>
            <Button
              title={t('send')}
              style={styles.btn}
              titleStyle={styles.btnTitleStyle}
              onPress={handleSend}
            />
            <Button
              title={t('reWork')}
              style={[styles.btn, ml(15)]}
              titleStyle={styles.btnTitleStyle}
              onPress={onPressReWork}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
        {isLoading && <Loading loading={isLoading} fullscreen />}
      </View>
    </Layout>
  );
}

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(15),
    marginTop: wp(30),
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: wp(30),
    justifyContent: 'flex-end',
  },
  btn: {
    width: wp(80),
    backgroundColor: colors.yellow,
  },
  btnTitleStyle: {
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  requiredText: {
    color: colors.red,
    marginTop: wp(10),
  },
  inputContainerStyle: {
    maxHeight: wp(100),
  },
  inputStyle: {
    maxHeight: wp(100),
    paddingHorizontal: wp(8),
    paddingRight: wp(30),
    paddingVertical: wp(8),
  },
  inputIcon: {},
});
