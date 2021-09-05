import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout } from '../../components';
import FavoritePostModel from '../../models/favorite-post';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import styles from './style';
import VideoPost from '../../components/video-post';

const FavoriteVideo = ({ componentId }) => {
  const { t } = useTranslation();

  const scrollViewRef = useRef();

  const [videoPosts, setVideoPosts] = useState({
    data: [],
    currentPage: 0,
  });

  useEffect(() => {
    fetchFavoriteVideoPosts();
  }, [videoPosts.currentPage]);

  const onRefresh = () => {
    setVideoPosts({
      data: [],
      currentPage: 0,
    });
  };

  const handleLoadMore = () => {
    setVideoPosts({
      data: videoPosts.data,
      currentPage: videoPosts.currentPage + 1,
    });
  };

  const fetchFavoriteVideoPosts = async () => {
    var _videoPosts = [...videoPosts.data];
    try {
      const response = await apiServices.getFavoriteVideoPosts({
        page: videoPosts.currentPage === 0 ? 1 : videoPosts.currentPage,
        post_per_page: 6,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (videoPosts.currentPage <= 1) {
          _videoPosts = response.data.data.map(obj =>
            FavoritePostModel.clone(obj),
          );
          setVideoPosts({
            data: _videoPosts,
            currentPage: 1,
          });
        } else {
          _videoPosts = _videoPosts.concat(
            response.data.data.map(obj => FavoritePostModel.clone(obj)),
          );
          setVideoPosts({
            data: _videoPosts,
            currentPage: videoPosts.currentPage,
          });
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('favoriteVideo')} />
      <View style={styles.contentView}>
        <FlatList
          data={videoPosts.data}
          style={styles.list}
          renderItem={({ item, index }) => <VideoPost componentId={componentId} item={item} onFinish={onRefresh} />}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
        />
      </View>
    </Layout>
  );
};

export default FavoriteVideo;
