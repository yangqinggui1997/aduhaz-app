import React, { useCallback, useEffect, useState } from 'react';
import { View, Keyboard } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
  useNavigation,
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
} from '../../hooks';
import firestore from '@react-native-firebase/firestore';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

import Header from './header';
import { Layout, LoadingView, showListSelectionView } from '../../components';
import Product from './product';
import apiService from '../../services';
import PostModel from '../../models/post';
import UserModel from '../../models/user';
import Conversation from './conversation';
import styles from './style';
import Screens from '../screens';
import { FIREBASE_COLLECTIONS } from '../../commons/firebase';
import Utils from '../../commons/utils';
import * as appActions from '../../redux/store/reducers/app/action';
import storage from '../../storage';

dayjs.extend(relativeTime);
dayjs.locale(storage.userLanguage);
const usersRef = firestore().collection(FIREBASE_COLLECTIONS.users);

function ChatDetail({
  componentId,
  postId,
  buyerId,
  sellerId,
  isModal = false,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const navigation = useNavigation(componentId);

  const [isLoading, setIsLoading] = useState(false);
  const [postDetail, setPostDetail] = useState({ id: postId });
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [onLineStatus, setOnlineStatus] = useState('...');
  const [conversationNotiStatus, setConversationNotiStatus] = useState(true);
  const [partnerBlockedMeStatus, setPartnerBlockedMeStatus] = useState(false);
  const [meBlockedParnerStatus, setMeBlockedPartnerStatus] = useState(false);

  const conversationId = `${buyerId}-${sellerId}-${postId}`;
  console.log('###conversationId: ', conversationId);
  const viewDidAppear = e => {
    dispatch(appActions.changeOpeningConversation(conversationId));
  };

  const viewDidDisappear = e => {
    dispatch(appActions.changeOpeningConversation(null));
  };
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  useEffect(() => {
    setIsLoading(true);
    const tasks = [
      getProductDetail(postId),
      getBuyerSellerDetail(buyerId, sellerId),
      getConversationDetail(conversationId),
      usersRef.doc(user.id.toString()).get(),
    ];
    let partnerId;
    if (user.id === buyerId) {
      partnerId = sellerId;
    } else if (user.id === sellerId) {
      partnerId = buyerId;
    }
    Promise.all(tasks)
      .then(responses => {
        setIsLoading(false);
        // check user blacklist
        if (responses && responses.length === tasks.length) {
          const currentUserDoc = responses[tasks.length - 1];
          if (currentUserDoc.exists) {
            const currentUserData = currentUserDoc.data();
            if (currentUserData.blacklist) {
              // check if I have blocked my partner
              if (currentUserData.blacklist[partnerId]) {
                setMeBlockedPartnerStatus(true);
              } else {
                setMeBlockedPartnerStatus(false);
              }
            } else {
              setMeBlockedPartnerStatus(false);
            }
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
    // listen on partner changed
    let userListener;
    if (partnerId) {
      userListener = usersRef.doc(partnerId.toString()).onSnapshot(
        docSnapshot => {
          if (docSnapshot.exists) {
            const docUser = docSnapshot.data();
            if (docUser) {
              let lastOnline = docUser.lastOnline;
              if (docUser.lastOnline && docUser.lastOnline.seconds) {
                lastOnline = moment(
                  docUser.lastOnline.seconds * 1000,
                ).valueOf();
              }
              if (moment().valueOf() - lastOnline < 60 * 1000) {
                setOnlineStatus(t('activeStatus'));
              } else {
                setOnlineStatus(
                  `${t('onlineFrom')} ${dayjs().to(dayjs(lastOnline))}`,
                );
              }
              // check block status
              if (docUser.blacklist) {
                // check if I was blocked by my partner
                if (docUser.blacklist[user.id]) {
                  setPartnerBlockedMeStatus(true);
                } else {
                  setPartnerBlockedMeStatus(false);
                }
              } else {
                setPartnerBlockedMeStatus(false);
              }
            }
          }
        },
        error => console.log('userListener - error: ', error),
      );
    }
    return () => {
      if (userListener) {
        userListener();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductDetail = useCallback(async id => {
    try {
      const res = await apiService.getPostById(id);
      if (res?.data?.data) {
        const serializedPost = PostModel.clone(res.data.data);
        console.log('product detail: ', serializedPost);
        setPostDetail(serializedPost);
      }
    } catch (error) {
      console.log('get product detail error: ', error);
    }
  }, []);

  const getBuyerSellerDetail = useCallback(async (_buyerId, _sellerId) => {
    try {
      const responses = await Promise.all([
        apiService.getUserInfo(_buyerId),
        apiService.getUserInfo(_sellerId),
      ]);
      if (responses && responses.length > 0) {
        responses.forEach(res => {
          if (res?.data?.data) {
            const serializedUser = UserModel.clone(res.data.data);
            if (serializedUser.id === _buyerId) {
              setBuyer(serializedUser);
            } else if (serializedUser.id === _sellerId) {
              setSeller(serializedUser);
            }
          }
        });
      }
    } catch (error) {
      console.log('get buyer seller detail error: ', error);
    }
  }, []);

  const getConversationDetail = useCallback(async id => {
    try {
      const res = await apiService.getConversationFirebaseById(id);
      console.log('getConversationFirebaseById: ', res.data);
      if (res?.data?.data && res?.data?.data.length > 0) {
        setConversationNotiStatus(res?.data?.data[0].get_notification_status);
      }
    } catch (error) {
      console.log('getConversationFirebaseById error: ', JSON.stringify(error));
    }
  }, []);

  const isDataReady = () => {
    console.log('buyer: ', buyer);
    console.log('seller: ', seller);
    console.log('user: ', user);
    return buyer !== null && seller !== null && user !== null;
  };

  const onPressProduct = () => {
    Keyboard.dismiss();
    navigation.showModal(Screens.PostDetail, {
      postInfo: postDetail,
    });
  };

  const onMenuPress = () => {
    Keyboard.dismiss();
    showListSelectionView({
      title: t('menu'),
      items: [
        conversationNotiStatus
          ? t('turnOffNotification')
          : t('turnOnNotification'),
        t('deleteConversation'),
        meBlockedParnerStatus ? t('unblockUser') : t('blockUser'),
      ],
      showRadioButton: false,
      height: 175,
      onSelectedItem: selectedIndex => {
        if (Number(selectedIndex) === 0) {
          // turn on/off notification
          if (conversationNotiStatus) {
            // turn off
            apiService
              .turnOffNotificationFromUser({ conversationId })
              .then(response => {
                console.log(
                  'turnOffNotificationFromUser - response: ',
                  response,
                );
                if (Utils.isResponseSuccess(response)) {
                  setConversationNotiStatus(false);
                }
              })
              .catch(error =>
                console.log('turnOffNotificationFromUser: ', error),
              );
          } else {
            // turn on
            apiService
              .turnOnNotificationFromUser({ conversationId })
              .then(response => {
                console.log(
                  'turnOnNotificationFromUser - response: ',
                  response,
                );
                if (Utils.isResponseSuccess(response)) {
                  setConversationNotiStatus(true);
                }
              })
              .catch(error =>
                console.log('turnOnNotificationFromUser: ', error),
              );
          }
        } else if (Number(selectedIndex) === 1) {
          // delete conversation
          apiService
            .deleteConversationFirebase(conversationId)
            .then(response => {
              console.log('deleteConversationFirebase - response: ', response);
              if (Utils.isResponseSuccess(response)) {
                // do remove conversation out of user's conversations on firebase
                usersRef.doc(user.id.toString()).set(
                  {
                    conversations:
                      firestore.FieldValue.arrayRemove(conversationId),
                  },
                  { merge: true },
                );
                navigation.pop();
              }
            })
            .catch(error => console.log('deleteConversationFirebase: ', error));
        } else if (Number(selectedIndex) === 2) {
          let partnerId;
          if (user.id === buyerId) {
            partnerId = sellerId;
          } else if (user.id === sellerId) {
            partnerId = buyerId;
          }
          if (meBlockedParnerStatus) {
            // unblock
            apiService
              .unBlockUser(partnerId)
              .then(response => {
                console.log('unBlockUser - response: ', response);
                if (Utils.isResponseSuccess(response)) {
                  setMeBlockedPartnerStatus(false);
                  usersRef.doc(user.id.toString()).set(
                    {
                      blacklist: {
                        [partnerId]: null,
                      },
                    },
                    { merge: true },
                  );
                }
              })
              .catch(error => console.log('unBlockUser: ', error));
          } else {
            // block
            apiService
              .blockUser(partnerId)
              .then(response => {
                console.log('blockUser - response: ', response);
                if (Utils.isResponseSuccess(response)) {
                  setMeBlockedPartnerStatus(true);
                  usersRef.doc(user.id.toString()).set(
                    {
                      blacklist: {
                        [partnerId]: firestore.FieldValue.serverTimestamp(),
                      },
                    },
                    { merge: true },
                  );
                }
              })
              .catch(error => console.log('blockUser: ', error));
          }
        }
      },
    });
  };

  return (
    <Layout>
      {isDataReady() && (
        <View style={styles.container}>
          <Header
            parentComponentId={componentId}
            user={user.id === sellerId ? buyer : seller}
            onMenuPress={onMenuPress}
            onLineStatus={onLineStatus}
            isModal={isModal}
          />
          <Product
            icon={postDetail.icon}
            title={postDetail.postTitle}
            price={postDetail.price}
            onPress={onPressProduct}
          />
          <Conversation
            componentId={componentId}
            conversationId={conversationId}
            currentUser={user}
            buyer={buyer}
            post={postDetail}
            seller={seller}
            showLoading={setIsLoading}
            conversationBlockedStatus={
              partnerBlockedMeStatus || meBlockedParnerStatus
            }
          />
        </View>
      )}
      {isLoading && <LoadingView loading={isLoading} fullscreen />}
    </Layout>
  );
}

export default ChatDetail;
