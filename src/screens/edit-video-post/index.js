import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  NavBar,
  Layout,
  showCategorySelectionView,
  PopupDialog,
  UploadProgressView,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import Video from 'react-native-video';

import style from './styles';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

import apiServices from '../../services';
import { CATEGORY_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import Category from '../../models/category';
import _ from 'lodash';

const EditVideoPost = ({ componentId, postId, categoryId, onFinishEdit }) => {
  const { t } = useTranslation();

  const [pauseVideo, setPauseVideo] = useState(false);
  const [video, setVideo] = useState(null);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const requests = [
      apiServices.getVideo(postId),
      apiServices.getCategories({
        type: CATEGORY_TYPE.VIDEO,
        id_parent: 0,
      }),
    ];
    const responses = await Promise.all(requests);
    const results = responses.map(response => response.data);

    if (
      results.length === 2 &&
      results.filter(result => result.status !== RESPONSE_STATUS.OK).length ===
        0
    ) {
      const videoPost = results[0].post;
      const categories = results[1].data.map(obj => Category.clone(obj));

      setContent(videoPost.tenbaiviet);
      setCategory(categories.find(c => c.id === categoryId));
      setVideo(videoPost.dowload);
    }
  };

  const onLeftPress = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, []);

  const onSelectCategory = () => {
    showCategorySelectionView({
      type: CATEGORY_TYPE.VIDEO,
      onSelectedCategory: category => {
        setCategory(category);
      },
    });
  };

  const onPost = async () => {
    const onUploadSuccess = () => {
      if (_.isFunction(onFinishEdit)) {
        onFinishEdit();
      }
      onLeftPress();
    };
    setIsLoading(true);
    try {
      const response = await apiServices.updateVideoPost(
        postId,
        category?.id,
        content,
        e => {
          setUploadProgress(e.loaded / e.total);
        },
      );
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        Alert.alert(
          t('complete'),
          t('updatePostSuccess'),
          [{ text: t('ok'), onPress: onUploadSuccess }],
          {
            onDismiss: onUploadSuccess,
          },
        );
      } else if (result.error_code) {
        Alert.alert(
          t('error'),
          t('someThingWentWrongWithCode', { code: result.error_code }),
        );
      } else {
        Alert.alert(t('error'), t('someThingWentWrong'));
      }
      setIsLoading(false);
      setUploadProgress(0);
    } catch (error) {
      Alert.alert(t('error'), t('someThingWentWrong'));
      console.log('POST ERROR: ', JSON.stringify(error));
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const renderPostButton = () => {
    return (
      <TouchableOpacity onPress={() => onPost()} disabled={category === null}>
        <Text
          style={[
            style.postButtonText,
            { color: category ? colors.black : colors.flatGrey11 },
          ]}>
          {t('updateImagePostButton')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <TouchableWithoutFeedback
        style={style.container}
        onPress={Keyboard.dismiss}>
        <View style={style.container}>
          <NavBar
            parentComponentId={componentId}
            showCloseButton
            accessoryRight={renderPostButton}
            title={t('updateVideoPostTitle')}
            onLeftPress={onLeftPress}
          />
          <View style={style.separator} />
          <TextInput
            style={style.contentInput}
            value={content}
            multiline
            placeholder={t('createVideoPostContentPlaceholder')}
            onChangeText={text => setContent(text)}
          />
          <TouchableOpacity
            style={style.categoryButton}
            onPress={() => onSelectCategory()}>
            {!category && (
              <Ionicons
                style={{ marginRight: wp(4) }}
                name="add-circle-outline"
                size={16}
              />
            )}
            <Text>
              {category ? category.name : t('createVideoPostSelectCategory')}
            </Text>
          </TouchableOpacity>
          <View style={style.videoContainer}>
            {video && (
              <TouchableWithoutFeedback
                onPress={() => setPauseVideo(!pauseVideo)}>
                <Video
                  source={{
                    uri: video,
                  }}
                  style={{ flex: 1 }}
                  controls={false}
                  resizeMode={'contain'}
                  paused={pauseVideo}
                  repeat={true}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
      {isLoading && (
        <PopupDialog>
          <UploadProgressView progress={uploadProgress} />
        </PopupDialog>
      )}
    </Layout>
  );
};

export default EditVideoPost;
