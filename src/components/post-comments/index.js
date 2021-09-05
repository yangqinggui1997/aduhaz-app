import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Keyboard,
  PixelRatio,
} from 'react-native';
import ActionSheet from '@alessiocancian/react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';

import { styles } from './styles';
import { Colors } from '../../theme';
import Screens from '../../screens/screens';
import FastImage from 'react-native-fast-image';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import images from '../../assets/images';
import Utils from '../../commons/utils';
import moment from 'moment';
import storage from '../../storage';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import PostCommentModel from '../../models/post-comment';
import { Alert } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { color } from 'react-native-reanimated';

export default function showPostCommentsView({
  isClosedOnTouchOutside = true,
  componentId,
  postId,
  totalComments,
  onClose,
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
          <PostComments
            componentId={componentId}
            onClose={() => {
              hideBottomSheet();
              onClose?.();
            }}
            postId={postId}
            totalComments={totalComments}
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

const PostComments = ({ onClose, postId, totalComments }) => {
  const { t } = useTranslation();

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [replyingComment, setReplyingComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(
    Platform.OS === 'ios' ? initialWindowMetrics.insets.bottom : 0,
  );
  const [keyboardShowing, setKeyboardShowing] = useState(false);

  const ITEM_PER_REQUEST = 6;

  const commentInput = useRef(null);
  const actionSheet = useRef(null);

  const keyboardAppearListener = useRef(null);
  const keyboardDisappearListener = useRef(null);

  const currentPage = useRef(1);
  const isFetching = useRef(false);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    keyboardAppearListener.current = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        console.log('Keyboard Height: ', e.endCoordinates.height);
        setKeyboardHeight(Platform.OS === 'ios' ? 270 : 210);
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
      const response = await apiServices.getComments({
        id_post: postId,
        id_parent: 0,
        page: currentPage.current,
        comments_per_page: perPage,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data.length > 0) {
        let _comments = [...comments];
        if (currentPage.current === 1) {
          _comments = result.data.map(c => PostCommentModel.clone(c));
        } else {
          _comments = _comments.concat(
            result.data.map(c => PostCommentModel.clone(c)),
          );
        }
        currentPage.current += 1;
        setComments(_comments);
      } else {
        currentPage.current = 0;
      }
    } catch (error) {
      console.log('GET COMMENT ERROR: ', error);
    }
  };

  const refreshToAppendNewComments = (refreshLength = comments.length) => {
    currentPage.current = 1;
    fetchComments(refreshLength); // plus new posted comment
  };

  const onPostComment = async () => {
    if (storage.isLoggedIn()) {
      try {
        const response = await apiServices.postComment({
          id_post: postId,
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
        ? apiServices.unlikeComment({ id: comment.id })
        : apiServices.likeComment({ id: comment.id });
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
      const response = await apiServices.deleteComment({
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
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={wp(10)}>
      <Text style={styles.title}>{`${t('postCommentsTitle')}`}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-outline" size={28} color={Colors.flatBlack02} />
      </TouchableOpacity>
      {comments.length > 0 && (
        <View style={styles.commentsList}>
          <FlatList
            data={comments}
            renderItem={({ item, index }) => (
              <CommentItem
                postId={postId}
                comment={item}
                index={index}
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
        <View style={styles.emptyMessage}>
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
          style={styles.commentInput}
          multiline
          value={commentText}
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
            ? ['Xóa', 'Sao chép', 'Hủy']
            : ['Sao chép', 'Hủy']
        }
        cancelButtonIndex={
          selectedComment?.user?.id === storage.user.id ? 2 : 1
        }
        styles={{ buttonText: { fontSize: 18, color: 'black' } }}
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
    </KeyboardAvoidingView>
  );
};

const CommentItem = ({ postId, comment, onLike, onReply, onOpenMenu }) => {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    console.log('FETCH REPLIES');
    if (showReplies) {
      fetchReplies();
    }
  }, [comment, showReplies]);

  const fetchReplies = async () => {
    try {
      const response = await apiServices.getComments({
        id_post: postId,
        id_parent: comment.id,
        comments_per_page: 100,
      });
      const result = response.data;
      console.log('FETCH REPLIES: ', result);
      if (result.status == RESPONSE_STATUS.OK) {
        setReplies(result.data.map(c => PostCommentModel.clone(c)));
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
        ? apiServices.unlikeComment({ id: comment.id })
        : apiServices.likeComment({ id: comment.id });
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
              : images.empty
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{ flex: 1, marginLeft: wp(10) }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flex: 1, marginRight: wp(10) }}>
              <Text style={styles.commentUser}>{comment.user.name || ''}</Text>
              <Text style={styles.commentContent}>{comment.content || ''}</Text>
              <View style={styles.commentTimeContainer}>
                <Text style={styles.commentTime}>
                  {Utils.getPostTime(moment.unix(comment.date).toDate())}
                </Text>
                {onReply && (
                  <TouchableOpacity onPress={() => onPressReply()}>
                    <Text style={styles.replyButtonText}>
                      {t('postCommentReply')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
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
          {comment.numberOfReplies > 0 && (
            <TouchableOpacity
              style={styles.seeReplies}
              onPress={() => setShowReplies(!showReplies)}>
              <Text
                style={{
                  color: colors.flatGrey09,
                  fontSize: wp(12),
                }}>{`${
                showReplies ? t('commentHideReplies') : t('commentViewReplies')
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
