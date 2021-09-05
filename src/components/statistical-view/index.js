import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { styles, POPUP_WIDTH } from './style';
import colors from '../../theme/colors';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../../screens/screens';
import moment from 'moment';
import Utils from '../../commons/utils';
import { RESPONSE_STATUS, POST_TYPE } from '../../commons/constants';
import apiServices from '../../services';
import PostStatisticsModel from '../../models/post-statistics-model';

export default function showStatisticalPopup({
  isClosedOnTouchOutside = true,
  item,
  type,
  componentId,
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <StatisticalView
            componentId={componentId}
            onClose={hideBottomSheet}
            postItem={item}
            type={type}
          />
        ),
        height: 450,
      },
    },
  });
}

const StatisticalView = ({ postItem, type, onClose }) => {
  const { t } = useTranslation();
  const [statisticsDetail, setStatisticsDetail] = useState(null);
  const [popupPosition, setPopupPosition] = useState(0);
  const gradientViewWidth = useRef(0);

  useEffect(() => {
    if (type === POST_TYPE.POST) {
      fetchStatisticsPost();
    } else if (type === POST_TYPE.VIDEO) {
      fetchStatisticsVideo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (statisticsDetail && gradientViewWidth.current) {
      if (statisticsDetail.pageOrder > 1) {
        const pageWidth =
          gradientViewWidth.current / statisticsDetail.totalPage;
        const pos = pageWidth * statisticsDetail.pageOrder - POPUP_WIDTH;
        setPopupPosition(!_.isNaN(pos) ? pos : 0);
      } else {
        setPopupPosition(0);
      }
    }
  }, [statisticsDetail]);

  const fetchStatisticsPost = async () => {
    try {
      const response = await apiServices.getStatisticsPost({
        id: postItem.id,
        id_category: postItem.cateId,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        console.log('###getStatisticsPost - result.data: ', result.data);
        setStatisticsDetail(PostStatisticsModel.clone(result.data));
      }
    } catch (error) {
      console.log('###getStatisticsPost - error: ', error);
    }
  };

  const fetchStatisticsVideo = async () => {
    try {
      const response = await apiServices.getStatisticsVideo({
        id: postItem.id,
        id_category: postItem.parentId,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        console.log('###getStatisticsVideo - result.data: ', result.data);
        setStatisticsDetail(PostStatisticsModel.clone(result.data));
      }
    } catch (error) {
      console.log('###getStatisticsVideo - error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerView}>
          <Text style={styles.screenTitle}>{t('statistical')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons
              name="close-outline"
              size={28}
              color={colors.flatBlack02}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.postView}>
          <FastImage
            style={styles.postImage}
            source={{
              uri: statisticsDetail?.icon,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.postDetails}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.postName}>
              {statisticsDetail?.postTitle}
            </Text>
            {type === POST_TYPE.POST && (
              <View style={styles.priceView}>
                <Text style={styles.price}>
                  {Utils.formatPrice(parseInt(statisticsDetail?.price))}
                </Text>
              </View>
            )}
            <Text style={styles.postTime}>
              {Utils.getPostTime(
                moment.unix(statisticsDetail?.postDate).toDate(),
              )}
            </Text>
          </View>
        </View>
        {statisticsDetail?.province &&
        !_.isEmpty(statisticsDetail?.province) ? (
          <View style={styles.locationView}>
            <Text style={styles.locationTitle}>{t('location')}</Text>
            <Text style={styles.location}>{statisticsDetail?.province}</Text>
          </View>
        ) : null}

        <View style={styles.linearGradientView}>
          <View
            onLayout={e => {
              if (e.nativeEvent.layout.width !== gradientViewWidth.current) {
                gradientViewWidth.current = e.nativeEvent.layout.width;
              }
            }}>
            <ImageBackground
              source={images.icon_page}
              style={[styles.iconPage, { marginLeft: popupPosition }]}
              resizeMode="contain">
              <Text style={styles.page}>
                {t('currentStatisticPage', {
                  page: statisticsDetail?.pageOrder || 1,
                })}
              </Text>
            </ImageBackground>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#41d103', '#fecb00', '#b20217']}
              style={styles.linearGradient}
            />
          </View>
          <View style={styles.pageView}>
            <View style={styles.firstPage}>
              <View style={styles.greenDot} />
              <Text>{t('firstPage')}</Text>
            </View>
            <View style={styles.firstPage}>
              <Text>{t('lastView')}</Text>
              <View style={styles.redDot} />
            </View>
          </View>
        </View>

        <View style={styles.effectView}>
          <Text style={styles.effect}>{t('effect')}</Text>
          <Text style={styles.updateAt}>
            {t('updateAt')}
            {Utils.parseFullDateTime(
              moment.unix(statisticsDetail?.updateAt).toDate(),
            )}
          </Text>
        </View>

        <View style={styles.viewsView}>
          <View style={[styles.viewsContainer, styles.impressionsView]}>
            <Text style={styles.viewTitle}>{t('impressions')}</Text>
            <Text style={styles.view}>
              {Utils.parseInteraction(statisticsDetail?.impressions)}
            </Text>
          </View>
          <View style={styles.viewsContainer}>
            <Text style={styles.viewTitle}>{t('views')}</Text>
            <Text style={styles.view}>
              {Utils.parseInteraction(statisticsDetail?.views)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
