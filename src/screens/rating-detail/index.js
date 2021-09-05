import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

import { ImageView, Layout, NavBar } from '../../components';
import { RatingDetailModel } from '../../models/rating-detail';
import apiServices from '../../services';
import { styles } from './styles';
import Utils from '../../commons/utils';

export default function RatingDetail({ componentId, userId }) {
  const { t } = useTranslation();

  const [ratings, setRatings] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});

  const getEvaluateDetail = React.useCallback(async id => {
    try {
      const { data = [] } = await apiServices.userGetEvaluateDetail(id);
      const list = data?.data?.evaluate_details.map(item =>
        RatingDetailModel.clone(item),
      );
      setCurrentUser(data?.data?.user_infor);
      setRatings(list);
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    getEvaluateDetail(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const _renderItem = ({ item }) => {
    return <RatingItem {...item} />;
  };

  return (
    <Layout>
      <NavBar
        parentComponentId={componentId}
        title={t('ratingDetail')}
        style={styles.navbar}
      />
      <View style={styles.container}>
        <FlatList
          data={ratings}
          renderItem={_renderItem}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={() => <Header user={currentUser} />}
        />
      </View>
    </Layout>
  );
}

function Header({ user }) {
  const { t } = useTranslation();
  return (
    <View style={styles.headerContainer}>
      <View>
        <ImageView
          source={{ uri: user?.icon ?? '' }}
          style={styles.headerAvatar}
        />
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.headerName}>{user?.name}</Text>
        <View style={styles.headerBody}>
          <Text style={styles.headerRatingText}>{user?.point_of_evaluate}</Text>
          <AirbnbRating
            showRating={false}
            size={20}
            defaultRating={
              user?.point_of_evaluate
                ? parseInt(user.point_of_evaluate, 10) / 5
                : 0
            }
            count={1}
            isDisabled={true}
          />
        </View>
        <Text>{`${user.amount_of_evaluate} ${t('rating').toLowerCase()}`}</Text>
      </View>
    </View>
  );
}

function RatingItem({ id, user, desc, rating, date }) {
  return (
    <View style={styles.ratingItem}>
      <View>
        <ImageView source={{ uri: user?.icon ?? '' }} style={styles.avatar} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.desc}>{desc}</Text>
        <View style={styles.bottom}>
          <AirbnbRating
            showRating={false}
            size={15}
            defaultRating={rating || 0}
            count={5}
            isDisabled={true}
          />
          <Text style={styles.separate}>|</Text>
          <Text style={styles.time}>
            {`${Utils.getPostTime(moment.unix(date).toDate())}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
