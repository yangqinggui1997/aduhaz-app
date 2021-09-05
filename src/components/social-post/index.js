import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../../assets/images';
import { RESPONSE_STATUS } from '../../commons/constants';
import { wp } from '../../commons/responsive';
import {
  alignCenter,
  flex1,
  flexRow,
  justifyCenter,
  justifyEnd,
  justifyStart,
  ml,
  mt,
  pdH,
  pt,
} from '../../commons/styles';
import Utils from '../../commons/utils';
import showPostCommentsView from '../../components/post-comments';
import Video from '../../components/video-player';
import { useNavigation } from '../../hooks';
import PostCommentModel from '../../models/post-comment';
import Screens from '../../screens/screens';
import apiServices from '../../services';
import storage from '../../storage';
import { Colors } from '../../theme';
import colors from '../../theme/colors';
import ImageView from '../image-view';
import PostCommentView from '../post-comment-view';
import TextViewMore from '../text-view-more';
import style from './style';

const SocialPost = ({
  item = null,
  itemColor = colors.black,
  onPressItem = null,
  onPressVideo = null,
  onOpenMenu,
  onPressLike,
  staticPost = false,
  playerState = Video.PlayerState.NONE,
  autoplay = false,
  titleOnBottom = false,
  videoWidth,
  videoHeight,
  onVideoEnd,
  isMutedVideo,
  onVideoMutePress,
  alignMargins = false,
  componentId,
  isPlayingClip,
  showFollowStatus = false,
  onPressFollow,
  ...props
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (playerState === Video.PlayerState.STOP) {
      setCurrentTime(0);
    }
  }, [playerState]);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await apiServices.getComments({
        id_post: item.id,
        id_parent: 0,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        setComments(result.data.map(c => PostCommentModel.clone(c)));
      } else {
        console.log('GET COMMENT ERROR: ', result);
      }
    } catch (error) {
      console.log('GET COMMENT ERROR: ', error);
    }
  };

  const onPressMenuButton = () => {
    if (_.isFunction(onOpenMenu)) {
      onOpenMenu();
    }
  };

  const onPressSocialPost = () => {
    if (_.isFunction(onPressItem)) {
      onPressItem();
    }
  };

  const onPressLikePost = () => {
    if (_.isFunction(onPressLike)) {
      onPressLike();
    }
  };

  const onPressComments = (postId, totalComments) => {
    if (!staticPost) {
      showPostCommentsView({ postId, totalComments });
    }
  };

  const onPostComment = async () => {
    if (storage.isLoggedIn()) {
      try {
        const response = await apiServices.postComment({
          id_post: item.id,
          id_parent: 0,
          content: commentText,
        });
        const result = response.data;
        if (result.status == RESPONSE_STATUS.OK) {
          setCommentText('');
          fetchComments();
        } else {
          console.log('POST COMMENT ERROR: ', result);
        }
      } catch (error) {
        console.log('POST COMMENT ERROR: ', error);
      }
    } else {
      Alert.alert(t('alertLogin'));
    }
  };

  const handlePressUsername = () => {
    navigation.push(Screens.ProfileSeller, {
      userId: item?.user?.id,
    });
  };

  const handlePressFollow = () => {
    if (_.isFunction(onPressFollow)) {
      onPressFollow();
    }
  };

  const renderOnlineStatus = user => {
    let backgroundColor = Colors.orange;
    if (user && user.lastOnline && user.lastOnline.seconds) {
      const lastOnline = moment(user.lastOnline.seconds * 1000).valueOf();
      if (moment().valueOf() - lastOnline < 60 * 1000) {
        backgroundColor = Colors.green;
      }
    }
    return <View style={[style.onlineStatus, { backgroundColor }]} />;
  };

  const renderViewMore = onPress => {
    console.log('renderViewMore');
    return (
      <Text
        style={{
          textDecorationLine: 'underline',
          textAlign: 'right',
          paddingBottom: wp(5),
          paddingRight: wp(5),
          color: itemColor,
        }}
        onPress={onPress}>
        {t('viewMore')}
      </Text>
    );
  };

  const renderViewLess = onPress => {
    console.log('renderViewLess');
    return (
      <Text
        style={{
          textDecorationLine: 'underline',
          textAlign: 'right',
          paddingBottom: wp(5),
          paddingRight: wp(5),
          color: itemColor,
        }}
        onPress={onPress}>
        {t('viewLess')}
      </Text>
    );
  };

  return (
    <View
      style={[
        props.style,
        pt(8),
        staticPost
          ? {
              borderWidth: 1,
              borderColor: colors.lightFlatGrey,
              borderRadius: 16,
            }
          : {},
      ]}>
      <TouchableOpacity activeOpacity={1} onPress={onPressSocialPost}>
        <View
          style={[style.header, alignMargins ? {} : { paddingHorizontal: 8 }]}>
          <View
            style={[flexRow, { flex: 1, marginRight: 10, overflow: 'hidden' }]}>
            {item.user && item.user.icon && item.user.icon != '' && (
              <TouchableOpacity onPress={handlePressUsername}>
                <FastImage
                  style={style.avatar}
                  source={{
                    uri: item.user.icon,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                {renderOnlineStatus(item.user)}
              </TouchableOpacity>
            )}
            <View style={ml(10)}>
              <View style={style.nameContainer}>
                <TouchableOpacity onPress={handlePressUsername}>
                  <Text style={{ color: itemColor }}>
                    {item.user && item.user.hoten ? item.user.hoten : ''}
                  </Text>
                </TouchableOpacity>
                {showFollowStatus && (
                  <TouchableOpacity
                    style={style.followContainer}
                    onPress={handlePressFollow}>
                    <Text style={{ color: itemColor }}> - </Text>
                    <Text style={{ color: colors.red }}>
                      {t(!item.user?.follow_status ? 'follow' : 'following')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[flexRow, mt(4), alignCenter]}>
                <Ionicons
                  name={images.ionicons_calendar}
                  size={12}
                  color={colors.flatGrey}
                />
                <Text style={style.time}>
                  {Utils.getPostTime(moment.unix(item.postDate).toDate())}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onPressMenuButton}>
            <Ionicons name={images.ionicons_menu} size={24} color={itemColor} />
          </TouchableOpacity>
        </View>
        {!titleOnBottom && (
          // <Text
          //   style={[
          //     style.description,
          //     { color: itemColor },
          //     alignMargins ? {} : { paddingHorizontal: 8 },
          //     staticPost ? { height: 65 } : {},
          //   ]}
          //   numberOfLines={staticPost ? 2 : null}>
          //   {item.postTitle}
          // </Text>
          <TextViewMore
            numberOfTextLines={staticPost ? 2 : 4}
            renderViewMore={renderViewMore}
            renderViewLess={renderViewLess}
            textStyle={[
              style.description,
              { color: itemColor },
              alignMargins ? {} : { paddingHorizontal: 8 },
              staticPost ? { height: 65 } : {},
            ]}>
            <Text>{item.postTitle}</Text>
          </TextViewMore>
        )}
        <View>
          <Video
            style={[
              style.videoContainer,
              props.videoStyle,
              {
                aspectRatio:
                  videoWidth && videoHeight ? videoWidth / videoHeight : null,
              },
            ]}
            videoUrl={
              isPlayingClip
                ? Utils.getClipUrl(item)
                : Utils.getEncodedVideoUrl(item)
            }
            thumnailUrl={item.icon}
            resizeMode={'cover'}
            videoWidth={videoWidth || Dimensions.get('screen').width}
            videoHeight={videoHeight || 300}
            playerState={playerState}
            autoplay={autoplay}
            onEnd={onVideoEnd}
            onLoad={e => {
              if (e.duration !== undefined) {
                setDuration(e.duration);
              }
            }}
            onProgress={e => {
              if (duration > 0) {
                setCurrentTime(duration - e.currentTime);
              }
            }}
            defaultMuted={isMutedVideo}
            onMutePress={onVideoMutePress}
            loop={false}
            onPaused={_isPaused => {
              setIsPaused(_isPaused);
            }}
            // disableControls={true}
            // seekBarKnob={true}
          />
          {duration > 0 && (
            <View style={style.playTimeContainer}>
              {playerState === Video.PlayerState.PLAY && !isPaused ? (
                <ImageView
                  style={{ width: 12, height: 12 }}
                  source={images.playing_icon}
                />
              ) : null}
              <Text
                style={[
                  style.playTimeText,
                  { minWidth: Utils.getVideoPlayTime(duration).length * 10 },
                ]}>
                {playerState === Video.PlayerState.PLAY ||
                playerState === Video.PlayerState.PAUSE
                  ? Utils.getVideoPlayTime(currentTime)
                  : Utils.getVideoPlayTime(duration)}
              </Text>
            </View>
          )}
          {_.isFunction(onPressVideo) && (
            <TouchableOpacity style={style.videoMask} onPress={onPressVideo}>
              <></>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      <View style={style.footer}>
        <View
          style={[
            flexRow,
            flex1,
            alignCenter,
            alignMargins ? justifyStart : justifyCenter,
          ]}>
          <Ionicons name={images.ionicons_eye} size={18} color={itemColor} />
          <Text style={style.footerItemText}>
            <Text style={{ fontWeight: 'bold', color: itemColor }}>
              {Utils.parseInteraction(item.views)}
            </Text>
            {/* {!staticPost && <Text> </Text>}
            {!staticPost && (
              <Text style={{ color: itemColor }}>
                {item.views > 1 ? t('postViews') : t('postView')}
              </Text>
            )} */}
          </Text>
        </View>
        <TouchableOpacity
          style={[flexRow, flex1, alignCenter, justifyCenter, pdH(4)]}
          delayPressIn={300}
          onPress={() => onPressLikePost()}>
          <Ionicons
            name={
              item.liked ? images.icon_like_highlight_png : images.icon_like_png
            }
            size={18}
            color={item.liked ? colors.red : itemColor}
          />
          <Text style={style.footerItemText}>
            <Text style={{ fontWeight: 'bold', color: itemColor }}>
              {Utils.parseInteraction(item.likes)}
            </Text>
            {/* {!staticPost && <Text> </Text>}
            {!staticPost && (
              <Text style={{ color: itemColor }}>
                {item.likes > 1 ? t('postLikes') : t('postLike')}
              </Text>
            )} */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            flexRow,
            flex1,
            alignCenter,
            alignMargins ? justifyEnd : justifyCenter,
          ]}
          onPress={() => onPressComments(item.id, item.comments)}>
          <Ionicons
            name={images.ionicons_chat_bubble}
            size={18}
            color={itemColor}
          />
          <Text style={style.footerItemText}>
            <Text style={{ fontWeight: 'bold', color: itemColor }}>
              {Utils.parseInteraction(
                comments.length > item.comments
                  ? comments.length
                  : item.comments,
              )}
            </Text>
            {/* {!staticPost && <Text> </Text>}
            {!staticPost && (
              <Text style={{ color: itemColor }}>
                {item.comments > 1 ? t('postComments') : t('postComment')}
              </Text>
            )} */}
          </Text>
        </TouchableOpacity>
      </View>
      {titleOnBottom && (
        <Text
          style={[
            style.description,
            { color: itemColor },
            alignMargins ? {} : { paddingHorizontal: 8 },
          ]}
          numberOfLines={staticPost ? 2 : null}>
          {item.postTitle}
        </Text>
      )}
      {showComments && (
        <View style={style.commentsContainers}>
          {comments.length > 0 && (
            <View style={style.commentsList}>
              <FlatList
                data={comments}
                renderItem={({ item, index }) => (
                  <PostCommentView comment={item} index={index} />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                keyExtractor={(_, index) => 'key' + index.toString()}
              />
            </View>
          )}
          <View style={style.commentInputContainer}>
            <TextInput
              style={style.commentInput}
              value={commentText}
              onChangeText={text => setCommentText(text)}
              placeholder={t('commentInputPlaceholder')}
            />
            <TouchableOpacity onPress={() => onPostComment()}>
              <Ionicons
                style={{ marginLeft: wp(10) }}
                name="paper-plane-outline"
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

SocialPost.PlayerState = Video.PlayerState;

SocialPost.propTypes = {
  static: PropTypes.bool,
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  onVideoEnd: PropTypes.func,
  isMutedVideo: PropTypes.bool,
  onVideoMutePress: PropTypes.func,
  isPlayingClip: PropTypes.bool,
};

SocialPost.defaultProps = {
  static: false,
  videoWidth: 1280,
  videoHeight: 720,
  onVideoEnd: null,
  isMutedVideo: true,
  onVideoMutePress: null,
  isPlayingClip: true,
};

export default SocialPost;
