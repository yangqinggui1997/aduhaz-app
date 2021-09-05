import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import showSelectSongTopicPopup from './select-song-topic';
import { styles } from './style';
import colors from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../../screens/screens';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import { LoadingView, AppSlider } from '../../components';

const TRIM_SONG = false;

export default function showUploadSongPopup({
  songItem,
  onFinish,
  isClosedOnTouchOutside = true,
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
          <UploadSong
            songItem={songItem}
            componentId={componentId}
            onClose={song => {
              if (song && _.isFunction(onFinish)) {
                onFinish(song);
              }
              hideBottomSheet();
            }}
          />
        ),
        height: TRIM_SONG ? 612 : 512,
      },
    },
  });
}

const UploadSong = ({ onClose, songItem }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [singer, setSinger] = useState('');
  const [author, setAuthor] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trimTime, setTrimTime] = useState({ start: 0, end: 10 });
  const [maxDuration, setMaxDuration] = useState(10);
  const [isValidData, setIsValidData] = useState(false);

  useEffect(() => {
    if (songItem) {
      // TODO: load duration from file
      setMaxDuration(60);
      setTrimTime({
        ...trimTime,
        end: 60,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsValidData(
      !_.isEmpty(name) && !_.isEmpty(singer) && !_.isEmpty(author) && topic,
    );
  }, [name, singer, author, topic]);

  const onUploadSong = async () => {
    setIsLoading(true);
    try {
      const response = await apiServices.uploadSong(
        topic.id,
        name,
        singer,
        author,
        songItem,
      );
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK) {
        onClose({
          id: result.id_song,
          topicId: topic.id,
          name: name,
          single_name: singer,
          author_name: author,
          songItem: songItem,
        });
        setIsLoading(false);
      } else {
        // Alert.alert(result.message ?? 'Error');
        console.log('POST ERROR: ', result);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('upload song error: ', error);
      setIsLoading(false);
    }
  };

  console.log('###songItem: ', songItem);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t('uploadSong')}</Text>
        <TouchableOpacity onPress={() => onClose()} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>{t('songName')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        placeholder={t('songNamePlaceHolder')}
        placeholderTextColor={colors.flatGrey}
        onChangeText={setName}
      />
      <Text style={styles.sectionTitle}>{t('singer')}</Text>
      <TextInput
        style={styles.input}
        value={singer}
        placeholder={t('singerPlaceHolder')}
        placeholderTextColor={colors.flatGrey}
        onChangeText={setSinger}
      />
      <Text style={styles.sectionTitle}>{t('author')}</Text>
      <TextInput
        style={styles.input}
        value={author}
        placeholder={t('authorPlaceHolder')}
        placeholderTextColor={colors.flatGrey}
        onChangeText={setAuthor}
      />
      <Text style={styles.sectionTitle}>{t('topic')}</Text>
      <TouchableOpacity
        onPress={() =>
          showSelectSongTopicPopup({
            onFinish: item => setTopic(item),
          })
        }
        style={styles.selectTopicContainer}>
        <Text style={topic ? styles.topic : styles.topicPlaceHolder}>
          {topic ? topic.name : t('topicPlaceHolder')}
        </Text>
      </TouchableOpacity>
      {TRIM_SONG && (
        <>
          <Text style={styles.sectionTitle}>{`${t('trimSong')}: ${
            trimTime.start
          }s - ${trimTime.end}s`}</Text>
          <Text style={styles.sectionSubTitle}>{t('trimSongPlaceholder')}</Text>
          <AppSlider
            style={styles.sliderStyle}
            rangeSlider={true}
            min={0}
            max={maxDuration}
            selectedMin={trimTime.start}
            selectedMax={trimTime.end}
            step={1}
            onValueChanged={(low, high, _) => {
              if (
                trimTime.start !== parseInt(low) ||
                trimTime.end !== parseInt(high)
              ) {
                setTrimTime({ start: low, end: high });
              }
            }}
            renderRail={() => <View style={styles.sliderRailContainer} />}
            renderRailSelected={() => (
              <View style={styles.sliderRailSelectedContainer} />
            )}
            renderThumb={() => (
              <View style={styles.sliderThumbContainer}>
                <View style={styles.sliderThumbInside} />
              </View>
            )}
          />
        </>
      )}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity
          disabled={!isValidData || isLoading}
          onPress={onUploadSong}
          style={[
            styles.submitButton,
            isValidData ? styles.enableButton : styles.disableButton,
          ]}>
          <Text style={styles.submit}>{t('postSong')}</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </View>
  );
};
