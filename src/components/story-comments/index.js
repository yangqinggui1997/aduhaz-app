import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import Clipboard from '@react-native-clipboard/clipboard';
import _ from 'lodash';

import { styles } from './style';
import { Colors } from '../../theme';
import images from '../../assets/images';
import Screens from '../../screens/screens';
import KeyboardView from '../keyboard-view';
import FastImage from 'react-native-fast-image';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import StoryCommentModel from '../../models/story-comment';
import storage from '../../storage';
import Utils from '../../commons/utils';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { initialWindowMetrics } from 'react-native-safe-area-context';

export default function showStoryCommentsView({
  isClosedOnTouchOutside = true,
  storyId,
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
          <StoryComment
            componentId={componentId}
            storyId={storyId}
            onClose={hideBottomSheet}
          />
        ),
        height: Dimensions.get('screen').height * 0.7,
        closeOnDragDown: false,
        keyboardAvoidingViewEnabled: false,
        keyboardAvoidingBehavior: 'height',
      },
    },
  });
}

const StoryComment = ({ storyId, onClose }) => {
  const { t } = useTranslation();
  const { user } = useSelector(state => state.app);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [replyingComment, setReplyingComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(
    Platform.OS === 'ios' ? initialWindowMetrics.insets.bottom : 0,
  );
  const [keyboardShowing, setKeyboardShowing] = useState(false);

  const commentInput = useRef(null);
  const actionSheet = useRef(null);

  const keyboardAppearListener = useRef(null);
  const keyboardDisappearListener = useRef(null);

  const currentPage = useRef(1);
  const isFetching = useRef(false);

  const ITEM_PER_REQUEST = 100;

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    keyboardAppearListener.current = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        console.log('Keyboard Height: ', e.endCoordinates.height);
        setKeyboardHeight(
          Platform.OS === 'ios'
            ? e.endCoordinates.height
            : e.endCoordinates.height + 40,
        );
        setKeyboardShowing(true);
      },
    );
    keyboardDisappearListener.current = Keyboard.addListener(
      'keyboardDidHide',
      e => {
        console.log('Keyboard Height: ', e.endCoordinates.height);
        setKeyboardHeight(
          Platform.OS === 'ios' ? initialWindowMetrics.insets.bottom : 0,
        );
        setKeyboardShowing(false);
      },
    );
    return () => {
      keyboardDisappearListener.current.remove();
      keyboardAppearListener.current.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedComment) {
      actionSheet.current.show();
    }
  }, [selectedComment]);

  const handleLoadMore = () => {
    console.log('###handleLoadMore');
    if (currentPage.current > 1 && !isFetching.current) {
      fetchComments();
    }
  };

  const fetchComments = async (perPage = ITEM_PER_REQUEST) => {
    try {
      isFetching.current = true;
      const response = await apiServices.getStoryComments({
        id_story: storyId,
        id_parent: 0,
        page: currentPage.current,
        comments_per_page: perPage,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data.length > 0) {
        let _comments = [...comments];
        if (currentPage.current === 1) {
          _comments = result.data.map(c => StoryCommentModel.clone(c));
        } else {
          _comments = _comments.concat(
            result.data.map(c => StoryCommentModel.clone(c)),
          );
        }
        currentPage.current += 1;
        setComments(_comments);
      } else {
        currentPage.current = 0;
      }
    } catch (error) {
      console.log('GET COMMENT ERROR: ', error);
    } finally {
      isFetching.current = false;
    }
  };

  const refreshToAppendNewComments = (refreshLength = comments.length) => {
    currentPage.current = 1;
    fetchComments(refreshLength); // plus new posted comment
  };

  const onPostComment = async () => {
    if (storage.isLoggedIn()) {
      try {
        const response = await apiServices.postStoryComment({
          id_story: storyId,
          id_parent: replyingComment ? replyingComment.id : 0,
          content: commentText,
        });
        const result = response.data;
        if (result.status == RESPONSE_STATUS.OK) {
          setCommentText('');
          refreshToAppendNewComments(comments.length + 1);
          if (replyingComment) {
            setReplyingComment(null);
          }
          commentInput.current.blur();
        } else if (result.error_code) {
          Alert.alert(
            t('error'),
            t('someThingWentWrongWithCode', { code: result.error_code }),
          );
        } else {
          Alert.alert(t('error'), t('someThingWentWrong'));
        }
      } catch (error) {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
    } else {
      Alert.alert(t('alertLogin'));
    }
  };

  const updateLikeComment = async comment => {
    try {
      const request = comment.liked
        ? apiServices.unlikeStoryComment({ id: comment.id })
        : apiServices.likeStoryComment({ id: comment.id });
      const response = await request;
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        refreshToAppendNewComments();
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('someThingWentWrong'));
    }
  };

  const deleteComment = async () => {
    try {
      const response = await apiServices.deleteStoryComment({
        id: selectedComment.id,
        _method: 'DELETE',
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        refreshToAppendNewComments();
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('someThingWentWrong'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${t('postCommentsTitle')}`}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-outline" size={28} color={Colors.flatBlack02} />
      </TouchableOpacity>
      {comments.length > 0 && (
        <View style={styles.commentsList}>
          <FlatList
            style={{ flexGrow: 1 }}
            data={comments}
            renderItem={({ item, index }) => (
              <CommentItem
                comment={item}
                index={index}
                storyId={storyId}
                onLike={() => updateLikeComment(item)}
                onReply={() => {
                  setReplyingComment(item);
                  commentInput.current.focus();
                }}
                onOpenMenu={comment => {
                  setSelectedComment(comment);
                }}
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(_, index) => 'key' + index.toString()}
          />
        </View>
      )}

      {comments.length === 0 && (
        <View style={styles.emptyMessage} onTouchEnd={() => Keyboard.dismiss()}>
          <Text>{t('postCommentsEmptyMessage')}</Text>
        </View>
      )}

      {replyingComment && (
        <View style={styles.replyMessageContainer}>
          <Text style={{ fontWeight: '500' }}>{`${t(
            'postCommentReplyingMessage',
          )} ${replyingComment.user.name}`}</Text>
          <TouchableOpacity onPress={() => setReplyingComment(null)}>
            <Ionicons
              name="close-outline"
              size={28}
              color={Colors.flatBlack02}
            />
          </TouchableOpacity>
        </View>
      )}
      {keyboardShowing > 0 && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        />
      )}
      <View
        style={[
          styles.footer,
          {
            marginBottom: keyboardHeight,
          },
        ]}>
        <TextInput
          ref={commentInput}
          multiline
          value={commentText}
          style={styles.commentInput}
          placeholder={t('commentInputPlaceholder')}
          onChangeText={text => setCommentText(text)}
        />
        {/* <TouchableOpacity>
          <Ionicons name="happy-outline" size={28} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => onPostComment()}>
          <Ionicons
            style={{ marginLeft: wp(10) }}
            name="paper-plane-outline"
            size={28}
          />
        </TouchableOpacity>
      </View>
      <ActionSheet
        ref={actionSheet}
        options={
          selectedComment?.user?.id === storage.user.id
            ? [t('delete'), t('copy'), t('cancel')]
            : [t('copy'), t('cancel')]
        }
        cancelButtonIndex={
          selectedComment?.user?.id === storage.user.id ? 2 : 1
        }
        onPress={index => {
          if (selectedComment?.user?.id === storage.user.id) {
            if (index === 0) {
              deleteComment();
            } else if (index === 1) {
              Clipboard.setString(selectedComment.content);
            }
          } else {
            if (index === 0) {
              Clipboard.setString(selectedComment.content);
            }
          }
          setSelectedComment(null);
        }}
      />
    </View>
  );
};

const CommentItem = ({ storyId, comment, onLike, onReply, onOpenMenu }) => {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    console.log('###CommentItem - showReplies', showReplies, storyId);
    if (showReplies) {
      fetchReplies();
    }
  }, [comment, showReplies]);

  const fetchReplies = async () => {
    try {
      const response = await apiServices.getStoryComments({
        id_story: storyId,
        id_parent: comment.id,
        comments_per_page: 100,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        setReplies(result.data.map(c => StoryCommentModel.clone(c)));
      } else {
        console.log('GET COMMENT ERROR: ', result);
      }
    } catch (error) {
      console.log('GET COMMENT ERROR: ', error);
    }
  };

  const updateLikeComment = async comment => {
    try {
      const request = comment.liked
        ? apiServices.unlikeStoryComment({ id: comment.id })
        : apiServices.likeStoryComment({ id: comment.id });
      const response = await request;
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        fetchReplies();
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('someThingWentWrong'));
    }
  };

  const onPressLike = () => {
    if (_.isFunction(onLike)) {
      onLike();
    }
  };

  const onPressReply = () => {
    if (_.isFunction(onReply)) {
      onReply();
    }
  };

  const onLongPress = item => {
    if (_.isFunction(onOpenMenu)) {
      onOpenMenu(item);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onLongPress={() => onLongPress(comment)}>
        <FastImage
          style={styles.commentAvatar}
          source={
            comment.user.icon
              ? {
                  uri: comment.user.icon,
                  priority: FastImage.priority.normal,
                }
              : images.logo
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{ flex: 1, marginLeft: wp(10) }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flex: 1, marginRight: wp(10) }}>
              <Text style={styles.commentUser}>{comment.user.name || ''}</Text>
              <Text style={styles.commentContent}>{comment.content || ''}</Text>
              <Text style={styles.commentTime}>{`${Utils.getPostTime(
                moment.unix(comment.date).toDate(),
              )}`}</Text>
            </View>
            <TouchableOpacity
              style={{ alignItems: 'center', width: 50 }}
              onPress={() => onPressLike()}>
              <Ionicons
                name={comment.liked ? 'heart' : 'heart-outline'}
                color={comment.liked ? colors.crimsonRed : colors.black}
                size={20}
              />
              <Text>{Utils.parseInteraction(comment.numberOflikes)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.commentTimeContainer}>
            {onReply && (
              <TouchableOpacity onPress={() => onPressReply()}>
                <Text style={styles.replyButtonText}>
                  {t('postCommentReply')}
                </Text>
              </TouchableOpacity>
            )}
            {comment.numberOfReplies > 0 && (
              <TouchableOpacity
                style={styles.seeReplies}
                onPress={() => setShowReplies(!showReplies)}>
                <Text
                  style={{
                    color: colors.flatGrey09,
                    fontSize: wp(12),
                  }}>{`${
                  showReplies
                    ? t('commentHideReplies')
                    : t('commentViewReplies')
                } (${Utils.parseInteraction(comment.numberOfReplies)})`}</Text>
                <Ionicons
                  style={{ marginLeft: wp(6) }}
                  name="chevron-down-outline"
                  color={colors.flatGrey09}
                  size={14}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
      {replies && showReplies && (
        <FlatList
          style={styles.repliesList}
          data={replies}
          renderItem={({ item, index }) => (
            <CommentItem
              comment={item}
              index={index}
              onLike={() => updateLikeComment(item)}
              onOpenMenu={item => onOpenMenu(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          keyExtractor={(_, index) => 'key' + index.toString()}
        />
      )}
    </View>
  );
};
