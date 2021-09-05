import 'dayjs/locale/vi';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { View, TouchableOpacity, FlatList, Text, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import images from '../../assets/images';
import { Layout } from '../../components';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import ImageView from '../../components/image-view';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';

import {
  FIREBASE_COLLECTIONS,
  getOverviewMessage,
} from '../../commons/firebase';
import Loading from '../../components/loading-view';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import Screens from '../screens';
import apiService from '../../services';
import PostModel from '../../models/post';
import User from '../../models/user';
import { useCallback } from 'react';
import storage from '../../storage';

dayjs.extend(relativeTime);
dayjs.locale(storage.userLanguage);

const conversationsRef = firestore().collection(
  FIREBASE_COLLECTIONS.conversations,
);

const usersRef = firestore().collection(FIREBASE_COLLECTIONS.users);

const ChatList = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const { user } = useSelector(state => state.app);

  const [allThreads, setAllThreads] = useState([]);
  const [boughtThreads, setBoughtThreads] = useState([]);
  const [soldThreads, setSoldThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheProducts = useRef({});
  const cacheUsers = useRef({});
  const cacheLastMessages = useRef({});

  useEffect(() => {
    let unsubscribeUsers = null;
    if (user && user.id) {
      // observe users changed
      setLoading(true);
      unsubscribeUsers = usersRef.doc(user.id.toString()).onSnapshot(
        async documentSnapshot => {
          const fUser = documentSnapshot.data();
          if (
            documentSnapshot.exists &&
            fUser &&
            fUser.conversations &&
            fUser.conversations.length > 0
          ) {
            // query conversation info
            const conversationIds = [...fUser.conversations];
            const queryConversationPromises = [];
            let conversationIdsPerLoad = [];
            while (conversationIds.length) {
              conversationIdsPerLoad = conversationIds.splice(0, 10);
              queryConversationPromises.push(
                conversationsRef
                  .where('id', 'in', conversationIdsPerLoad)
                  .get(),
              );
            }
            // execute all queryConversationPromises
            const queryConversationResponses = await Promise.all(
              queryConversationPromises,
            );
            const threads = [];
            let productIds = [];
            let userIds = [];
            let lastMessageIds = [];
            queryConversationResponses.forEach(queryConversationResponse => {
              queryConversationResponse.forEach(conDocSnapshot => {
                const thread = conDocSnapshot.data();
                if (thread.lastMessageId) {
                  // populate last message
                  lastMessageIds.push({
                    conversationId: thread.id,
                    lastMessageId: thread.lastMessageId,
                  });
                  if (cacheLastMessages.current[thread.lastMessageId]) {
                    thread.lastMessage =
                      cacheLastMessages.current[thread.lastMessageId];
                  } else {
                    productIds.push(thread.productId);
                  }
                  // populate product from cache
                  if (cacheProducts.current[thread.productId]) {
                    thread.product = cacheProducts.current[thread.productId];
                  } else {
                    productIds.push(thread.productId);
                  }
                  // populate user from cache
                  if (cacheUsers.current[thread.userId]) {
                    thread.user = cacheUsers.current[thread.userId];
                  } else {
                    userIds.push(thread.userId);
                  }
                  if (cacheUsers.current[thread.sellerId]) {
                    thread.seller = cacheUsers.current[thread.sellerId];
                  } else {
                    userIds.push(thread.sellerId);
                  }
                  // parse time
                  if (thread.createdAt && thread.createdAt.seconds) {
                    thread.createdAt = moment(
                      thread.createdAt.seconds * 1000,
                    ).valueOf();
                  }
                  if (thread.updatedAt && thread.updatedAt.seconds) {
                    thread.updatedAt = moment(
                      thread.updatedAt.seconds * 1000,
                    ).valueOf();
                  }
                  threads.push(thread);
                }
              });
            });
            // sort thread by updatedAt DESC
            threads.sort((th1, th2) => th1.updatedAt < th2.updatedAt);
            setAllThreads(threads);
            // get conversation detail
            userIds = [...new Set(userIds)];
            productIds = [...new Set(productIds)];
            getDetailConversations(
              threads,
              lastMessageIds,
              userIds,
              productIds,
            );
          }
          setLoading(false);
        },
        error => {
          console.log('listen user error: ', error);
          setLoading(false);
        },
      );
    }
    return () => {
      if (unsubscribeUsers) {
        unsubscribeUsers();
      }
    };
  }, [getDetailConversations, t, user.id]);

  useEffect(() => {
    setBoughtThreads(allThreads.filter(thread => thread.userId === user.id));
    setSoldThreads(allThreads.filter(thread => thread.sellerId === user.id));
  }, [allThreads, user.id]);

  const getDetailConversations = useCallback(
    (threads, lastMessageIds, userIds, productIds) => {
      const allDetailPromises = [];
      // populate last message
      if (lastMessageIds.length > 0) {
        const lastMessagePromise = Promise.all(
          lastMessageIds.map(({ conversationId, lastMessageId }) =>
            conversationsRef
              .doc(conversationId)
              .collection(FIREBASE_COLLECTIONS.messages)
              .doc(lastMessageId)
              .get(),
          ),
        )
          .then(lastDocSnapshots => {
            lastDocSnapshots.forEach(lastDocSnapshot => {
              const msg = lastDocSnapshot.data();
              if (msg.createdAt && msg.createdAt.seconds) {
                msg.createdAt = moment(msg.createdAt.seconds * 1000).valueOf();
              }
              msg.content = getOverviewMessage(msg, t);
              cacheLastMessages.current[lastDocSnapshot.id] = msg;
            });
            // update last message to all threads
            setAllThreads(
              threads.map(thread => {
                thread.lastMessage =
                  cacheLastMessages.current[thread.lastMessageId];
                return thread;
              }),
            );
          })
          .catch(error => {
            console.log('query lastMessage error: ', error);
          });
        allDetailPromises.push(lastMessagePromise);
      }
      // populate user if any
      if (userIds.length > 0) {
        const userPromise = Promise.all(
          userIds.map(id => apiService.getUserInfo(id)),
        )
          .then(responses => {
            if (responses && responses.length > 0) {
              responses.forEach(res => {
                if (res?.data?.data) {
                  const serializedUser = User.clone(res.data.data);
                  console.log('serializedUser: ', serializedUser);
                  cacheUsers.current[serializedUser.id] = serializedUser;
                }
              });
            }
            // update user to all threads
            setAllThreads(
              threads.map(thread => {
                if (!thread.user && cacheUsers.current[thread.userId]) {
                  thread.user = cacheUsers.current[thread.userId];
                }
                if (!thread.seller && cacheUsers.current[thread.sellerId]) {
                  thread.seller = cacheUsers.current[thread.sellerId];
                }
                return thread;
              }),
            );
          })
          .catch(error => console.log('query user error: ', error));
        allDetailPromises.push(userPromise);
      }
      // populate product if any
      if (productIds.length > 0) {
        const productPromise = Promise.all(
          productIds.map(id => apiService.getPostById(id)),
        )
          .then(responses => {
            responses.forEach(response => {
              if (response?.data?.data) {
                const serializedPost = PostModel.clone(response.data.data);
                cacheProducts.current[serializedPost.id] = serializedPost;
              }
            });
            // update product to all threads
            setAllThreads(
              threads.map(thread => {
                if (
                  !thread.product &&
                  cacheProducts.current[thread.productId]
                ) {
                  thread.product = cacheProducts.current[thread.productId];
                }
                return thread;
              }),
            );
          })
          .catch(error => {
            console.log('getPostById - error: ', error);
          });
        allDetailPromises.push(productPromise);
      }
      if (allDetailPromises && allDetailPromises.length > 0) {
        setLoading(true);
        Promise.all(allDetailPromises)
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
    },
    [t],
  );

  const onPressConversation = item => {
    console.log('conversation info: ', item);
    navigation.push(Screens.ChatDetail, {
      postId: item.productId,
      buyerId: item.userId,
      sellerId: item.sellerId,
    });
  };

  function getAvatar(item) {
    if (item?.seller?.id) {
      if (user.id !== item.seller.id) {
        return {
          uri: item.seller.icon,
        };
      }
      return item?.user?.icon ? { uri: item.user.icon } : images.avatar_empty;
    }
    return images.avatar_empty;
  }

  function getUserFullName(item) {
    if (item?.seller?.hoten) {
      if (user.id !== item.seller.id) {
        return item.seller.hoten;
      }
      return item?.user?.hoten;
    }
    return null;
  }

  const renderOnlineStatus = item => {
    let onlineComp = null;
    if (item.seller?.id) {
      let _user;
      if (user.id !== item.seller.id) {
        _user = item.seller;
      } else {
        _user = item.user;
      }
      if (_user) {
        let backgroundColor = colors.orange;
        if (_user && _user.lastOnline && _user.lastOnline.seconds) {
          const lastOnline = moment(_user.lastOnline.seconds * 1000).valueOf();
          if (moment().valueOf() - lastOnline < 60 * 1000) {
            backgroundColor = colors.green;
          }
        }
        onlineComp = <View style={[style.onlineStatus, { backgroundColor }]} />;
      }
    }
    return onlineComp;
  };

  const renderChat = (index, item) => {
    const { product } = item;
    const productImages = [];
    if (product && product.images) {
      const imageUrls = product.images.map(img => img.directory);
      for (const imageUrl of imageUrls) {
        if (!_.isEmpty(imageUrl)) {
          productImages.push({ uri: imageUrl });
        }
        if (productImages.length >= 2) {
          break;
        }
      }
    }
    while (productImages.length < 2) {
      productImages.push(images.empty);
    }
    // check if the latest message is unread
    let unread = false;
    if (item && item.lastMessage) {
      unread =
        item.lastMessage.userId !== user.id && !item.lastMessage.received;
    }
    return (
      <TouchableOpacity
        style={style.messageItem}
        onPress={() => onPressConversation(item)}>
        <View>
          <ImageView source={getAvatar(item)} style={style.messageAvatar} />
          {renderOnlineStatus(item)}
        </View>
        <View style={style.contentMessage}>
          <View style={style.textContent}>
            <View style={style.header}>
              <Text
                style={[style.user, unread && style.boldText]}
                numberOfLines={2}>
                {`${getUserFullName(item)} - ${dayjs().to(
                  dayjs(item?.lastMessage?.createdAt),
                )}`}
              </Text>
            </View>
            <Text style={[style.message, unread && style.boldText]}>
              {item?.lastMessage?.content}
            </Text>
          </View>
          <View style={style.imageContent}>
            <ImageView source={productImages[1]} style={style.postImage2} />
            <ImageView source={productImages[0]} style={style.postImage1} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => <View style={style.separator} />;

  const all = () => (
    <FlatList
      style={[style.scene]}
      data={allThreads}
      renderItem={({ item, index }) => renderChat(index, item)}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={(_, index) => 'key' + index.toString()}
      bounces={false}
    />
  );
  const bought = () => (
    <FlatList
      style={[style.scene]}
      data={boughtThreads}
      renderItem={({ item, index }) => renderChat(index, item)}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={(_, index) => 'key' + index.toString()}
      bounces={false}
    />
  );
  const sold = () => (
    <FlatList
      style={[style.scene]}
      data={soldThreads}
      renderItem={({ item, index }) => renderChat(index, item)}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={(_, index) => 'key' + index.toString()}
      bounces={false}
    />
  );
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: t('all') },
    { key: 'second', title: t('bought') },
    { key: 'third', title: t('sold') },
  ]);
  const renderScene = SceneMap({
    first: all,
    second: bought,
    third: sold,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={style.tabarIndicator}
      style={style.tabar}
      renderLabel={({ route, focused }) => (
        <Text style={!focused ? style.tabarLable : style.tabarLableFocused}>
          {route.title}
        </Text>
      )}
    />
  );
  const onPressBack = () => {
    Navigation.dismissModal(componentId);
  };

  return (
    <Layout
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={style.chatHeader}>
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={colors.flatBlack02}
          />
        </TouchableOpacity>
        <Text style={style.titleHeader}>{t('chatList')}</Text>
      </View>
      <TabView
        style={style.body}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
      {loading && <Loading fullscreen loading={loading} />}
    </Layout>
  );
};

export default ChatList;
