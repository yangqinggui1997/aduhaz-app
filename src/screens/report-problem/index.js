import style from './style';
import React, { useCallback, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import { Layout, NavBar, LoadingView } from '../../components';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';
import Images from '../../assets/images';
import storage from '../../storage';
import colors from '../../theme/colors';
import apiServices from '../../services';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';

const ReportProblem = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [email, setEmail] = useState(storage.user.email);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const onPressLeft = () => {
    navigation.pop();
  };

  const onPressSubmit = useCallback(async () => {
    console.log(email, content);
    try {
      setLoading(true);
      const { data } = await apiServices.report({
        email,
        content,
      });
      if (data && data.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('report_success'));
        onPressLeft();
      }
      console.log('report', data);
    } catch (err) {
      console.log('ERROR - report', err);
    } finally {
      setLoading(false);
    }
  }, [email, content]);

  const renderRightButton = () => (
    <TouchableOpacity onPress={onPressSubmit}>
      <Icon name="send" size={16} color={colors.black} />
    </TouchableOpacity>
  );
  return (
    <Layout style={style.container}>
      <NavBar
        title={t('report')}
        onLeftPress={onPressLeft}
        accessoryRight={renderRightButton}
      />
      <View>
        {email ? (
          <Text style={style.email}>{email}</Text>
        ) : (
          <View style={[style.inputData, style.marginTop]}>
            <TextInput
              editable
              placeholder={t('email') + '(*)'}
              secureTextEntry={true}
              onChangeText={setEmail}
              value={email}
            />
          </View>
        )}
        <View style={[style.textArea, style.marginTop]}>
          <TextInput
            multiline
            underlineColorAndroid="transparent"
            numberOfLines={10}
            containerStyle={style.textArea}
            onChangeText={setContent}
            value={content}
            placeholder={t('type_content')}
          />
        </View>
      </View>
      {loading && <LoadingView loading={loading} fullscreen />}
    </Layout>
  );
};
export default ReportProblem;
