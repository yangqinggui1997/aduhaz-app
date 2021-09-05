import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { NavBar, Layout } from '../../components';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ChooseImagesView from '../create-image-post/choose-images-view';
import InputTitleView from '../create-image-post/input-title-view';
import InputDescriptionView from '../create-image-post/input-description-view';
import InputFeaturesView from '../create-image-post/input-features-view';
import CheckBoxView from '../create-image-post/check-box-view';
import SingleChoiceView from '../create-image-post/single-choice-view';
import ChooseOptionView from '../create-image-post/choose-option-view';
import PostByView from '../create-image-post/post-by-view';

import styles from './style';

import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import _ from 'lodash';
import Screens from '../screens';
import { useNavigation } from '../../hooks';
import PostModel from '../../models/post';
import { STEPS } from '../create-image-post';

const EditImagePost = ({ componentId, onEdit, ...props }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const scrollView = useRef(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState(props.steps);

  useEffect(() => {
    setTimeout(() => setCurrentStepIndex(props.pageIndex), 0);
  }, []);

  useEffect(() => {
    scrollView.current.scrollTo({
      x: Dimensions.get('screen').width * currentStepIndex,
      y: 0,
      animated: true,
    });
  }, [currentStepIndex]);

  const onLeftPress = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      Navigation.dismissModal(componentId);
    }
  };

  const onMoveNextStep = () => {
    setTimeout(() => {
      if (
        currentStepIndex <
        steps.filter(step => step.pageIndex >= 0).length - 1
      ) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        onFinishEdit();
      }
    }, 200);
  };

  const onFinishEdit = () => {
    if (_.isFunction(onEdit)) {
      onEdit(steps);
    }
    Navigation.dismissModal(componentId);
  };

  const getHeaderTitle = () => {
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
      if (step.type === STEPS.SELECT_POST_BY) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <PostByView
              property={step.property}
              selectedValue={step.value}
              onNext={option => {
                var newSteps = [...steps];
                newSteps[index].value = option;
                setSteps(newSteps);
                onMoveNextStep();
              }}
              onUpdate={option => {
                var newSteps = [...steps];
                newSteps[index].value = option;
                setSteps(newSteps);
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.SELECT_IMAGES) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <ChooseImagesView
              property={step.property}
              images={step.value}
              onNext={images => {
                var newSteps = [...steps];
                newSteps[index].value = images;
                setSteps(newSteps);
                onMoveNextStep();
              }}
              onUpdate={images => {
                var newSteps = [...steps];
                newSteps[index].value = images;
                setSteps(newSteps);
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.INPUT_TITLE) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <InputTitleView
              property={step.property}
              value={step.value}
              onNext={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
                onMoveNextStep();
              }}
              onUpdate={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
              }}
            />
          </View>,
        );
      } else if (step.type === STEPS.INPUT_DESCRIPTION) {
        contentViews.push(
          <View key={step.type + index} style={styles.childContainer}>
            <InputDescriptionView
              property={step.property}
              value={step.value}
              onNext={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
                onMoveNextStep();
              }}
              onUpdate={value => {
                var newSteps = [...steps];
                newSteps[index].value = value;
                setSteps(newSteps);
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
                selectedValue={step.value}
                onNext={options => {
                  var newSteps = [...steps];
                  newSteps[index].value = options;
                  setSteps(newSteps);
                  onMoveNextStep();
                }}
                onUpdate={options => {
                  var newSteps = [...steps];
                  newSteps[index].value = options;
                  setSteps(newSteps);
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
                value={step.value}
                onNext={features => {
                  var newSteps = [...steps];
                  newSteps[index].value = features;
                  setSteps(newSteps);
                  onMoveNextStep();
                }}
                onUpdate={features => {
                  var newSteps = [...steps];
                  newSteps[index].value = features;
                  setSteps(newSteps);
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
              selectedValue={step.value}
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
          accessoryRight={() => (
            <TouchableOpacity onPress={() => onFinishEdit()}>
              <Ionicons name="eye" size={24} />
            </TouchableOpacity>
          )}
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

export default EditImagePost;
