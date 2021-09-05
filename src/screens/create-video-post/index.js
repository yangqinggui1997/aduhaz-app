import React, { useCallback, useState } from 'react';
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
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';

import style from './styles';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

import apiServices from '../../services';
import { CATEGORY_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import { createThumbnail } from 'react-native-create-thumbnail';
import ImgToBase64 from 'react-native-image-base64';
import { useDispatch } from 'react-redux';
import {
  setRefreshHomeFlag,
  setRefreshHomeVideoFlag,
} from '../../redux/store/reducers/bottomTab/action';
import _ from 'lodash';

const CreateVideoPost = ({ componentId, videoFile, onCreateSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [pauseVideo, setPauseVideo] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    setIsLoading(true);
    try {
      const thumbnailFile = await createThumbnail({
        url: videoFile.path,
        format: 'jpeg',
      });
      const base64 = await ImgToBase64.getBase64String(thumbnailFile.path);
      const response = await apiServices.createVideoPost(
        category?.id,
        content,
        videoFile,
        `data:image/jpeg;base64,${base64}`,
        e => {
          setUploadProgress(e.loaded / e.total);
        },
      );
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        Alert.alert(
          t('complete'),
          t('createPostSuccess'),
          [
            {
              text: t('ok'),
              onPress: () => {
                if (_.isFunction(onCreateSuccess)) {
                  onCreateSuccess();
                }
                onLeftPress();
              },
            },
          ],
          {
            onDismiss: () => {
              if (_.isFunction(onCreateSuccess)) {
                onCreateSuccess();
              }
              onLeftPress();
            },
          },
        );
        dispatch(setRefreshHomeFlag(true));
        dispatch(setRefreshHomeVideoFlag(true));
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
          {t('createPostButton')}
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
            title={t('createVideoPostTitle')}
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
            <TouchableWithoutFeedback
              onPress={() => setPauseVideo(!pauseVideo)}>
              <Video
                source={{
                  uri: videoFile.path,
                }}
                style={{ flex: 1 }}
                controls={false}
                resizeMode={'contain'}
                paused={pauseVideo}
                repeat={true}
              />
            </TouchableWithoutFeedback>
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

export default CreateVideoPost;
