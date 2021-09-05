import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NumberFormat from 'react-number-format';
import { ml } from '../../commons/styles';
import colors from '../../theme/colors';
import style from './style';
import images from '../../assets/images';
import _ from 'lodash';
import moment from 'moment';
import Utils from '../../commons/utils';
import { IMAGE_TYPE } from '../../commons/constants';

const ImagePost = ({
  item,
  onPressItem,
  showPrice = true,
  showDate = false,
  showLike = false,
  onLikePress = () => {},
  ...props
}) => {
  return (
    <TouchableOpacity style={style.container} onPress={() => onPressItem(item)}>
      <View style={{ flex: 1 }}>
        <View style={style.thumbnail_container}>
          {item.icon && item.icon != '' && (
            <FastImage
              style={style.thumbnail}
              source={{
                uri: Utils.getResizedImageUri(item.icon, IMAGE_TYPE.SMALL),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          <View style={style.thumbnailMask} />
          {item.province && (
            <View style={style.info_container}>
              <Ionicons
                name={images.ionicons_location}
                size={12}
                color={colors.white}
              />
              <Text style={style.info_text}>
                {item.province.name ? item.province.name : item.province}
              </Text>
            </View>
          )}
        </View>

        <Text numberOfLines={1} style={[style.title, props.titleStyle]}>
          {item.postTitle || ''}
        </Text>
        {showPrice && (
          <Text style={style.price}>{`${Utils.formatPrice(
            parseInt(item.price),
          )}`}</Text>
        )}
        {showDate && (
          <Text style={style.date}>{`${Utils.getPostTime(
            moment.unix(item.postDate).toDate(),
          )}`}</Text>
        )}
        {showLike && (
          <TouchableOpacity style={style.like} onPress={onLikePress}>
            <Ionicons
              name={
                item?.likeStatus === 0
                  ? images.icon_like_png
                  : images.icon_like_highlight_png
              }
              size={20}
              color={item?.likeStatus === 0 ? colors.black : colors.red}
            />
            {item?.like ? (
              <Text style={[style.viewCount, ml(4)]}>
                <Text style={{ fontWeight: 'bold' }}>
                  {Utils.parseInteraction(item?.like ?? 0)}
                </Text>
              </Text>
            ) : null}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

ImagePost.propTypes = {};

export default ImagePost;
