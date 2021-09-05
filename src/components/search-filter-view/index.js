import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigation } from 'react-native-navigation';

import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppSlider from '../slider';
import RatioButton from '../ratio-button';
import CheckBox from '../check-box';
import FastImage from 'react-native-fast-image';

import styles from './styles';
import { wp } from '../../commons/responsive';

import apiServices from '../../services';
import { FILTER_CONTROL_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import FilterGroupModel from '../../models/filter';

import _ from 'lodash';
import Utils from '../../commons/utils';
import Screens from '../../screens/screens';
import colors from '../../theme/colors';

export default function showFilterSelectionView({
  onApply = null,
  category = null,
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
  filters = [],
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
          <SearchFilterView
            filters={filters}
            onApply={onApply}
            category={category}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
          />
        ),
        height: 480,
      },
    },
  });
}

const SearchFilterView = ({
  category,
  onClose,
  onApply,
  filters = [],
  ...props
}) => {
  const { t } = useTranslation();

  const [filterGroups, setFilterGroups] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(filters);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await apiServices.getPropertiesForFilter({
        id: category ? category.id : 0,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        setFilterGroups(result.data.map(obj => FilterGroupModel.clone(obj)));
      } else {
        onCloseFilter();
      }
    } catch (error) {
      console.log('GET FILTERS: ', error);
      onCloseFilter();
    }
  };

  const onCloseFilter = () => {
    if (onClose) {
      onClose();
    }
  };

  const onResetFilter = () => {
    setSelectedFilters([]);
  };

  const onApplyFilter = () => {
    if (onApply) {
      onApply(selectedFilters);
    }
    onCloseFilter();
  };

  const onSelectOption = (sectionIndex, index) => {
    const filterGroup = filterGroups[sectionIndex];
    var selectedGroupIndex = selectedFilters.findIndex(
      f => f.id === filterGroup.id,
    );
    if (selectedGroupIndex >= 0) {
      const value = filterGroup.childs[index].id;
      var selectedGroup = { ...selectedFilters[selectedGroupIndex] };
      var groups = [...selectedFilters];
      if (filterGroup.controlType === FILTER_CONTROL_TYPE.CHECK_BOX) {
        const valueIndex = selectedGroup.value.indexOf(value);
        if (valueIndex >= 0) {
          selectedGroup.value.splice(valueIndex, 1);
        } else {
          selectedGroup.value.push(value);
        }
        groups[selectedGroupIndex] = selectedGroup;
      } else if (filterGroup.controlType === FILTER_CONTROL_TYPE.RADIO_BUTTON) {
        selectedGroup.value = [value];
        groups[selectedGroupIndex] = selectedGroup;
      }
      setSelectedFilters(groups.filter(g => !_.isEmpty(g.value)));
    } else {
      selectedGroup = {
        id: filterGroup.id,
        slug: filterGroup.slug,
        value: [filterGroup.childs[index].id],
      };
      var groups = [...selectedFilters];
      groups.push(selectedGroup);
      setSelectedFilters(groups);
    }
  };

  const onUpdateRangeValue = (sectionIndex, min, max) => {
    const filterGroup = filterGroups[sectionIndex];
    var selectedGroups = [...selectedFilters];
    const groupIndex = selectedGroups.findIndex(
      g => g.slug === filterGroup.slug,
    );
    const group = {
      slug: filterGroup.slug,
      value: { min, max },
    };
    if (groupIndex < 0) {
      selectedGroups.push(group);
      setSelectedFilters(selectedGroups);
    } else {
      if (
        selectedGroups[groupIndex].value.min != min ||
        selectedGroups[groupIndex].value.max != max
      ) {
        selectedGroups[groupIndex] = group;
        setSelectedFilters(selectedGroups);
      }
    }
  };

  const renderFilterItem = (item, index, sectionIndex, multipleChoice) => {
    const selectedGroup = selectedFilters.find(
      g => g.id === filterGroups[sectionIndex].id,
    );
    return (
      <View style={styles.filterItem}>
        <View style={{ flexDirection: 'row' }}>
          <FastImage
            style={{ width: 16, height: 16 }}
            source={{
              uri: item.icon,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.filterItemText}>{item.name}</Text>
        </View>
        {!multipleChoice && (
          <RatioButton
            checked={selectedGroup && selectedGroup.value.includes(item.id)}
            onSelected={() => onSelectOption(sectionIndex, index)}
          />
        )}
        {multipleChoice && (
          <CheckBox
            checked={selectedGroup && selectedGroup.value.includes(item.id)}
            onSelected={() => onSelectOption(sectionIndex, index)}
          />
        )}
      </View>
    );
  };

  const renderFilterSection = (section, sectionIndex) => {
    if (section.controlType === FILTER_CONTROL_TYPE.RANGE) {
      const selectedGroup = selectedFilters.find(
        g => g.slug === filterGroups[sectionIndex].slug,
      );
      return (
        <View>
          <Text style={styles.sectionTitle}>{`${section.name || ''} ${t(
            'from',
          )} ${
            selectedGroup
              ? Utils.formatNumber(parseInt(selectedGroup.value.min))
              : Utils.formatNumber(parseInt(section.min))
          } ${t('to')} ${
            selectedGroup
              ? Utils.formatNumber(parseInt(selectedGroup.value.max))
              : Utils.formatNumber(parseInt(section.max))
          }+`}</Text>
          <AppSlider
            style={{
              marginTop: wp(10),
              marginHorizontal: wp(12),
            }}
            rangeSlider={true}
            min={section.min}
            max={section.max}
            selectedMin={selectedGroup ? selectedGroup.value.min : section.min}
            selectedMax={selectedGroup ? selectedGroup.value.max : section.max}
            step={1}
            onValueChanged={(low, high, _) => {
              onUpdateRangeValue(sectionIndex, low, high);

              console.log(`SLIDER CHANGED: ${low} ${high}`);
            }}
          />
        </View>
      );
    } else if (
      section.controlType === FILTER_CONTROL_TYPE.TEXT_BOX ||
      section.controlType === FILTER_CONTROL_TYPE.NUMBER
    ) {
      const selectedGroup = selectedFilters.find(g => g.id === section.id);

      return (
        <View>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          <TextInput
            style={{
              height: wp(34),
              marginTop: wp(8),
              marginHorizontal: wp(12),
              paddingHorizontal: wp(12),
              borderRadius: wp(5),
              borderWidth: 1,
              borderColor: colors.flatGrey11,
            }}
            value={selectedGroup?.value}
            placeholder={section.name}
            placeholderTextColor={colors.flatGrey11}
            onChangeText={text => {
              var _selectedFilters = [...selectedFilters];
              if (selectedGroup) {
                const selectedGroupIndex = _selectedFilters.findIndex(
                  g => g.id === section.id,
                );
                _selectedFilters[selectedGroupIndex].value = text;
              } else {
                _selectedFilters.push({
                  id: section.id,
                  slug: section.slug,
                  value: text,
                });
              }
              setSelectedFilters(_selectedFilters);
            }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          <FlatList
            style={styles.listOptions}
            data={section.childs}
            renderItem={({ item, index }) => (
              <View key={index.toString}>
                {renderFilterItem(
                  item,
                  index,
                  sectionIndex,
                  section.controlType === FILTER_CONTROL_TYPE.CHECK_BOX,
                )}
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.listOptionsSeparator} />
            )}
            keyExtractor={(_, index) => 'key' + index.toString()}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCloseFilter}>
          <Ionicons name={'close'} size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('searchFilterTitle')}</Text>
        <TouchableOpacity onPress={onResetFilter}>
          <Text style={styles.resetText}>{t('searchFilterReset')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filterGroups}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderFilterSection(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={() =>
          category ? (
            <View style={styles.categoryContainer}>
              <View>
                <Text style={styles.categoryTitle}>{t('category')}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              {/* <Ionicons name={'chevron-forward-outline'} size={20} /> */}
            </View>
          ) : (
            <View style={{ height: 16 }} />
          )
        }
        ListFooterComponent={() => <View style={{ height: 16 }} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
        bounces={false}
      />

      <TouchableOpacity style={styles.applyButton} onPress={onApplyFilter}>
        <Text style={styles.applyText}>{t('filterApply')}</Text>
      </TouchableOpacity>
    </View>
  );
};

SearchFilterView.propTypes = {};
