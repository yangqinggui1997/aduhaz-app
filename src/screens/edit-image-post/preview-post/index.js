import React, { useEffect, useRef, useState } from 'react';
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

import styles from './style';

import apiServices from '../../../services';
import { RESPONSE_STATUS } from '../../../commons/constants';
import { STEPS } from '../../create-image-post';
import _, { result } from 'lodash';
import { wp } from '../../../commons/responsive';
import { useDispatch } from 'react-redux';
import {
  setRefreshHomeFlag,
  setRefreshHomeVideoFlag,
} from '../../../redux/store/reducers/bottomTab/action';
import Utils from '../../../commons/utils';
import PostModel from '../../../models/post';
import { useNavigation } from '../../../hooks';
import Screens from '../../screens';

const inputTextControls = ['textbox', 'email', 'number'];
const selectionControls = ['combobox'];

const PreviewEditPost = ({ componentId, postId, categoryId, onFinishEdit }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [steps, setSteps] = useState([]);
  const params = useRef(null);
  const currentImages = useRef(null);
  const scrollView = useRef(null);

  useEffect(() => {
    console.log('EDIT POST: ', postId, categoryId);
    fetchData();
  }, []);

  const fetchData = async () => {
    const requests = [
      apiServices.getPostById(postId),
      apiServices.getFormsForCreatePost(categoryId),
    ];
    const responses = await Promise.all(requests);
    const results = responses.map(response => response.data);

    if (
      results.length === 2 &&
      results.filter(result => result.status !== RESPONSE_STATUS.OK).length ===
        0
    ) {
      const postDetail = results[0].data;
      const properties = results[1].data;

      currentImages.current = postDetail.images;
      buildStep(PostModel.clone(postDetail), properties);
    }
  };

  const buildStep = (postDetail, properties) => {
    var newSteps = [];
    var locationProperty = {};
    properties.forEach(property => {
      if (property.slug === 'post_by') {
        newSteps.push({
          type: STEPS.SELECT_POST_BY,
          property,
          value: { ...postDetail.postBy, value: postDetail.postBy.id },
          pageIndex: newSteps.length,
        });
      } else if (
        property.items &&
        property.items.find(
          item =>
            item.slug === 'province' ||
            item.slug === 'district' ||
            item.slug === 'ward',
        )
      ) {
        locationProperty = property;
      } else if (
        property.items &&
        property.items.find(item => item.slug === 'image') &&
        _.isEmpty(
          property.items.filter(
            item =>
              item.slug && item.slug !== 'switch_form' && item.slug !== 'image',
          ),
        )
      ) {
        newSteps.push({
          type: STEPS.SELECT_IMAGES,
          property,
          value: postDetail.images.map(image => {
            return {
              uri: image.directory,
              id: image.id,
            };
          }),
          pageIndex: newSteps.length,
        });
      } else if (
        property.items &&
        property.items.find(item => item.slug === 'title')
      ) {
        newSteps.push({
          type: STEPS.INPUT_TITLE,
          property,
          value: { value: postDetail.postTitle },
          pageIndex: newSteps.length,
        });
      } else if (
        property.items &&
        property.items.find(item => item.slug === 'description')
      ) {
        newSteps.push({
          type: STEPS.INPUT_DESCRIPTION,
          property,
          value: { value: postDetail.content },
          pageIndex: newSteps.length,
        });
      } else if (
        property.slug === 'features' ||
        (property.items &&
          property.items.find(item => item.slug === 'features'))
      ) {
        if (
          property.slug === 'features' &&
          property.items.find(item => item.type_control === 'checkbox')
        ) {
          const valueItem = postDetail.properties.find(
            p => parseInt(p.id) === parseInt(property.value),
          );
          const options = property.items.filter(
            item => item.type_control === 'checkbox',
          );
          newSteps.push({
            type: STEPS.INPUT_FEATURES,
            property,
            value: options.filter(o => valueItem.value.includes(o.title)),
            pageIndex: newSteps.length,
          });
        } else if (
          property.slug === 'features' &&
          property.items.find(item => item.type_control === 'radio-button')
        ) {
          const valueItem = postDetail.properties.find(
            p => parseInt(p.id) === parseInt(property.value),
          );
          const options = property.items.filter(
            item => item.type_control === 'radio-button',
          );
          newSteps.push({
            type: STEPS.INPUT_FEATURES,
            property,
            value: options.find(o => o.title === valueItem.value),
            pageIndex: newSteps.length,
          });
        } else {
          var featuresItem = property.items.filter(
            item =>
              item.slug !== 'switch_form' &&
              item.slug !== null &&
              item.slug !== 'review_post',
          );
          featuresItem = featuresItem.map(feature => {
            if (feature.slug === 'price') {
              return {
                ...feature,
                selectedItem: postDetail.price,
              };
            }
            const valueItem = postDetail.properties.find(
              p => parseInt(p.id) === parseInt(feature.value),
            );
            if (inputTextControls.includes(feature.type_control)) {
              return {
                ...feature,
                selectedItem: valueItem.value,
              };
            }
            if (
              selectionControls.includes(feature.type_control) ||
              feature.type_control === 'radio-button'
            ) {
              return {
                ...feature,
                selectedItem: feature.items.find(
                  item => item.title === valueItem.value,
                ),
              };
            }
            if (feature.type_control === 'checkbox') {
              return {
                ...feature,
                selectedItem: feature.items.filter(item =>
                  valueItem.value.includes(item.title),
                ),
              };
            }
            if (feature.slug === 'image') {
              return {
                ...feature,
                selectedItem: {
                  uri: postDetail.images[0].directory,
                  id: postDetail.images[0].id,
                },
              };
            } else {
              return {
                ...feature,
                selectedItem: null,
              };
            }
          });
          newSteps.push({
            type: STEPS.INPUT_FEATURES,
            property,
            value: featuresItem,
            pageIndex: newSteps.length,
          });
        }
      } else if (property.slug === 'buy_or_sale') {
        newSteps.push({
          type: STEPS.SELECT_BUY_SALE,
          property,
          value: postDetail.sellBuy,
          pageIndex: newSteps.length,
        });
      } else if (
        property.items &&
        property.items.find(item => item.slug === 'price')
      ) {
        newSteps.push({
          type: STEPS.INPUT_DESCRIPTION,
          property,
          value: { slug: 'price', value: `${postDetail.price}` },
          pageIndex: newSteps.length,
        });
      }
    });

    newSteps.push({
      type: STEPS.SELECT_CATEGORY,
      property: categoryId,
      value: {
        id: categoryId,
        name: postDetail.categories.map(c => c.name).join(' > '),
      },
      pageIndex: -1,
    });

    newSteps.push({
      type: STEPS.SELECT_LOCATION,
      property: locationProperty,
      value: postDetail.address,
      pageIndex: -1,
    });

    setSteps(newSteps);
  };

  const onPostPress = async () => {
    const onUploadSuccess = () => {
      if (_.isFunction(onFinishEdit)) {
        onFinishEdit();
      }
      onLeftPress();
    };
    var _requestParams = { ...params.current };
    setIsLoading(true);
    try {
      if (!_.isEmpty(_requestParams.images)) {
        var deleteImages = [...currentImages.current];
        _requestParams.images.forEach(image => {
          if (image.id) {
            const index = deleteImages.findIndex(im => im.id === image.id);
            deleteImages.splice(index, 1);
          }
        });
        _requestParams['unlink_images'] = deleteImages.map(im => im.id);
        _requestParams.images = _requestParams.images.filter(
          im => im.id === undefined,
        );

        if (_requestParams.images.length > 0) {
          const imagePath =
            (!_requestParams.images[0].path.includes('file://')
              ? 'file://'
              : '') + _requestParams.images[0].path;
          const base64 = await ImgToBase64.getBase64String(imagePath);
          _requestParams.poster = `data:image/${imagePath
            .split('.')
            .pop()};base64,${base64}`;
        }
      }
      _requestParams['id_post'] = postId;
      const response = await apiServices.updateImagePost(_requestParams, e => {
        console.log(e.loaded / e.total);
        setUploadProgress(e.loaded / e.total);
      });
      const _result = response.data;
      if (_result.status == RESPONSE_STATUS.OK) {
        Alert.alert(
          t('complete'),
          t('updatePostSuccess'),
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
      } else if (_result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: _result.error_code }),
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

  const onLeftPress = () => {
    Navigation.dismissModal(componentId);
  };

  const onPressEdit = pageIndex => {
    navigation.showModal(Screens.EditImagePost, {
      steps,
      pageIndex,
      onEdit: steps => {
        setSteps([...steps]);
      },
    });
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
            keyExtractor={item => item.uri}
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>{t('category')}</Text>
          </View>
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

    const locationStep = _steps.find(
      step => step.type === STEPS.SELECT_LOCATION,
    );
    if (locationStep) {
      contentViews.push(
        <View key={STEPS.SELECT_LOCATION} style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>
              {locationStep.property.title}
            </Text>
          </View>
          <Text style={styles.sectionText}>{locationStep.value}</Text>
        </View>,
      );
    }

    const buySaleStepIndex = _steps.findIndex(
      step => step.type === STEPS.SELECT_BUY_SALE,
    );
    if (buySaleStepIndex > -1) {
      const buySaleStep = _steps[buySaleStepIndex];
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
      if (step.property.slug === 'features' && step.value) {
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
                    {t('createImagePostSelectImages')}
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
              requestParams['price'] = feature.selectedItem;
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

    console.log(requestParams);
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
          {steps.length > 0 && getContentViews()}
        </ScrollView>
        <TouchableOpacity
          style={[styles.buttonPost]}
          disabled={isLoading}
          onPress={() => onPostPress()}>
          <Text style={styles.buttonPostTitle}>
            {t('updateImagePostButton')}
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

export default PreviewEditPost;
