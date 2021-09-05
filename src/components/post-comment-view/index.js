import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { styles } from './styles';
import { Colors } from '../../theme';
import images from '../../assets/images';
import Screens from '../../screens/screens';
import KeyboardView from '../keyboard-view';
import FastImage from 'react-native-fast-image';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import Utils from '../../commons/utils';
import moment from 'moment';

const PostCommentView = ({ comment, index }) => {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false);

  return (
    <View style={{ flexDirection: 'row' }}>
      <FastImage
        style={styles.commentAvatar}
        source={{
          uri: comment.user.icon,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={{ marginLeft: wp(10) }}>
        <View style={styles.contentContainer}>
          <Text style={styles.commentUser}>{comment.user.name}</Text>
          <Text style={styles.commentContent}>{comment.content}</Text>
        </View>
        <Text style={styles.commentTime}>
          {Utils.getPostTime(moment.unix(comment.date).toDate())}
        </Text>
        {comment.replies && comment.replies.length > 0 && (
          <TouchableOpacity
            style={styles.seeReplies}
            onPress={() => setShowReplies(!showReplies)}>
            <Text
              style={{
                color: colors.flatGrey09,
                fontSize: wp(12),
              }}>{`${
              showReplies ? t('commentHideReplies') : t('commentViewReplies')
            } (${comment.replies.length})`}</Text>
            <Ionicons
              style={{ marginLeft: wp(6) }}
              name="chevron-down-outline"
              color={colors.flatGrey09}
              size={14}
            />
          </TouchableOpacity>
        )}
        {comment.replies && showReplies && (
          <FlatList
            style={styles.repliesList}
            data={comment.replies}
            renderItem={({ item, index }) => (
              <PostCommentView comment={item} index={index} />
            )}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(_, index) => 'key' + index.toString()}
          />
        )}
      </View>
    </View>
  );
};

export default PostCommentView;
