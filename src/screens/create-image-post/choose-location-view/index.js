import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import CreatePostInput from '../../../components/create-post-input';
import showListSelectionView from '../../../components/list-selection-view';

import styles from './styles';
import colors from '../../../theme/colors';

import apiServices from '../../../services';
import { RESPONSE_STATUS } from '../../../commons/constants';
import LocationModel from '../../../models/location';

import _ from 'lodash';

const ChooseLocationView = ({
  componentId,
  property,
  selectedValue = null,
  onNext,
}) => {
  const { t } = useTranslation();
  const [locationProps, setLocationProps] = useState(null);
  const [inputLocation, setInputLocation] = useState(null);
  const [provinceProps, setProvinceProps] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [districtProps, setdistrictProps] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [wardProps, setWardProps] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    if (property) {
      setLocationProps(property.items.find(item => item.slug === 'features'));
      setInputLocation(null);
      setProvinceProps(property.items.find(item => item.slug === 'province'));
      setSelectedProvince(null);
      setdistrictProps(property.items.find(item => item.slug === 'district'));
      setSelectedDistrict(null);
      setWardProps(property.items.find(item => item.slug === 'ward'));
      setSelectedWard(null);
    }
  }, [property]);

  const onPressNext = () => {
    if (_.isFunction(onNext)) {
      var data = [];
      if (locationProps) {
        data.push({
          property: locationProps,
          value: inputLocation,
        });
      }
      if (provinceProps) {
        data.push({
          property: provinceProps,
          value: selectedProvince,
        });
      }
      if (districtProps) {
        data.push({
          property: districtProps,
          value: selectedDistrict,
        });
      }
      if (wardProps) {
        data.push({
          property: wardProps,
          value: selectedWard,
        });
      }
      onNext(data);
    }
  };

  const onPressProvince = async () => {
    try {
      const response = await apiServices.getLocations({
        id_parent: 0,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        var locationList = result.data.map(obj => LocationModel.clone(obj));
        showListSelectionView({
          title: t('createImagePostSelectProvincePlaceholder'),
          items: locationList.map(l => l.name),
          selectedItem: selectedProvince?.name,
          onSelectedItem: index => {
            setSelectedProvince(locationList[index]);
            setSelectedDistrict(null);
            setSelectedWard(null);
          },
        });
      }
    } catch (error) {}
  };

  const onPressDistrict = async () => {
    try {
      const response = await apiServices.getLocations({
        id_parent: selectedProvince.id,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        var locationList = result.data.map(obj => LocationModel.clone(obj));
        showListSelectionView({
          title: t('createImagePostSelectDistrictPlaceholder'),
          items: locationList.map(l => l.name),
          selectedItem: selectedDistrict?.name,
          onSelectedItem: index => {
            setSelectedDistrict(locationList[index]);
          },
        });
      }
    } catch (error) {}
  };

  const onPressWard = async () => {
    try {
      const response = await apiServices.getLocations({
        id_parent: selectedDistrict.id,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        var locationList = result.data.map(obj => LocationModel.clone(obj));
        showListSelectionView({
          title: t('createImagePostSelectWardPlaceholder'),
          items: locationList.map(l => l.name),
          selectedItem: selectedWard?.name,
          onSelectedItem: index => {
            setSelectedWard(locationList[index]);
          },
        });
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      {locationProps && (
        <CreatePostInput
          style={styles.inputContainer}
          value={inputLocation}
          title={locationProps.title}
          placeholder={locationProps.title}
          onChangeText={text => setInputLocation(text)}
        />
      )}
      {provinceProps && (
        <CreatePostInput
          style={styles.inputContainer}
          value={selectedProvince?.name}
          title={provinceProps.title}
          placeholder={
            provinceProps.place_holder ??
            t('createImagePostSelectProvincePlaceholder')
          }
          type={'selectBox'}
          onPress={() => onPressProvince()}
        />
      )}
      {districtProps && (
        <CreatePostInput
          style={styles.inputContainer}
          value={selectedDistrict?.name}
          title={districtProps.title ?? t('createImagePostSelectDistrict')}
          placeholder={
            districtProps.place_holder ??
            t('createImagePostSelectDistrictPlaceholder')
          }
          type={'selectBox'}
          onPress={() => onPressDistrict()}
          disabled={provinceProps !== null && selectedProvince === null}
        />
      )}
      {wardProps && (
        <CreatePostInput
          style={styles.inputContainer}
          value={selectedWard?.name}
          title={wardProps.title ?? t('createImagePostSelectWard')}
          placeholder={
            wardProps.place_holder ?? t('createImagePostSelectWardPlaceholder')
          }
          type={'selectBox'}
          onPress={() => onPressWard()}
          disabled={districtProps !== null && selectedDistrict === null}
        />
      )}
      <TouchableOpacity
        disabled={
          (provinceProps !== undefined && selectedProvince === null) ||
          (districtProps !== undefined && selectedDistrict === null) ||
          (wardProps !== undefined && selectedWard === null) ||
          (locationProps !== undefined &&
            (inputLocation === null || inputLocation === ''))
        }
        style={[
          styles.buttonNext,
          (provinceProps !== undefined && selectedProvince === null) ||
          (districtProps !== undefined && selectedDistrict === null) ||
          (wardProps !== undefined && selectedWard === null) ||
          (locationProps !== undefined &&
            (inputLocation === null || inputLocation === ''))
            ? { backgroundColor: colors.flatGrey11 }
            : {},
        ]}
        onPress={() => onPressNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseLocationView;
