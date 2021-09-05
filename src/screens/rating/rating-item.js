import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default function RatingItem({
  heading,
  subHeading,
  onFinishRating,
  value = 0,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
      <View style={styles.ratingContainer}>
        <AirbnbRating
          showRating={false}
          size={25}
          starStyle={styles.starStyle}
          onFinishRating={onFinishRating}
          defaultRating={value}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: wp(25),
    paddingLeft: wp(15),
  },
  ratingContainer: {
    alignItems: 'flex-start',
    marginTop: wp(5),
  },
  heading: {
    fontSize: wp(16),
    fontWeight: '500',
    color: colors.black,
  },
  subHeading: {
    fontSize: wp(16),
    color: colors.flatBlack03,
    marginTop: wp(3),
  },
  starStyle: {
    marginHorizontal: wp(10),
  },
});
