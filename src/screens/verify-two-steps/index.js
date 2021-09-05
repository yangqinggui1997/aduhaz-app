import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { wp } from '../../commons/responsive';
import { ml, mt } from '../../commons/styles';
import { Button, Input, Layout, NavBar } from '../../components';
import colors from '../../theme/colors';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import storage from '../../storage';
import apiService from '../../services';
import Utils from '../../commons/utils';
import styles from './style';
import Loading from '../../components/loading-view';
import { useNavigation } from '../../hooks';

function VerifyTwoSteps({ componentId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('verify_two_steps')} />
      <View style={styles.container}>
        <TouchableOpacity>
          <Text style={styles.textButton}> {t('turnOnVerifyTwoSteps')}</Text>
        </TouchableOpacity>
        {isLoading && <Loading loading={isLoading} fullscreen />}
      </View>
    </Layout>
  );
}

export default VerifyTwoSteps;
