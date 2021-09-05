import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { wp } from '../../commons/responsive';
import { Button, Layout, NavBar, TextArea } from '../../components';
import colors from '../../theme/colors';

import RatingItem from './rating-item';

import apiServices from '../../services';
import { useNavigation } from '../../hooks';

export default function Rating({ componentId, postId, userId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [communication, setCommunication] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [fastTrade, setFastTrade] = React.useState(0);
  const [content, setContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinishRatingCommunication = useCallback(rating => {
    setCommunication(rating);
  }, []);
  const onFinishRatingPrice = useCallback(rating => {
    setPrice(rating);
  }, []);
  const onFinishRatingFastTrade = useCallback(rating => {
    setFastTrade(rating);
  }, []);

  const handleSend = async () => {
    if (content.length) {
      const submitData = {
        amount_of_star: (communication + price + fastTrade) / 3,
        content,
        id_post: postId,
        id_user: userId,
      };

      try {
        setIsLoading(true);
        await apiServices.userRating(submitData);
        Alert.alert(
          t('sendRatingSuccess'),
          '',
          [
            {
              text: t('ok'),
              onPress: () => navigation.pop(),
            },
          ],
          {
            cancelable: false,
          },
        );
      } catch (error) {
        Alert.alert(
          t('sendRatingUnSuccess'),
          '',
          [
            {
              text: t('ok'),
            },
          ],
          {
            cancelable: false,
          },
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        t('typeRatingContent'),
        '',
        [
          {
            text: t('ok'),
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  return (
    <Layout>
      <NavBar
        parentComponentId={componentId}
        title={t('rating')}
        style={styles.navbar}
      />
      <View style={styles.container}>
        <ScrollView>
          <RatingItem
            heading={t('communication')}
            subHeading={t('communicationDesc')}
            onFinishRating={onFinishRatingCommunication}
          />
          <RatingItem
            heading={t('price')}
            subHeading={t('priceDesc')}
            onFinishRating={onFinishRatingPrice}
          />
          <RatingItem
            heading={t('fastTrade')}
            subHeading={t('fastTradeDesc')}
            onFinishRating={onFinishRatingFastTrade}
          />
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>{t('comment')}</Text>
            <TextArea value={content} onChange={txt => setContent(txt)} />
            <Text style={styles.commentNote}>{t('commentNote')}</Text>
          </View>

          <View style={styles.btnContainer}>
            <Button
              title={t('send')}
              style={styles.btn}
              titleStyle={styles.btnTitleStyle}
              onPress={handleSend}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: colors.white,
    borderBottomColor: colors.flatBlack03,
    borderBottomWidth: 1 / 2,
  },
  container: {
    flex: 1,
  },
  commentContainer: {
    paddingHorizontal: wp(15),
    marginTop: wp(30),
  },
  commentLabel: {
    fontSize: wp(18),
    fontWeight: 'bold',
    marginBottom: wp(10),
  },
  commentNote: {
    fontSize: wp(14),
    marginTop: wp(10),
    fontStyle: 'italic',
  },
  btnContainer: {
    marginTop: wp(30),
    paddingHorizontal: wp(15),
  },
  btn: {
    backgroundColor: colors.white,
    borderColor: colors.flatBlack03,
    borderWidth: 1 / 2,
  },
  btnTitleStyle: {
    textTransform: 'uppercase',
    fontSize: wp(14),
    fontWeight: 'bold',
  },
});
