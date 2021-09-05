import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import colors from '../../theme/colors';
import Screens from '../../screens/screens';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import LocationModel from '../../models/location';
import images from '../../assets/images';
import { useTranslation } from 'react-i18next';

export default function showLocationSelectionView({
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
  data = null,
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
          <LocationSelectionView
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
          />
        ),
        height: 400,
      },
    },
  });
}

const LocationSelectionView = ({ onClose, onSelectedItem, ...props }) => {
  const { t } = useTranslation();

  const [currentList, setCurrentList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetchLocatios(0);
  }, []);

  const fetchLocatios = async parentId => {
    try {
      const response = await apiServices.getLocations({
        id_parent: parentId,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        var locationList = [];
        if (parentId === 0) {
          locationList.push({ name: t('filterAllLocation') });
        } else {
          locationList.push({ name: t('filterAll') });
        }
        setCurrentList(
          locationList.concat(result.data.map(obj => LocationModel.clone(obj))),
        );
      }
    } catch (error) {}
  };

  const onPressClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSelectOption = index => {
    const selectedLocation = currentList[index];
    if (selectedLocation.id == null) {
      if (selectedCity == null) {
        if (_.isFunction(onSelectedItem)) {
          onSelectedItem(selectedLocation);
          onPressClose();
        }
      } else {
        if (_.isFunction(onSelectedItem)) {
          onSelectedItem(selectedCity);
          onPressClose();
        }
      }
    } else {
      if (selectedCity == null) {
        setSelectedCity(selectedLocation);
        fetchLocatios(selectedLocation.id);
      } else {
        if (_.isFunction(onSelectedItem)) {
          onSelectedItem(selectedLocation);
          onPressClose();
        }
      }
    }
  };

  const onPressBack = () => {
    setSelectedCity(null);
    fetchLocatios(0);
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => onSelectOption(index)}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={12}
          color={colors.flatGrey05}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {selectedCity && (
          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Ionicons
              name={'arrow-back-outline'}
              size={26}
              color={colors.flatGrey05}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{t('searchFilterLocationTitle')}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
          <Ionicons name={'close'} size={26} color={colors.flatGrey05} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchInputContainer}>
        <Ionicons
          name={images.ionicons_search}
          size={22}
          color={colors.flatBlack02}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={selectedCity ? t('searchDistrictPlaceholder') : t('searchCityPlaceholder')}
          value={searchText}
          returnKeyType="search"
          onChangeText={text => setSearchText(text)}
        />
      </View>

      <FlatList
        data={currentList.filter(l => l.name.includes(searchText))}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};

LocationSelectionView.propTypes = {};
