import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import apiServices from '../../services';
import Sound from 'react-native-sound';
import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import style from './style';
import FastImage from 'react-native-fast-image';
import Screens from '../../screens/screens';
import colors from '../../theme/colors';
import images from '../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from '../../commons/utils';
import _ from 'lodash';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';
import { wp } from '../../commons/responsive';

var song;

const MusicList = ({ componentId, topic, type, keySearch, onFinish }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [songs, setSongs] = useState({
    data: [],
    currentPage: 1,
  });
  const [selectedMusic, setSelectedMusic] = useState(-1);
  const [searchText, setSearchText] = useState(keySearch ? keySearch : '');
  const [playedSong, setPlayedSong] = useState({
    song: null,
    isPlay: false,
    id: -1,
  });
  Sound.setCategory('Playback', true); // true = mixWithOthers

  const stopSound = () => {
    if (song) {
      song.stop();
    }
  };

  useEffect(() => {
    if (type === 'search') {
      if (!_.isEmpty(searchText)) {
        getSongs();
      }
    } else {
      getSongs();
    }
  }, [songs.currentPage, searchText]);

  useEffect(() => {
    stopSound();
    if (playedSong.isPlay) {
      song = new Sound(playedSong.song, null, error => {
        if (error) {
          return;
        } else {
          if (song) {
            song.play(() => {
              song.release();
            });
            song.setVolume(0.5);
          }
        }
      });
    }
    return () => {
      stopSound();
    };
  }, [playedSong.isPlay, playedSong.song, playedSong.id]);

  const handleLoadMore = () => {
    setSongs({
      data: songs.data,
      currentPage: songs.currentPage + 1,
    });
  };

  const onPlayPress = item => {
    setPlayedSong({
      song: item.directory,
      isPlay:
        item.id !== playedSong.id ? true : playedSong.isPlay ? false : true,
      id: item.id !== playedSong.id ? item.id : -1,
    });
  };

  const onMusicPress = item => {
    onFinish(item);
    navigation.pop();
  };

  const getSongs = async () => {
    var _songs = [...songs.data];
    try {
      const response = await apiServices.getSongs({
        topicId: topic ? topic.id || topic.id_category : '',
        songPerPage: 6,
        page: songs.currentPage,
        keySearch: searchText,
        order: 'asc',
        orderBy: 'id',
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        if (songs.currentPage === 1) {
          _songs = response.data.data;
        } else {
          _songs = _songs.concat(response.data.data);
        }
        setSongs({
          data: _songs,
          currentPage: songs.currentPage,
        });
      }
    } catch (error) {
      console.log('get songs error: ', error);
    }
  };

  const renderSongItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={style.musicItem}
        onPress={() => onMusicPress(item, index)}>
        <FastImage
          style={style.musicIcon}
          source={
            item.icon && item.icon != ''
              ? {
                  uri: item.icon,
                  priority: FastImage.priority.normal,
                }
              : images.icon_song_default
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={style.musicDetail}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={style.author}>
            {item.single_name}
          </Text>
          <Text style={style.author}>{item.user_name_post}</Text>
          <Text style={style.author}>
            {Utils.getSongDurationString(item.duration)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onPlayPress(item)}
          style={style.iconPlayContainer}>
          <Image
            style={style.iconPlay}
            resizeMode="contain"
            source={
              playedSong.id === item.id
                ? images.icon_pause_png
                : images.icon_play_video
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      {type === 'search' ? (
        <View style={style.searchHeader}>
          <View style={style.searchInputContainer}>
            <TextInput
              style={style.searchInput}
              placeholder={t('search_placeholder')}
              value={searchText}
              returnKeyType="search"
              onSubmitEditing={() => {}}
              onChangeText={text => {
                setSearchText(text);
                setSongs({
                  data: [],
                  currentPage: 1,
                });
              }}
            />
            {!_.isEmpty(searchText) && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons
                  name="close-outline"
                  size={28}
                  color={colors.flatBlack02}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={style.backButton}
            onPress={() => _.isEmpty(searchText) && navigation.pop()}>
            <Text>
              {_.isEmpty(searchText) ? t('button_cancel') : t('search')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <NavBar
          onPressLeft={stopSound}
          parentComponentId={componentId}
          title={
            type === 'topic' ? topic.name || topic.category_name : t('music')
          }
        />
      )}
      {songs.data.length === 0 ? (
        <Text style={{ flex: 1, alignSelf: 'center', paddingTop: wp(30) }}>
          {t('noData')}
        </Text>
      ) : (
        <FlatList
          data={songs.data}
          showsVerticalScrollIndicator={false}
          renderItem={renderSongItem}
          style={style.listSong}
          keyExtractor={index => index.toString()}
          onEndReachedThreshold={0}
          onEndReached={handleLoadMore}
        />
      )}
    </Layout>
  );
};

export default MusicList;
