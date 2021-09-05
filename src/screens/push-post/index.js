import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';
import colors from '../../theme/colors';
import styles from './style';
import showPushPostPopup from '../../components/push-post';
import PushPostModel from '../../models/push-post-package';
import Utils from '../../commons/utils';
import apiServices from '../../services';
import FastImage from 'react-native-fast-image';
import { RESPONSE_STATUS } from '../../commons/constants';

const PushPost = ({ componentId, post }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [pushPostPackages, setPushPostPackages] = useState([]);

  useEffect(() => {
    fetchPushPostPackages();
  }, []);

  const onPressPushPackage = ({ item, index }) => {
    setSelectedItemIndex(index);
    showPushPostPopup({
      pushPostItem: item
    });
  };

  const fetchPushPostPackages = async () => {
    var _pushPostPackages = [...pushPostPackages];
    try {
      const response = await apiServices.getPushPostPackages();
      if (response.data.status === RESPONSE_STATUS.OK) {
        _pushPostPackages = response.data.data.map((p) => PushPostModel.clone(p));
      }
      setPushPostPackages(_pushPostPackages);
    } catch (error) {
      console.log('get push post packages error: ', error);
    }
  }

  const renderPushPostItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.pushPostPackage, selectedItemIndex === index ? styles.selectedItem : {}]}
        onPress={() => onPressPushPackage({ item, index })}>
        <View style={styles.pushPostDetails}>
          <Text style={styles.pushPostTitle}>{item.name}</Text>
          <Text style={styles.pushPostPrice}>
            {item.price}/ {item.type}
          </Text>
          <Text style={styles.pushPostDes}>{item.description}</Text>
        </View>
        <View style={styles.pushPostIcon}>
          <FastImage
            style={styles.icon}
            source={{
              uri: item.icon,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}></FastImage>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <ScrollView style={styles.container}>
        <NavBar parentComponentId={componentId} title={t('pushToTop')} />
        <View style={styles.contentView}>
          <View style={styles.postView}>
            <FastImage
              style={styles.postImage}
              source={{
                uri:
                  post.icon,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.postDetails}>
              <Text>
                {post.postTitle}
              </Text>
              <Text style={styles.postTime}>{Utils.parseDate(post.postDate)}</Text>
            </View>
          </View>
          <FlatList
            data={pushPostPackages}
            style={styles.list}
            renderItem={renderPushPostItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={index => index.toString()}
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

export default PushPost;
