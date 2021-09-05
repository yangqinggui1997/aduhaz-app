import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import images from '../../assets/images';
import { wp } from '../../commons/responsive';
import Utils from '../../commons/utils';
import { ImageView } from '../../components';
import colors from '../../theme/colors';

function Product({ onPress, icon, title, price }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <ImageView
          source={{
            uri: icon,
          }}
          placeholderImage={images.empty}
          style={styles.icon}
          resizeMode="center"
        />
        <View style={styles.product}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{Utils.formatPrice(price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Product;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: wp(10),
    paddingVertical: wp(8),
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  icon: {
    width: wp(30),
    height: wp(30),
    marginRight: wp(10),
    borderColor: colors.flatGrey13,
    borderWidth: 1 / 2,
  },
  title: {
    fontSize: wp(14),
  },
  price: {
    fontSize: wp(11),
    color: colors.red,
    marginTop: wp(5),
  },
  product: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
