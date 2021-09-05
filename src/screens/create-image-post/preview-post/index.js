import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  NavBar,
  Layout,
  PopupDialog,
  UploadProgressView,
} from '../../../components';
import { Navigation } from 'react-native-navigation';
import FastImage from 'react-native-fast-image';
import ImgToBase64 from 'react-native-image-base64';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';

import apiServices from '../../../services';
import { RESPONSE_STATUS } from '../../../commons/constants';
import { STEPS } from '../../create-image-post';
import _ from 'lodash';
import { wp } from '../../../commons/responsive';
import { useDispatch } from 'react-redux';
import {
  setRefreshHomeFlag,
  setRefreshHomeVideoFlag,
} from '../../../redux/store/reducers/bottomTab/action';
import Utils from '../../../commons/utils';

const PreviewPost = ({ componentId, steps, onPostSuccess, onBackToPage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const params = useRef(null);
  const scrollView = useRef(null);

  const onLeftPress = () => {
    Navigation.dismissModal(componentId);
  };

  const onPostPress = async () => {
    const onUploadSuccess = () => {
      onLeftPress();
      if (_.isFunction(onPostSuccess)) {
        onPostSuccess();
      }
    };
    var _requestParams = { ...params.current };
    setIsLoading(true);
    try {
      if (!_.isEmpty(_requestParams.images)) {
        const imagePath =
          (!_requestParams.images[0].path.includes('file://')
            ? 'file://'
            : '') + _requestParams.images[0].path;

        const base64 = await ImgToBase64.getBase64String(imagePath);
        _requestParams.poster = `data:image/${imagePath
          .split('.')
          .pop()};base64,${base64}`;
      }
      const response = await apiServices.createImagePost(_requestParams, e => {
        console.log(e.loaded / e.total);
        setUploadProgress(e.loaded / e.total);
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        Alert.alert(
          t('complete'),
          t('createPostSuccess'),
          [
            {
              text: t('ok'),
              onPress: onUploadSuccess,
            },
          ],
          {
            onDismiss: onUploadSuccess,
          },
        );
        dispatch(setRefreshHomeFlag(true));
        dispatch(setRefreshHomeVideoFlag(true));
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
      setIsLoading(false);
      setUploadProgress(0);
    } catch (error) {
      console.log('POST ERROR: ', JSON.stringify(error));
      Alert.alert(t('error'), t('someThingWentWrong'));
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const onPressEdit = pageIndex => {
    if (_.isFunction(onBackToPage)) {
      onBackToPage(pageIndex);
    }
    onLeftPress();
  };

  const getContentViews = () => {
    var _steps = [...steps];
    var requestParams = {
      price: 0,
      id_category: 0,
      title: '',
      content: '',
      poster: '',
      province: 0,
      district: 0,
      ward: 0,
      images: [],
      features: {},
    };

    var contentViews = [];
    const imageStepIndex = _steps.findIndex(
      step => step.type === STEPS.SELECT_IMAGES,
    );
    if (imageStepIndex > -1) {
      const imageStep = _steps[imageStepIndex];
      contentViews.push(
        <View key={imageStep.type} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(imageStep.pageIndex)}>
            <Text style={styles.sectionTitle}>{imageStep.property.title}</Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <FlatList
            style={{ marginTop: wp(4) }}
            data={imageStep.value}
            renderItem={({ item, index }) => (
              <View style={styles.imageItem}>
                <View style={styles.imageContainer}>
                  <FastImage
                    source={{ uri: item.uri }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>
            )}
            keyExtractor={item => item.path}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>,
      );
      _steps.splice(imageStepIndex, 1);
      requestParams['images'] = imageStep.value;
    }

    const categorySteps = _steps.filter(
      step => step.type === STEPS.SELECT_CATEGORY,
    );
    if (!_.isEmpty(categorySteps)) {
      contentViews.push(
        <View key={STEPS.SELECT_CATEGORY} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() =>
              onPressEdit(categorySteps[categorySteps.length - 1].pageIndex)
            }>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>
            {categorySteps.map(step => step.value.name).join(' > ')}
          </Text>
        </View>,
      );
      _steps = _steps.filter(step => step.type !== STEPS.SELECT_CATEGORY);
      requestParams['id_category'] =
        categorySteps[categorySteps.length - 1].value.id;
    }

    const titleStepIndex = _steps.findIndex(
      step => step.type === STEPS.INPUT_TITLE,
    );
    if (titleStepIndex > -1) {
      const titleStep = _steps[titleStepIndex];
      contentViews.push(
        <View key={titleStep.type} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(titleStep.pageIndex)}>
            <Text style={styles.sectionTitle}>{titleStep.property.title}</Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>{titleStep.value.value}</Text>
        </View>,
      );
      _steps.splice(titleStepIndex, 1);
      requestParams['title'] = titleStep.value.value;
    }

    const descriptionStepIndex = _steps.findIndex(
      step =>
        step.property.items.find(item => item.slug === 'description') !==
        undefined,
    );
    if (descriptionStepIndex > -1) {
      const descriptionStep = _steps[descriptionStepIndex];
      contentViews.push(
        <View
          key={descriptionStep.property.title}
          style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(descriptionStep.pageIndex)}>
            <Text style={styles.sectionTitle}>
              {descriptionStep.property.title}
            </Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>{descriptionStep.value.value}</Text>
        </View>,
      );
      _steps.splice(descriptionStepIndex, 1);
      requestParams['content'] = descriptionStep.value.value;
    }

    const locationStepIndex = _steps.findIndex(
      step => step.type === STEPS.SELECT_LOCATION,
    );
    if (locationStepIndex > -1) {
      const locationStep = _steps[locationStepIndex];
      var locationText = '';
      const featureLocation = locationStep.value.find(
        item => item.property.slug === 'features',
      );

      if (featureLocation) {
        locationText = featureLocation.value;
        requestParams['features'][featureLocation.property.value] =
          featureLocation.value;
      }

      const wardLocation = locationStep.value.find(
        item => item.property.slug === 'ward',
      );
      if (wardLocation) {
        locationText =
          locationText +
          (_.isEmpty(locationText) ? '' : ', ') +
          wardLocation.value.name;
        requestParams['ward'] = wardLocation.value.id;
      }

      const districtLocation = locationStep.value.find(
        item => item.property.slug === 'district',
      );
      if (districtLocation) {
        locationText =
          locationText +
          (_.isEmpty(locationText) ? '' : ', ') +
          districtLocation.value.name;
        requestParams['district'] = districtLocation.value.id;
      }

      const provinceLocation = locationStep.value.find(
        item => item.property.slug === 'province',
      );
      if (provinceLocation) {
        locationText =
          locationText +
          (_.isEmpty(locationText) ? '' : ', ') +
          provinceLocation.value.name;
        requestParams['province'] = provinceLocation.value.id;
      }

      contentViews.push(
        <View key={STEPS.SELECT_LOCATION} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(locationStep.pageIndex)}>
            <Text style={styles.sectionTitle}>
              {locationStep.property.title}
            </Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>{locationText}</Text>
        </View>,
      );
      _steps.splice(locationStepIndex, 1);
    }

    const buySaleStepIndex = _steps.findIndex(
      step => step.type === STEPS.SELECT_BUY_SALE,
    );
    if (buySaleStepIndex > -1) {
      const buySaleStep = _steps[buySaleStepIndex];
      console.log('STEP : ', buySaleStep);
      contentViews.push(
        <View key={buySaleStep.type} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(buySaleStep.pageIndex)}>
            <Text style={styles.sectionTitle}>
              {buySaleStep.property.title}
            </Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>{buySaleStep.value.title}</Text>
        </View>,
      );
      _steps.splice(buySaleStep, 1);
      requestParams['buy_or_sale'] = buySaleStep.value.value;
    }

    const postByStepIndex = _steps.findIndex(
      step => step.type === STEPS.SELECT_POST_BY,
    );
    if (postByStepIndex > -1) {
      const postByStep = _steps[postByStepIndex];
      contentViews.push(
        <View key={postByStep.type} style={styles.sectionContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => onPressEdit(postByStep.pageIndex)}>
            <Text style={styles.sectionTitle}>{postByStep.property.title}</Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="create-outline"
              size={16}
            />
          </TouchableOpacity>
          <Text style={styles.sectionText}>{postByStep.value.title}</Text>
        </View>,
      );
      _steps.splice(postByStepIndex, 1);
      requestParams['post_by'] = postByStep.value.value;
    }

    _steps.forEach(step => {
      if (step.property.slug === 'features') {
        contentViews.push(
          <View key={step.property.title} style={styles.sectionContainer}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => onPressEdit(step.pageIndex)}>
              <Text style={styles.sectionTitle}>{step.property.title}</Text>
              <Ionicons
                style={{ marginLeft: wp(6) }}
                name="create-outline"
                size={16}
              />
            </TouchableOpacity>
            <Text style={styles.sectionText}>
              {_.isArray(step.value)
                ? step.value.map(v => v.title).join(', ')
                : _.isObject(step.value)
                ? step.value.title
                : step.value}
            </Text>
          </View>,
        );
        requestParams['features'][step.property.value] = _.isArray(step.value)
          ? step.value.map(v => v.value).join(', ')
          : _.isObject(step.value)
          ? step.value.value
          : step.value;
      } else if (_.isArray(step.value)) {
        step.value.forEach(feature => {
          if (feature.slug === 'image') {
            contentViews.unshift(
              <View
                key={'image'}
                style={[styles.imageItem, styles.sectionContainer]}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => onPressEdit(step.pageIndex)}>
                  <Text style={styles.sectionTitle}>
                    {step.property.title}
                  </Text>
                  <Ionicons
                    style={{ marginLeft: wp(6) }}
                    name="create-outline"
                    size={16}
                  />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                  <FastImage
                    source={{ uri: feature.selectedItem.uri }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>,
            );
            requestParams['images'] = [feature.selectedItem];
          } else {
            contentViews.push(
              <View key={feature.title} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => onPressEdit(step.pageIndex)}>
                  <Text style={styles.sectionTitle}>{feature.title}</Text>
                  <Ionicons
                    style={{ marginLeft: wp(6) }}
                    name="create-outline"
                    size={16}
                  />
                </TouchableOpacity>
                <Text style={styles.sectionText}>
                  {_.isArray(feature.selectedItem)
                    ? feature.selectedItem.map(item => item.title).join(', ')
                    : _.isObject(feature.selectedItem)
                    ? feature.selectedItem.title
                    : feature.slug === 'price'
                    ? Utils.formatPrice(parseInt(feature.selectedItem))
                    : feature.selectedItem}
                </Text>
              </View>,
            );

            if (feature.slug === 'price') {
              requestParams['price'] = _.isEmpty(feature.selectedItem)
                ? 0
                : feature.selectedItem;
            } else {
              requestParams['features'][feature.value] = _.isArray(
                feature.selectedItem,
              )
                ? feature.selectedItem.map(item => item.value).join(',')
                : _.isObject(feature.selectedItem)
                ? feature.selectedItem.value
                : feature.selectedItem;
            }
          }
        });
      } else if (_.isObject(step.value)) {
        contentViews.push(
          <View key={step.property.title} style={styles.sectionContainer}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => onPressEdit(step.pageIndex)}>
              <Text style={styles.sectionTitle}>{step.property.title}</Text>
              <Ionicons
                style={{ marginLeft: wp(6) }}
                name="create-outline"
                size={16}
              />
            </TouchableOpacity>
            <Text style={styles.sectionText}>
              {_.isObject(step.value)
                ? step.value.title ??
                  (step.value.slug === 'price'
                    ? Utils.formatPrice(parseInt(step.value.value))
                    : step.value.value)
                : step.value}
            </Text>
          </View>,
        );
        if (step.value.slug === 'price') {
          requestParams['price'] = _.isEmpty(step.value.value)
            ? 0
            : step.value.value;
        } else {
          requestParams['features'][step.property.value] = _.isObject(
            step.value,
          )
            ? step.value.value
            : step.value;
        }
      }
    });

    console.log('Params: ', requestParams);
    params.current = requestParams;
    return contentViews;
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.container}>
        <NavBar
          parentComponentId={componentId}
          showCloseButton={false}
          title={t('createImagePostPreviewTitle')}
          onLeftPress={onLeftPress}
        />
        <View style={styles.separator} />
        <ScrollView
          ref={scrollView}
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}>
          {getContentViews()}
        </ScrollView>
        <TouchableOpacity
          style={[styles.buttonPost]}
          disabled={isLoading}
          onPress={() => onPostPress()}>
          <Text style={styles.buttonPostTitle}>
            {t('createImagePostButton')}
          </Text>
        </TouchableOpacity>
        {isLoading && (
          <PopupDialog>
            <UploadProgressView progress={uploadProgress} />
          </PopupDialog>
        )}
      </View>
    </Layout>
  );
};

export default PreviewPost;
