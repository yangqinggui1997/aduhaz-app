import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import FontistoIcons from 'react-native-vector-icons/Fontisto';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import images from '../../assets/images';
import { wp } from '../../commons/responsive';
import {
  flexRow,
  justifyBetween,
  ml,
  mr,
  mt,
  pb,
  pdH,
  pt,
} from '../../commons/styles';
import { ImageView, Layout, MoreHeader, NavBar } from '../../components';
import UserModel from '../../models/user';
import apiServices from '../../services';
import storage from '../../storage';
import colors from '../../theme/colors';
import Posts from './posts';
import Stories from './stories';
import { useNavigation } from '../../hooks';
import Screens from '../screens';

function ProfileSeller({ componentId, userId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [seller, setSeller] = React.useState(null);

  const getSellerProfile = React.useCallback(async () => {
    try {
      const {
        data: { data },
      } = await apiServices.getUserInfo(userId);
      if (data) {
        const user = UserModel.clone(data);
        setSeller(user);
      }
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    getSellerProfile();
  }, []);

  const renderOnlineStatus = user => {
    let backgroundColor = colors.orange;
    if (user && user.lastOnline && user.lastOnline.seconds) {
      const lastOnline = moment(user.lastOnline.seconds * 1000).valueOf();
      if (moment().valueOf() - lastOnline < 60 * 1000) {
        backgroundColor = colors.green;
      }
    }
    return <View style={[styles.onlineStatus, { backgroundColor }]} />;
  };

  const onPressRating = () =>
    navigation.push(Screens.RatingDetail, {
      userId: seller.id,
    });

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('profileSeller')} />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View>
          <View>
            <ImageView
              source={{ uri: seller?.cover_photo }}
              style={styles.banner}
            />
          </View>

          <View style={styles.topContainer}>
            <View>
              <View>
                <ImageView
                  source={{ uri: seller?.icon }}
                  style={styles.avatar}
                />
                {renderOnlineStatus(seller)}
              </View>
              <Text style={styles.name}>{seller?.hoten}</Text>
            </View>
            <View>
              <FollowButton
                userId={userId}
                followed={seller?.friend_status === 1 ? true : false}
              />
            </View>
          </View>

          <View style={[pdH(16), pb(15), pt(10), styles.aboutContainer]}>
            <View style={[flexRow, justifyBetween]}>
              <View style={[flexRow, styles.alignEnd]}>
                <IconMaterialCommunityIcons
                  name="signal-variant"
                  color={colors.grey}
                  size={wp(17)}
                  style={[mr(5)]}
                />
                <Text style={[styles.aboutTxt]}>
                  {t('have')}{' '}
                  <Text style={styles.boldTxt}>
                    {seller?.amount_of_follower}
                  </Text>{' '}
                  {t('sellerFollower')}
                </Text>
              </View>
              <View style={[flexRow, styles.alignEnd]}>
                <IconAntDesign
                  name="barschart"
                  color={colors.grey}
                  size={wp(17)}
                  style={[mr(5)]}
                />
                <Text style={[styles.aboutTxt]}>
                  {t('sellerFollowing')}{' '}
                  <Text style={styles.boldTxt}>
                    {seller?.amount_of_following}
                  </Text>{' '}
                  {t('person')}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[flexRow, styles.alignEnd, mt(5), styles.alignCenter]}
              onPress={onPressRating}>
              <IconEvilIcons
                name="star"
                color={colors.grey}
                size={wp(20)}
                style={[mr(5), ml(-2)]}
              />
              <Text style={[styles.aboutTxt, styles.greyTxt]}>
                {t('rating')}:{' '}
                <Text
                  style={[
                    styles.blackTxt,
                    {
                      fontWeight: 'bold',
                    },
                  ]}>
                  {seller?.point_of_evaluate
                    ? parseInt(seller?.point_of_evaluate, 10)
                    : 0}
                </Text>
              </Text>
              <AirbnbRating
                showRating={false}
                size={15}
                defaultRating={
                  seller?.point_of_evaluate ? seller?.point_of_evaluate / 1 : 0
                }
                count={1}
                isDisabled={true}
              />
            </TouchableOpacity>

            <View style={[flexRow, styles.alignEnd, mt(5), styles.alignCenter]}>
              <IconEvilIcons
                name="location"
                color={colors.grey}
                size={wp(20)}
                style={[mr(5), ml(-2)]}
              />
              <Text style={[styles.aboutTxt, styles.greyTxt]}>
                {t('address')}:{' '}
                <Text style={styles.blackTxt}>{seller?.diachi}</Text>
              </Text>
            </View>

            <View style={[flexRow, styles.alignEnd, mt(5), styles.alignCenter]}>
              <FontistoIcons
                name="email"
                color={colors.grey}
                size={wp(16)}
                style={[mr(5), ml(2)]}
              />
              <Text style={[styles.aboutTxt, styles.greyTxt]}>
                {t('email')}:{' '}
                <Text style={styles.blackTxt}>{seller?.email}</Text>
              </Text>
            </View>
          </View>

          {/* danh sách stories */}
          <View style={[styles.borderBottom, pb(20)]}>
            <MoreHeader
              noBorder
              heading={t('storiesList')}
              headingStyle={styles.heading}
            />
            <Stories userId={userId} componentId={componentId} />
          </View>
          {/* danh sách posts */}
          <View style={{ marginBottom: 16 }}>
            <Posts componentId={componentId} userId={userId} />
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

export default ProfileSeller;

const ONLINE_STATUS_WIDTH = 10;

const styles = StyleSheet.create({
  banner: {
    flex: 1,
    height: wp(145),
  },

  topContainer: {
    flexDirection: 'row',
    borderBottomColor: colors.grey,
    borderBottomWidth: wp(1),
    alignItems: 'flex-end',
    marginTop: -wp(70),
    paddingHorizontal: wp(16),
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: wp(15),
  },
  avatar: {
    width: wp(90),
    height: wp(90),
    backgroundColor: colors.grey,
    borderRadius: wp(80),
    borderColor: colors.grey,
    borderWidth: wp(5),
  },
  name: {
    fontWeight: 'bold',
    fontSize: wp(16),
    textAlign: 'center',
  },

  // follow button
  btnFollow: {
    borderColor: colors.green,
    borderWidth: wp(1),
    padding: wp(5),
    paddingRight: wp(8),
    paddingLeft: wp(8),
    flexDirection: 'row',
    borderRadius: wp(16),
    alignItems: 'center',
  },
  btnFollowTxt: {
    color: colors.green,
  },
  btnFollowIcon: {
    marginLeft: wp(5),
  },

  //
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  aboutTxt: {
    fontSize: wp(12),
  },
  boldTxt: {
    fontWeight: 'bold',
  },
  greyTxt: {
    color: colors.profileGray,
  },
  blackTxt: {
    color: colors.black,
  },
  aboutContainer: {
    borderBottomColor: colors.grey,
    borderBottomWidth: wp(1),
  },

  //
  heading: {
    textTransform: 'none',
  },
  borderBottom: {
    borderBottomColor: colors.grey,
    borderBottomWidth: wp(1),
  },
  onlineStatus: {
    position: 'absolute',
    bottom: ONLINE_STATUS_WIDTH,
    right: ONLINE_STATUS_WIDTH,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
});

function FollowButton({ userId, followed = false }) {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowed, setIsFollowed] = React.useState(followed);

  const { user } = useSelector(state => state.app);

  React.useEffect(() => {
    setIsFollowed(followed);
  }, [followed]);

  const handleFollow = async () => {
    if (user) {
      setIsLoading(true);
      try {
        isFollowed
          ? await apiServices.unfollow(userId)
          : await apiServices.follow(userId);
        setIsFollowed(!isFollowed);
      } catch (error) {
        //
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(t('requireLogin'));
    }
  };

  return (
    <TouchableOpacity
      style={styles.btnFollow}
      onPress={handleFollow}
      disabled={isLoading || (user && userId === user.id)}>
      {isFollowed ? (
        <Text style={styles.btnFollowTxt}>{t('cancelFollowing')}</Text>
      ) : (
        <Text style={styles.btnFollowTxt}>{t('follow')}</Text>
      )}

      {!isFollowed && (
        <IconAntDesign
          name="plus"
          style={styles.btnFollowIcon}
          color={colors.green}
        />
      )}
    </TouchableOpacity>
  );
}
