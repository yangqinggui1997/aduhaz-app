import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import RatioButton from '../../../components/ratio-button';
import FastImage from 'react-native-fast-image';
import CheckBox from '../../../components/check-box';
import showListSelectionView from '../../../components/list-selection-view';
import CreatePostInput from '../../../components/create-post-input';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import styles from './styles';
import colors from '../../../theme/colors';
import images from '../../../assets/images';
import { wp } from '../../../commons/responsive';

import _ from 'lodash';
import { checkAndResizeImage } from '../../../commons/image-picker-helper';
import Utils from '../../../commons/utils';

const inputTextControls = ['textbox', 'email', 'number'];
const selectionControls = ['combobox'];

const InputFeaturesView = ({
  componentId,
  property,
  value = [],
  onNext = null,
  onUpdate = null,
}) => {
  const { t } = useTranslation();
  const [features, setFeatures] = useState(value);

  useEffect(() => {
    if (property && value.length === 0) {
      const featuresItem = property.items.filter(
        item =>
          item.slug !== 'switch_form' &&
          item.slug !== null &&
          item.slug !== 'review_post',
      );
      setFeatures(featuresItem);
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate(features);
    }
  }, [features]);

  const onPressedNext = () => {
    if (_.isFunction(onNext)) {
      onNext(features);
    }
  };

  const onPressAddImage = async featureIndex => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        isPreview: false,
        singleSelectedMode: true,
        selectedAssets: [],
      });
      if (response && response.length > 0) {
        const file = response[0];
        if (Utils.isAndroid()) {
          file.path = file.realPath;
          file.filename = file.fileName;
        }
        const resizeImage = await checkAndResizeImage(file);
        var fs = [...features];
        fs[featureIndex].selectedItem = resizeImage;
        setFeatures(fs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isValidData = () => {
    return (
      features.filter(
        feature =>
          feature.selectedItem === null ||
          feature.selectedItem === undefined ||
          feature.selectedItem === '' ||
          (_.isArray(feature.selectedItem) && _.isEmpty(feature.selectedItem)),
      ).length === 0
    );
  };

  const renderFeatureItem = (feature, index) => {
    if (inputTextControls.includes(feature.type_control)) {
      return (
        <View key={feature.title} style={styles.featureItem}>
          <CreatePostInput
            value={
              feature.type_control === 'number'
                ? feature.selectedItem !== null &&
                  feature.selectedItem !== undefined
                  ? `${feature.selectedItem.toString().split(' ')[0]}`
                  : null
                : feature.selectedItem
            }
            title={feature.title.toUpperCase()}
            placeholder={feature.title}
            rightText={feature.title === 'Diện tích' ? 'm2' : ''}
            keyboardNumber={feature.type_control === 'number'}
            onChangeText={text => {
              var fs = [...features];
              fs[index].selectedItem = text;
              setFeatures(fs);
            }}
          />
        </View>
      );
    }
    if (selectionControls.includes(feature.type_control)) {
      return (
        <View key={feature.title} style={styles.featureItem}>
          <CreatePostInput
            value={feature.selectedItem?.title}
            title={feature.title.toUpperCase()}
            placeholder={feature.title}
            type={'selectBox'}
            onPress={() => {
              showListSelectionView({
                title: feature.title,
                items: feature.items.map(item => item.title),
                selectedItem: features[index].selectedItem?.title,
                onSelectedItem: selectedIndex => {
                  var fs = [...features];
                  fs[index].selectedItem = feature.items[selectedIndex];
                  setFeatures(fs);
                },
              });
            }}
          />
        </View>
      );
    }
    if (feature.type_control === 'radio-button') {
      const onSelectedItem = item => {
        var fs = [...features];
        fs[index].selectedItem = item;
        setFeatures(fs);
      };
      return (
        <View key={feature.title} style={styles.featureItem}>
          <Text>{feature.title.toUpperCase()}</Text>
          <View style={styles.listOptions}>
            <FlatList
              data={feature.items}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.listOptionItem}
                  onPress={() => onSelectedItem(item)}>
                  <Text>{item.title}</Text>
                  <RatioButton
                    checked={feature.selectedItem?.value === item.value}
                    onSelected={() => onSelectedItem(item)}
                  />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.listOptionSeparator} />
              )}
              keyExtractor={(_, index) => 'key' + index.toString()}
            />
          </View>
        </View>
      );
    }
    if (feature.type_control === 'checkbox') {
      const onSelectedItem = item => {
        var fs = [...features];
        if (_.isEmpty(fs[index].selectedItem)) {
          fs[index].selectedItem = [item];
        } else {
          const itemIndex = fs[index].selectedItem.findIndex(
            ob => ob.value === item.value,
          );
          if (itemIndex > -1) {
            fs[index].selectedItem.splice(itemIndex, 1);
          } else {
            fs[index].selectedItem.push(item);
          }
        }
        setFeatures(fs);
      };
      return (
        <View key={feature.title} style={styles.featureItem}>
          <Text>{feature.title.toUpperCase()}</Text>
          <View style={styles.listOptions}>
            <FlatList
              data={feature.items}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item.title}
                  style={styles.listOptionItem}
                  onPress={() => onSelectedItem(item)}>
                  <Text>{item.title}</Text>
                  <CheckBox
                    checked={feature.selectedItem?.find(
                      ob => ob.value === item.value,
                    )}
                    onSelected={() => onSelectedItem(item)}
                  />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.listOptionSeparator} />
              )}
              keyExtractor={(_, index) => 'key' + index.toString()}
            />
          </View>
        </View>
      );
    }
    if (feature.slug === 'image') {
      const labelItem = property.items.find(f => f.type_control === 'label');
      return (
        <View
          key={feature.title}
          style={[styles.featureItem, { flexDirection: 'row' }]}>
          {!feature.selectedItem && (
            <TouchableOpacity
              style={styles.imageItem}
              onPress={() => onPressAddImage(index)}>
              <View style={styles.addImageButton}>
                <Image source={images.icon_add_image} />
              </View>
            </TouchableOpacity>
          )}
          {feature.selectedItem && (
            <View key={feature.selectedItem.path} style={styles.imageItem}>
              <View style={styles.imageContainer}>
                <FastImage
                  source={{ uri: feature.selectedItem.uri }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  var fs = [...features];
                  fs[index].selectedItem = undefined;
                  setFeatures(fs);
                }}>
                <Image
                  source={images.icon_minus}
                  style={{ width: 18, height: 18 }}
                />
              </TouchableOpacity>
            </View>
          )}
          {labelItem && (
            <View style={styles.descriptionContainer}>
              <Text>{labelItem.title.replace(/\\u2022/g, '\u2022')}</Text>
            </View>
          )}
        </View>
      );
    }
    return <View key={feature.title}></View>;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, marginBottom: wp(12) }}
        contentContainerStyle={styles.scrollViewContainer}>
        {features.map((feature, index) => renderFeatureItem(feature, index))}
      </ScrollView>
      <TouchableOpacity
        disabled={!isValidData()}
        style={[
          styles.buttonNext,
          !isValidData() ? { backgroundColor: colors.flatGrey11 } : {},
        ]}
        onPress={() => onPressedNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputFeaturesView;
