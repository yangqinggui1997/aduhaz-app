import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import { NavBar, Layout } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import ImageEditView from './image-edit-view';
import ViewShot from 'react-native-view-shot';
import InputTextStickerView from '../create-video-story/input-text-sticker';
import showStickerSelectionView from '../../components/sticker-selection-view';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { POST_STORY_TYPE } from '../../commons/constants';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

import style from './styles';

import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';
import { checkAndResizeImage } from '../../commons/image-picker-helper';
import images from '../../assets/images';
import Screens from '../screens';
import { useNavigation } from '../../hooks';
import Utils from '../../commons/utils';

const CreateImageStory = gestureHandlerRootHOC(
  ({ componentId, onCreateSuccess, ...props }) => {
    const { t } = useTranslation();
    const navigation = useNavigation(componentId);

    const [isLoading, setIsLoading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showInputText, setShowInputText] = useState(false);
    const [stickers, setStickers] = useState(props.imageFiles.map(i => []));
    const [imageFiles, setImageFiles] = useState([...props.imageFiles]);

    const scrollView = useRef(null);
    const viewShots = useRef(props.imageFiles.map(i => useRef(null)));

    useEffect(() => {
      scrollView.current.scrollTo({
        x: Dimensions.get('screen').width * currentImageIndex,
        y: 0,
        animated: false,
      });
    }, [currentImageIndex]);

    const onLeftPress = useCallback(() => {
      Navigation.dismissModal(componentId);
    }, []);

    const onNextPress = () => {
      setIsLoading(true);
      console.log(viewShots);
      setTimeout(() => {
        const requests = viewShots.current.map(viewShot =>
          viewShot.current.capture(),
        );
        Promise.all(requests)
          .then(respones => {
            setIsLoading(false);
            console.log('do something with ', respones);
            navigation.showModal(Screens.InputImagesStoryDescription, {
              imageFiles: respones.map(uri => {
                const newUri = `${
                  !uri.includes('file://') ? 'file://' : ''
                }${uri}`;
                return newUri;
              }),
              type: POST_STORY_TYPE.NEW,
              onCreateSuccess,
            });
          })
          .catch(error => {
            console.log(error);
            setIsLoading(false);
          });
      }, 200);
    };

    const onPressedStickers = () => {
      showStickerSelectionView({
        onSelected: sticker => {
          var _stickers = [...stickers];
          _stickers[currentImageIndex].push({
            type: 'IMAGE',
            source: sticker,
          });
          setStickers(_stickers);
        },
      });
    };

    const onPressedAddImages = async () => {
      try {
        const response = await MultipleImagePicker.openPicker({
          mediaType: 'image',
          isPreview: false,
          selectedAssets: [],
        });
        const resizeRequests = response.map(file => {
          if (Utils.isAndroid()) {
            file.path = file.realPath;
            file.filename = file.fileName;
          }
          return checkAndResizeImage(file);
        });
        const resizeImages = await Promise.all(resizeRequests);

        var viewShotRefs = [...viewShots.current];
        viewShots.current = viewShotRefs.concat(
          resizeImages.map(i => createRef(null)),
        );
        setStickers(stickers.concat(resizeImages.map(i => [])));
        setImageFiles(imageFiles.concat(resizeImages));
      } catch (e) {
        console.log(e);
      }
    };

    const onPressedRemoveImage = index => {
      var _imageFiles = [...imageFiles];
      var _stickers = [...stickers];

      _imageFiles.splice(index, 1);
      _stickers.splice(index, 1);

      var viewShotRefs = [...viewShots.current];
      viewShotRefs.splice(index, 1);
      viewShots.current = viewShotRefs;

      if (currentImageIndex > _imageFiles.length - 1) {
        setCurrentImageIndex(_imageFiles.length - 1);
      }
      setImageFiles(_imageFiles);
      setStickers(_stickers);
    };

    const renderPostButton = () => {
      if (isLoading) {
        return (
          <Progress.Circle
            size={30}
            indeterminate={true}
            color={'black'}
            borderWidth={1.5}
          />
        );
      }
      return (
        <TouchableOpacity onPress={() => onNextPress()}>
          <Text style={style.postButtonText}>{t('next')}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Layout style={{ flex: 1 }}>
        <View style={style.container} onPress={Keyboard.dismiss}>
          <View style={style.container}>
            <NavBar
              style={{ backgroundColor: colors.white }}
              parentComponentId={componentId}
              showCloseButton
              accessoryRight={renderPostButton}
              title={t('createImageStoryTitle')}
              onLeftPress={onLeftPress}
            />
            <View style={style.separator} />
            <ScrollView
              ref={scrollView}
              horizontal={true}
              scrollEnabled={false}>
              {imageFiles.map((imageFile, index) => (
                <View key={imageFile.uri} style={style.editImageContainer}>
                  <ViewShot
                    ref={viewShots.current[index]}
                    style={{
                      width: '100%',
                      aspectRatio: imageFile.width / imageFile.height,
                      overflow: 'hidden',
                    }}>
                    <ImageEditView
                      imageFile={imageFile}
                      stickers={stickers[index]}
                      onDeleteSticker={stickerIndex => {
                        var _stickers = [...stickers];
                        _stickers[index].splice(stickerIndex, 1);
                        setStickers(_stickers);
                      }}
                    />
                  </ViewShot>
                </View>
              ))}
            </ScrollView>
            <View style={style.imageListContainer}>
              <FlatList
                data={imageFiles}
                horizontal={true}
                style={{ width: '100%', height: '100%' }}
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      style.imageItem,
                      currentImageIndex === index
                        ? style.imageItemHighlight
                        : {},
                    ]}
                    onPress={() => setCurrentImageIndex(index)}>
                    <Image style={style.image} source={{ uri: item.uri }} />
                    <TouchableOpacity
                      style={style.removeImageButton}
                      onPress={() => onPressedRemoveImage(index)}>
                      <Image
                        source={images.icon_delete}
                        style={{ width: 12, height: 12 }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                ListHeaderComponent={() => <View style={{ width: wp(2) }} />}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    style={style.addImageItem}
                    onPress={() => onPressedAddImages()}>
                    <Text style={{ color: colors.white, fontSize: 30 }}>+</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={{ width: wp(2) }} />}
                keyExtractor={(_, index) => 'key' + index.toString()}
              />
            </View>
            <View style={style.footer}>
              <TouchableOpacity
                style={style.footerButton}
                onPress={() => setShowInputText(true)}>
                <View style={style.footerIcon}>
                  <Ionicons
                    name="text-outline"
                    size={26}
                    color={colors.white}
                  />
                </View>
                <Text style={style.footerText}>
                  {t('createStoryToolbarText')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.footerButton}
                onPress={() => onPressedStickers()}>
                <View style={style.footerIcon}>
                  <Ionicons
                    name="happy-outline"
                    size={26}
                    color={colors.white}
                  />
                </View>
                <Text style={style.footerText}>
                  {t('createStoryToolbarStickers')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {showInputText && (
          <View style={style.addTextStickerContainer}>
            <InputTextStickerView
              onCancel={() => setShowInputText(false)}
              onFinish={sticker => {
                var _stickers = [...stickers];
                _stickers[currentImageIndex].push({
                  ...sticker,
                  source: { uri: sticker.uri },
                });
                setStickers(_stickers);
                setShowInputText(false);
              }}
            />
          </View>
        )}
      </Layout>
    );
  },
);

export default CreateImageStory;
