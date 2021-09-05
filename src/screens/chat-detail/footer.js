import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';
import { useTranslation } from 'react-i18next';
import apiService from '../../services';
import Utils from '../../commons/utils';

export default function Footer({
  onPressRating,
  onPressSendSuggestMessage,
  seller,
  categoryId,
  showSuggestMessage = false,
  showRating = false,
}) {
  const { t } = useTranslation();
  const [suggestMessage, setSuggestMessage] = useState([]);

  // did mount
  useEffect(() => {
    if (showSuggestMessage && categoryId) {
      apiService
        .getSuggestionWordEvaluate(categoryId)
        .then(response => {
          if (Utils.isResponseSuccess(response)) {
            setSuggestMessage(response.data.data);
          }
        })
        .catch(error => console.log('error: ', error));
    }
  }, [categoryId, showSuggestMessage]);

  const keyExtractor = item => item.id.toString();

  const renderSuggestMessage = ({ item, index }) => {
    console.log('suggestion message: ', item);
    return (
      <TouchableOpacity
        style={styles.suggestMessageItem}
        onPress={() => onPressSendSuggestMessage(item.key_word)}>
        <Text>{item.key_word}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {showRating && (
        <View style={styles.container}>
          <View style={styles.left}>
            <Ionicons name="star" size={24} color={colors.orange} />
          </View>
          <View style={styles.middle}>
            <View>
              <Text style={styles.title}>
                {`${t('trade')} ${seller?.hoten} ${t('notYet')}`}
              </Text>
              <Text>{t('tradeDesc')}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <TouchableOpacity style={styles.btnRating} onPress={onPressRating}>
              <Text>{t('rating')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showSuggestMessage && !_.isEmpty(suggestMessage) && (
        <View style={styles.suggestMessageContainer}>
          <FlatList
            data={suggestMessage}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            renderItem={renderSuggestMessage}
            horizontal
            contentContainerStyle={styles.suggestMessageContentContainer}
            scrollEnabled
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: wp(10),
    paddingHorizontal: wp(6),
    width: '100%',
    alignItems: 'center',
  },

  middle: {
    flexDirection: 'row',
    paddingLeft: wp(10),
    flex: 1,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(10),
  },
  left: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  btnRating: {
    backgroundColor: colors.orange,
    paddingVertical: wp(6),
    paddingHorizontal: wp(16),
    borderRadius: wp(8),
  },

  // suggest message
  suggestMessageContainer: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#b2b2b2',
  },
  suggestMessageContentContainer: {},
  suggestMessageItem: {
    paddingVertical: wp(10),
    paddingHorizontal: wp(12),
    marginHorizontal: wp(5),
  },
});
