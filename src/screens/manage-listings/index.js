import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Share,
  Toast,
  RefreshControl,
  Alert,
} from 'react-native';
import Screens from '../../screens/screens';
import { useTranslation } from 'react-i18next';
import UserPostModel from '../../models/user-post';
import FastImage from 'react-native-fast-image';
import {
  NavBar,
  showMenuPostSelection,
  Layout,
  showStatisticalPopup,
  showMenuHidePost,
  ProfileView,
  ImagePost,
} from '../../components';
import { useNavigation } from '../../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MENU } from '../../commons/app-data';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';
import Colors from '../../theme/colors';
import styles from './style';
import RechargePackage from '../../components/recharge-package';
import apiServices from '../../services';
import {
  USER_POST_PER_PAGE,
  POST_MENU_TYPE,
  RESPONSE_STATUS,
  POST_TYPE,
} from '../../commons/constants';
import _ from 'lodash';
import Utils from '../../commons/utils';
import moment from 'moment';
import { wp } from '../../commons/responsive';

const ManageListings = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(true);

  const [salingPost, setSalingPost] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });
  const [deniedPost, setDeniedPost] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });
  const [needToPayPost, setNeedToPayPost] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });
  const [hiddenPost, setHiddenPost] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });
  const [otherPost, setOtherPost] = useState({
    data: [],
    currentPage: 1,
    total: 0,
  });

  const [tabData, setTabData] = useState([]);
  const filterTab = [
    { title: t('on_sale_tab'), quantity: salingPost.total, id: 1 },
    { title: t('denied_tab'), quantity: deniedPost.total, id: 2 },
    {
      title: t('payment_required_tab'),
      quantity: needToPayPost.total,
      id: 3,
    },
    {
      title: t('private_message_tab'),
      quantity: hiddenPost.total,
      id: 4,
    },
    { title: t('other_tab'), quantity: otherPost.total, id: 5 },
  ];

  const handleLoadMore = () => {
    switch (selectedTabIndex) {
      case 1:
        if (deniedPost.data.length < deniedPost.total) {
          fetchDeniPosts();
        }
        break;
      case 2:
        if (needToPayPost.data.length < needToPayPost.total) {
          fetchNeedToPayPosts();
        }
        break;
      case 3:
        if (hiddenPost.data.length < hiddenPost.total) {
          fetchHiddenPosts();
        }
        break;
      case 4:
        if (otherPost.data.length < otherPost.total) {
          fetchOtherPosts();
        }
        break;
      default:
        if (salingPost.data.length < salingPost.total) {
          fetchSalingPosts();
        }
        break;
    }
  };

  const onRefresh = () => {
    setSalingPost({
      data: [],
      currentPage: 1,
      total: 0,
    });
    setDeniedPost({
      data: [],
      currentPage: 1,
      total: 0,
    });
    setNeedToPayPost({
      data: [],
      currentPage: 1,
      total: 0,
    });
    setHiddenPost({
      data: [],
      currentPage: 1,
      total: 0,
    });
    setOtherPost({
      data: [],
      currentPage: 1,
      total: 0,
    });
    setNeedRefresh(true);
  };

  useEffect(() => {
    if (needRefresh) {
      fetchSalingPosts();
      fetchDeniPosts();
      fetchNeedToPayPosts();
      fetchHiddenPosts();
      fetchOtherPosts();
      setNeedRefresh(false);
    }
  }, [needRefresh]);

  const showPost = async item => {
    try {
      const response = await apiServices.showPost({
        id_post: item.id,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  const deletePost = async item => {
    try {
      const response = await apiServices.deletePost(item.id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error - deletePost: ', error);
    }
  };

  const fetchSalingPosts = async () => {
    var _salingPosts = [...salingPost.data];
    try {
      const response = await apiServices.getSalingPost({
        page: salingPost.currentPage,
        post_per_page: USER_POST_PER_PAGE.POST,
      });
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        if (salingPost.currentPage === 1) {
          _salingPosts = response.data.data.map(p => UserPostModel.clone(p));
        } else {
          _salingPosts = _salingPosts.concat(
            response.data.data.map(p => UserPostModel.clone(p)),
          );
        }
        setSalingPost({
          data: _salingPosts,
          currentPage: salingPost.currentPage + 1,
          total: response.data.total,
        });
        setTabData(_salingPosts);
      }
    } catch (error) {}
  };

  const fetchDeniPosts = async () => {
    var _deniedPosts = [...deniedPost.data];
    try {
      const response = await apiServices.getDenyPost({
        page: deniedPost.currentPage,
        post_per_page: USER_POST_PER_PAGE.POST,
      });
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        if (deniedPost.currentPage === 1) {
          _deniedPosts = response.data.data.map(p => UserPostModel.clone(p));
        } else {
          _deniedPosts = _deniedPosts.concat(
            response.data.data.map(p => UserPostModel.clone(p)),
          );
        }
        setDeniedPost({
          data: _deniedPosts,
          currentPage: deniedPost.currentPage + 1,
          total: response.data.total,
        });
        if (selectedTabIndex === 1) {
          setTabData(_deniedPosts);
        }
      }
    } catch (error) {}
  };

  const fetchNeedToPayPosts = async () => {
    var _needToPayPosts = [...needToPayPost.data];
    try {
      const response = await apiServices.getNeedToPay({
        page: needToPayPost.currentPage,
        post_per_page: USER_POST_PER_PAGE.POST,
      });
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        if (needToPayPost.currentPage === 1) {
          _needToPayPosts = response.data.data.map(p => UserPostModel.clone(p));
        } else {
          _needToPayPosts = _needToPayPosts.concat(
            response.data.data.map(p => UserPostModel.clone(p)),
          );
        }
        setNeedToPayPost({
          data: _needToPayPosts,
          currentPage: needToPayPost.currentPage + 1,
          total: response.data.total,
        });
        if (selectedTabIndex === 2) {
          setTabData(_needToPayPosts);
        }
      }
    } catch (error) {}
  };

  const fetchHiddenPosts = async () => {
    var _hiddenPosts = [...hiddenPost.data];
    try {
      const response = await apiServices.getHidden({
        page: hiddenPost.currentPage,
        post_per_page: USER_POST_PER_PAGE.POST,
      });
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        if (hiddenPost.currentPage === 1) {
          _hiddenPosts = response.data.data.map(p => UserPostModel.clone(p));
        } else {
          _hiddenPosts = _hiddenPosts.concat(
            response.data.data.map(p => UserPostModel.clone(p)),
          );
        }
        setHiddenPost({
          data: _hiddenPosts,
          currentPage: hiddenPost.currentPage + 1,
          total: response.data.total,
        });
        if (selectedTabIndex === 3) {
          setTabData(_hiddenPosts);
        }
      }
    } catch (error) {}
  };

  const fetchOtherPosts = async () => {
    var _otherPosts = [...otherPost.data];
    try {
      const response = await apiServices.getOther({
        page: otherPost.currentPage,
        post_per_page: USER_POST_PER_PAGE.POST,
      });
      if (response.data.status == RESPONSE_STATUS.OK && response.data) {
        if (otherPost.currentPage === 1) {
          _otherPosts = response.data.data.map(p => UserPostModel.clone(p));
        } else {
          _otherPosts = _otherPosts.concat(
            response.data.data.map(p => UserPostModel.clone(p)),
          );
        }
        setOtherPost({
          data: _otherPosts,
          currentPage: otherPost.currentPage + 1,
          total: response.data.total,
        });
        if (selectedTabIndex === 4) {
          setTabData(_otherPosts);
        }
      }
    } catch (error) {}
  };

  const onPressPushToTop = ({ item }) => {
    navigation.push(Screens.PushPost, { post: item });
  };

  const onPressStatistical = ({ item }) => {
    showStatisticalPopup({
      item: item,
      type: POST_TYPE.POST,
    });
  };

  const onPressShare = async item => {
    try {
      const urlShare = item.shareLink;
      await Share.share({
        message: `${t('post_menu_share')} : ${urlShare}`,
        url: urlShare,
      });
    } catch (error) {
      Toast(error.message);
    }
  };

  const onPressTab = index => {
    setSelectedTabIndex(index);
    switch (index) {
      case 1:
        setTabData(deniedPost.data);
        break;
      case 2:
        setTabData(needToPayPost.data);
        break;
      case 3:
        setTabData(hiddenPost.data);
        break;
      case 4:
        setTabData(otherPost.data);
        break;
      default:
        setTabData(salingPost.data);
        break;
    }
  };

  const onPressMenuButton = ({ item }) => {
    showMenuPostSelection({
      data: selectedTabIndex === 0 ? MENU.itemSalingMenu : MENU.itemHiddenMenu,
      onSelectedItem: menuItem => {
        switch (menuItem.type) {
          case POST_MENU_TYPE.SHARE:
            setTimeout(() => onPressShare(item), 200);
            break;
          case POST_MENU_TYPE.EDIT:
            navigation.showModal(Screens.PreviewEditPost, {
              postId: item.id,
              categoryId: item.cateId,
              onFinishEdit: () => {
                onRefresh();
              },
            });
            break;
          case POST_MENU_TYPE.HIDE:
            showMenuHidePost({
              item: item,
              onFinish: () => {
                onRefresh();
              },
            });
            break;
          case POST_MENU_TYPE.SHOW:
            showPost(item);
            break;
          case POST_MENU_TYPE.DELETE:
            deletePost(item);
            break;
          default:
            break;
        }
      },
    });
  };

  const renderFilterTab = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressTab(index)}
        style={[
          styles.tab,
          selectedTabIndex === index ? styles.selectedTab : {},
        ]}>
        <Text
          style={
            selectedTabIndex === index
              ? styles.selectedTabTitle
              : styles.tabTitle
          }>
          {item.title.toUpperCase()}
        </Text>
        <Text
          style={
            selectedTabIndex === index
              ? styles.selectedTabTitle
              : styles.tabTitle
          }>
          ({item.quantity})
        </Text>
      </TouchableOpacity>
    );
  };

  const openPostDetailScreen = post => {
    navigation.showModal(Screens.PostDetail, { postInfo: post });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => openPostDetailScreen(item)}
        style={[styles.itemContainer]}>
        <View>
          <ImagePost
            item={item}
            onPressItem={() => openPostDetailScreen(item)}
            titleStyle={{ marginRight: 40 }}
          />
          <TouchableOpacity
            style={styles.menu}
            onPress={() => onPressMenuButton({ item })}>
            <Ionicons
              name={images.ionicons_menu}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContent}>
          {selectedTabIndex !== 1 && selectedTabIndex !== 4 ? (
            <TouchableOpacity
              style={styles.pushToTopView}
              onPress={() => onPressPushToTop({ item })}>
              <Text style={styles.pushToTop}>{t('pushToTop')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.pushToTopView} onPress={item => {}}>
              <Text style={styles.pushToTop}>{t('post_edit')}</Text>
            </TouchableOpacity>
          )}

          {/*Chart View*/}
          {selectedTabIndex !== 1 && selectedTabIndex !== 4 ? (
            <View style={styles.chartView}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => onPressStatistical({ item })}>
                <Icon
                  name={images.icon_chart}
                  size={20}
                  color={Colors.flatGrey03}
                />
                <Text style={styles.statistical}>{t('statistical')}</Text>
              </TouchableOpacity>
              <Text style={styles.time}>
                {Utils.getPostTime(moment.unix(item.postDate).toDate())}
              </Text>
            </View>
          ) : (
            <Text style={styles.missingInfo}>{t('missingInfo')}</Text>
          )}
        </View>
        {index % 2 === 0 && index === tabData.length - 1 ? null : (
          <View style={styles.bottomSeparator} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <View style={styles.container}>
        <NavBar parentComponentId={componentId} title={t('managePost')} />
        <FlatList
          data={tabData}
          style={styles.list}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                onRefresh();
              }}
              refreshing={isRefreshing}
            />
          }
          numColumns={2}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={
            <>
              <ProfileView componentId={componentId} />
              {/*Filter View*/}
              <FlatList
                data={filterTab}
                style={styles.listFilter}
                numColumns={3}
                renderItem={renderFilterTab}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                bounces={false}
              />
            </>
          }
          ListFooterComponent={
            <View>
              {tabData.length % 2 !== 0 && (
                <View style={styles.bottomSeparator} />
              )}
              <RechargePackage style={styles.rechargePackage} />
            </View>
          }
          onEndReachedThreshold={0}
          onEndReached={handleLoadMore}
        />
      </View>
    </Layout>
  );
};

export default ManageListings;
