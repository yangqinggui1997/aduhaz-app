import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Dimensions } from 'react-native';
import { NavBar, Layout } from '../../components';
import { Navigation } from 'react-native-navigation';

import ChooseCategoryView from './choose-category-view';
import ChooseImagesView from './choose-images-view';
import ChooseLocationView from './choose-location-view';
import InputTitleView from './input-title-view';
import InputDescriptionView from './input-description-view';
import InputFeaturesView from './input-features-view';
import CheckBoxView from './check-box-view';
import SingleChoiceView from './single-choice-view';
import ChooseOptionView from './choose-option-view';
import PostByView from './post-by-view';

import styles from './styles';

import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import _ from 'lodash';
import Screens from '../screens';
import { useNavigation } from '../../hooks';

export const STEPS = {
  SELECT_CATEGORY: 'SELECT_CATEGORY',
  SELECT_POST_BY: 'SELECT_POST_BY',
  SELECT_BUY_SALE: 'SELECT_BUY_SALE',
  SELECT_LOCATION: 'SELECT_LOCATION',
  SELECT_IMAGES: 'SELECT_IMAGES',
  INPUT_TITLE: 'INPUT_TITLE',
  INPUT_DESCRIPTION: 'INPUT_DESCRIPTION',
  INPUT_FEATURES: 'INPUT_FEATURES',
};

const CreateImagePost = ({ componentId, onCreateSuccess }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [steps, setSteps] = useState([
    { type: STEPS.SELECT_CATEGORY, property: 0, value: null, pageIndex: 0 },
  ]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [properties, setProperties] = useState(null);

  const scrollView = useRef(null);

  useEffect(() => {
    console.log('CURRENT INDEX: ', currentStepIndex);
    scrollView.current.scrollTo({
      x: Dimensions.get('screen').width * currentStepIndex,
      y: 0,
      animated: true,
    });
  }, [currentStepIndex]);

  useEffect(() => {
    if (properties) {
      var newSteps = [...steps];
      properties.forEach(property => {
        if (property.slug === 'post_by') {
          newSteps.push({
            type: STEPS.SELECT_POST_BY,
            property,
            value: null,
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
          newSteps.push({
            type: STEPS.SELECT_LOCATION,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (
          property.items &&
          property.items.find(item => item.slug === 'image') &&
          _.isEmpty(
            property.items.filter(
              item =>
                item.slug &&
                item.slug !== 'switch_form' &&
                item.slug !== 'image',
            ),
          )
        ) {
          newSteps.push({
            type: STEPS.SELECT_IMAGES,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (
          property.items &&
          property.items.find(item => item.slug === 'title')
        ) {
          newSteps.push({
            type: STEPS.INPUT_TITLE,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (
          property.items &&
          property.items.find(item => item.slug === 'description')
        ) {
          newSteps.push({
            type: STEPS.INPUT_DESCRIPTION,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (
          property.slug === 'features' ||
          (property.items &&
            property.items.find(item => item.slug === 'features'))
        ) {
          newSteps.push({
            type: STEPS.INPUT_FEATURES,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (property.slug === 'buy_or_sale') {
          newSteps.push({
            type: STEPS.SELECT_BUY_SALE,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        } else if (
          property.items &&
          property.items.find(item => item.slug === 'price')
        ) {
          newSteps.push({
            type: STEPS.INPUT_DESCRIPTION,
            property,
            value: null,
            pageIndex: newSteps.length,
          });
        }
      });
      setSteps(newSteps);
      setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 200);
    }
  }, [properties]);

  const fetchPropertiesForCreatePost = async categoryId => {
    try {
      const response = await apiServices.getFormsForCreatePost(categoryId);
      const result = response.data;
      console.log('getFormsForCreatePost: ', result);
      if (result.status == RESPONSE_STATUS.OK && !_.isEmpty(result.data)) {
        setProperties(result.data);
      } else {
        console.log('getFormsForCreatePost: ', result);
      }
    } catch (error) {
      console.log('getFormsForCreatePost: ', error);
    }
  };

  const onLeftPress = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      Navigation.dismissModal(componentId);
    }
  };

  const onMoveNextStep = () => {
    setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        onGoToPreview();
      }
    }, 200);
  };

  const onGoToPreview = () => {
    navigation.showModal(Screens.PreviewPost, {
      steps,
      onPostSuccess: () => {
        if (_.isFunction(onCreateSuccess)) {
          onCreateSuccess();
        }
        Navigation.dismissModal(componentId);
      },
      onBackToPage: pageIndex => {
        setCurrentStepIndex(pageIndex);
      },
    });
  };

  const getHeaderTitle = () => {
    console.log('STEPS: ', steps);
    if (currentStepIndex >= steps.length) {
      return '';
    }
    const step = steps[currentStepIndex];
    if (step.type === STEPS.SELECT_CATEGORY) {
      return t('createImagePostChooseCategoryTitle');
    }
    return step.property?.title ?? '';
  };

  const getConentViews = () => {
    var contentViews = [];
    steps.forEach((step, index) => {
      if (step.type === STEPS.SELECT_CATEGORY) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <ChooseCategoryView
              parentId={step.property}
              onSelectCategory={(category, hasSubCategories) => {
                var newSteps = [...steps];
                newSteps[index].value = category;
                if (currentStepIndex < newSteps.length - 1) {
                  newSteps.splice(
                    currentStepIndex + 1,
                    newSteps.length - 1 - currentStepIndex,
                  );
                }
                if (hasSubCategories) {
                  newSteps.push({
                    type: STEPS.SELECT_CATEGORY,
                    property: category.id,
                    value: null,
                    pageIndex: newSteps.length,
                  });
                } else {
                  fetchPropertiesForCreatePost(category.id);
                }
                setSteps(newSteps);
                setTimeout(() => setCurrentStepIndex(newSteps.length - 1), 200);
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.SELECT_POST_BY) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <PostByView
              property={step.property}
              onNext={option => {
                var newSteps = [...steps];
                newSteps[index].value = option;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.SELECT_LOCATION) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <ChooseLocationView
              property={step.property}
              onNext={data => {
                var newSteps = [...steps];
                newSteps[index].value = data;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.SELECT_IMAGES) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <ChooseImagesView
              property={step.property}
              onNext={images => {
                var newSteps = [...steps];
                newSteps[index].value = images;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.INPUT_TITLE) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <InputTitleView
              property={step.property}
              onNext={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.INPUT_DESCRIPTION) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <InputDescriptionView
              property={step.property}
              onNext={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.INPUT_FEATURES) {
        if (
          step.property.slug === 'features' &&
          step.property.items.find(item => item.type_control === 'checkbox')
        ) {
          contentViews.push(
            <View key={step.type + index} style={styles.childContainer}>
              <CheckBoxView
                property={step.property}
                onNext={options => {
                  var newSteps = [...steps];
                  newSteps[index].value = options;
                  setSteps(newSteps);
                  onMoveNextStep();
                }}
              />
            </View>,
          );
        } else if (
          step.property.slug === 'features' &&
          step.property.items.find(item => item.type_control === 'radio-button')
        ) {
          contentViews.push(
            <View key={step.type + index} style={styles.childContainer}>
              <ChooseOptionView
                property={step.property}
                onNext={option => {
                  var newSteps = [...steps];
                  newSteps[index].value = option;
                  setSteps(newSteps);
                  onMoveNextStep();
                }}
              />
            </View>,
          );
        } else {
          contentViews.push(
            <View key={step.type + index} style={styles.childContainer}>
              <InputFeaturesView
                property={step.property}
                onNext={features => {
                  var newSteps = [...steps];
                  newSteps[index].value = features;
                  setSteps(newSteps);
                  onMoveNextStep();
                }}
              />
            </View>,
          );
        }
      } else if (step.type === STEPS.SELECT_BUY_SALE) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <SingleChoiceView
              property={step.property}
              onNext={option => {
                var newSteps = [...steps];
                newSteps[index].value = option;
                setSteps(newSteps);
                onMoveNextStep();
              }}
            />
          </View>,
        );
      }
    });
    return contentViews;
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.container}>
        <NavBar
          parentComponentId={componentId}
          showCloseButton={currentStepIndex === 0}
          title={getHeaderTitle()}
          onLeftPress={onLeftPress}
        />
        <View style={styles.separator} />
        <ScrollView
          ref={scrollView}
          style={styles.scrollContainer}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}>
          {getConentViews()}
        </ScrollView>
      </View>
    </Layout>
  );
};

export default CreateImagePost;
