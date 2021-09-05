import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Layout } from '../../../components';
import ViewShot from 'react-native-view-shot';

import style from './styles';
import { STORY_FONTS } from '../../../theme/fonts';
import colors from '../../../theme/colors';
import { wp } from '../../../commons/responsive';
import images from '../../../assets/images';

import _ from 'lodash';

const InputTextStickerView = ({ componentId, sticker, onCancel, onFinish }) => {
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [showColorList, setShowColorList] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    colors.STORY_COLOR_LIST[0],
  );
  const [selectedFont, setSelectedFont] = useState(STORY_FONTS[0]);

  const textInput = useRef(null);
  const viewShot = useRef(null);

  useEffect(() => {
    if (textInput.current) {
      textInput.current.focus();
    }

    if (sticker) {
      setText(sticker.rawValue.text);
      setSelectedColor(sticker.rawValue.color);
      setSelectedFont(sticker.rawValue.font);
    }
  }, []);

  const onDone = () => {
    if (!_.isEmpty(text)) {
      textInput.current.blur();
      viewShot.current.capture().then(uri => {
        Image.getSize(uri, (w, h) => {
          if (_.isFunction(onFinish)) {
            onFinish({
              type: 'TEXT',
              uri,
              width:  Platform.OS === 'android' ? w * 0.3 : w * 0.5,
              height: Platform.OS === 'android' ? h * 0.3 : h * 0.5,
              rawValue: {
                text,
                font: selectedFont,
                color: selectedColor,
              },
            });
          }
        });
      });
    }
  };

  const onChangeFont = () => {
    const currentFontIndex = STORY_FONTS.findIndex(
      f => f.name === selectedFont.name,
    );
    console.log(currentFontIndex);
    if (currentFontIndex < STORY_FONTS.length - 1) {
      setSelectedFont(STORY_FONTS[currentFontIndex + 1]);
    } else {
      setSelectedFont(STORY_FONTS[0]);
    }
  };

  return (
    <Layout style={style.container}>
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          if (_.isFunction(onCancel)) {
            onCancel();
          }
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <View style={style.inputContainer}>
            <ViewShot ref={viewShot}>
              <TextInput
                ref={textInput}
                style={[
                  style.input,
                  {
                    color: selectedColor,
                    fontFamily: selectedFont.name,
                    width: text.length === 0 ? 40 * t('createStoryTextStickerPlaceholder').length : 40 * text.length,
                    height: wp(86),
                    maxWidth: Dimensions.get('screen').width - 80,
                  },
                ]}
                value={text}
                onChangeText={text => setText(text)}
                multiline={true}
                placeholder={t('createStoryTextStickerPlaceholder')}
                placeholderTextColor={colors.flatGrey09}
              />
            </ViewShot>

            {!showColorList && (
              <View style={style.toolbarContainer}>
                <TouchableOpacity onPress={() => setShowColorList(true)}>
                  <Image
                    source={images.icon_color_wheel}
                    style={style.iconColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.fontButton}
                  onPress={() => onChangeFont()}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: selectedFont.name,
                    }}>
                    {selectedFont.title}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {showColorList && (
              <View style={style.toolbarContainer}>
                <FlatList
                  data={colors.STORY_COLOR_LIST}
                  horizontal={true}
                  style={{ width: '100%', height: '100%' }}
                  contentContainerStyle={{ alignItems: 'center' }}
                  keyboardShouldPersistTaps="always"
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setShowColorList(false);
                        setSelectedColor(item);
                      }}>
                      <View
                        style={[style.iconColor, { backgroundColor: item }]}>
                        {item === selectedColor && (
                          <View style={style.selectedDot} />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={{ width: wp(16) }} />
                  )}
                  ListHeaderComponent={() => (
                    <TouchableOpacity
                      style={style.closeListButton}
                      onPress={() => {
                        setShowColorList(false);
                      }}>
                      <Ionicons
                        name="close-outline"
                        color={colors.white}
                        size={18}
                      />
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, index) => 'key' + index.toString()}
                />
              </View>
            )}
          </View>
          <TouchableOpacity style={style.doneButton} onPress={() => onDone()}>
            <Text style={{ color: colors.white, fontWeight: 'bold' }}>
              {t('done')}
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default InputTextStickerView;
