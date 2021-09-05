import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import moment from 'moment';
import _ from 'lodash';
import { TypingAnimation } from 'react-native-typing-animation';
import DocumentPicker from 'react-native-document-picker';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  Keyboard,
  Image,
  Vibration,
  Linking,
} from 'react-native';
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  Send,
  Time,
  utils,
  Composer,
  MessageText,
} from 'react-native-gifted-chat';
import Video from 'react-native-video';
import Entypo from 'react-native-vector-icons/Entypo';
import Geolocation from 'react-native-geolocation-service';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { useNavigation } from '../../hooks';
import Screens from '../screens';
import { wp } from '../../commons/responsive';
import { useTranslation } from 'react-i18next';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import Footer from './footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {
  FIREBASE_COLLECTIONS,
  FIREBASE_MESSAGE_TYPE,
  getOverviewMessage,
} from '../../commons/firebase';
import apiService from '../../services';
import Utils from '../../commons/utils';
import { NOTIFICATION_TYPE } from '../../commons/constants';
import images from '../../assets/images';
import { Colors } from '../../theme';
import storage from '../../storage';
import { WebView } from 'react-native-webview';

const { isSameDay } = utils;

const conversationsRef = firestore().collection(
  FIREBASE_COLLECTIONS.conversations,
);

const usersRef = firestore().collection(FIREBASE_COLLECTIONS.users);

function Conversation({
  componentId,
  currentUser,
  buyer,
  seller,
  post,
  showLoading,
  conversationId,
  conversationBlockedStatus,
}) {
  const navigation = useNavigation(componentId);
  const { t } = useTranslation();
  const conversationInfo = useRef(null);

  // buyer
  const fBuyer = {
    id: buyer.id,
    name: buyer.hoten,
    avatar: buyer.icon,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  if (fBuyer.id === currentUser.id) {
    fBuyer.lastOnline = firestore.FieldValue.serverTimestamp();
  }
  // seller
  const fSeller = {
    id: seller.id,
    name: seller.hoten,
    avatar: seller.icon,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };
  if (fSeller.id === currentUser.id) {
    fSeller.lastOnline = firestore.FieldValue.serverTimestamp();
  }

  const [messages, setMessages] = useState([]);
  const [suggestMessage, setSuggestMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // did mount
  useEffect(() => {
    checkExistConversationAndCreateNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // listen conversation changed
  useEffect(() => {
    const conversationListener = conversationsRef
      .doc(conversationId)
      .onSnapshot(docSnapshot => {
        if (docSnapshot && docSnapshot.exists) {
          const conversation = docSnapshot.data();
          if (conversation) {
            // check typing status
            if (conversation.typing) {
              const partnerId =
                currentUser.id === fBuyer.id ? fSeller.id : fBuyer.id;
              if (partnerId && conversation.typing[partnerId]) {
                const typingTime = moment(
                  conversation.typing[partnerId].seconds * 1000,
                ).valueOf();
                setIsTyping(moment().diff(typingTime, 'second') < 10);
              } else {
                setIsTyping(false);
              }
            }
          }
        }
      });

    return () => conversationListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // listen new message
  useEffect(() => {
    const messagesListener = conversationsRef
      .doc(conversationId)
      .collection(FIREBASE_COLLECTIONS.messages)
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const needSetReceivedMsgIds = [];
        const resMessages = [];
        querySnapshot.forEach(msg => {
          const msgData = msg.data();
          const sender = msgData.userId === fBuyer.id ? fBuyer : fSeller;
          const data = {
            _id: msg.id,
            createdAt: msgData.createdAt,
            sent: msgData.sent,
            received: msgData.received,
            user: {
              _id: sender.id,
              ...sender,
            },
            meta: msgData.meta,
          };
          switch (msgData.type) {
            case FIREBASE_MESSAGE_TYPE.text:
              data.text = msgData.content;
              break;
            case FIREBASE_MESSAGE_TYPE.audio:
              data.audio = msgData.content;
              break;
            case FIREBASE_MESSAGE_TYPE.video:
              data.video = msgData.content;
              break;
            case FIREBASE_MESSAGE_TYPE.image:
              data.image = msgData.content;
              break;
            case FIREBASE_MESSAGE_TYPE.document:
              data.document = msgData.content;
              break;
            case FIREBASE_MESSAGE_TYPE.location:
              data.location = `https://www.google.com/maps/search/?api=1&query=${msgData.content}`;
              break;
          }
          // parse server timestamp
          if (msgData.createdAt && msgData.createdAt.seconds) {
            data.createdAt = moment(msgData.createdAt.seconds * 1000).valueOf();
          }
          // check to set received
          if (!msgData.received && msgData.userId !== currentUser.id) {
            needSetReceivedMsgIds.push(msg.id);
          }
          resMessages.push(data);
        });
        setMessages(resMessages);
        // update received message if any
        if (needSetReceivedMsgIds.length > 0) {
          Vibration.vibrate();
          Promise.all(
            needSetReceivedMsgIds.map(msgId =>
              conversationsRef
                .doc(conversationId)
                .collection(FIREBASE_COLLECTIONS.messages)
                .doc(msgId)
                .set(
                  {
                    received: true,
                  },
                  { merge: true },
                ),
            ),
          ).catch(error => console.log('update received error:', error));
        }
      });

    return () => messagesListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkExistConversationAndCreateNew = useCallback(async () => {
    // create buyer on firebase
    if (!(await usersRef.doc(buyer.id.toString()).get()).exists) {
      await usersRef.doc(buyer.id.toString()).set({
        ...fBuyer,
        conversations: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // update buyer on firebase
      console.log('fBuyer: ', fBuyer);
      await usersRef.doc(buyer.id.toString()).set(
        {
          ...fBuyer,
        },
        { merge: true },
      );
    }
    // create seller on firebase
    if (!(await (await usersRef.doc(seller.id.toString()).get()).exists)) {
      await usersRef.doc(seller.id.toString()).set({
        ...fSeller,
        conversations: [],
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // update seller on firebase
      console.log('fSeller: ', fSeller);
      await usersRef.doc(seller.id.toString()).set(
        {
          ...fSeller,
        },
        { merge: true },
      );
    }

    // create conversation
    // conversation
    const fConvrs = {
      id: conversationId,
      userId: buyer.id,
      sellerId: seller.id,
      productId: post.id,
    };
    const res = await conversationsRef.doc(conversationId).get();
    if (res.exists) {
      console.log('conversation existed!');
      conversationInfo.current = res.data();
      if (
        conversationInfo.current.createdAt &&
        conversationInfo.current.createdAt.seconds
      ) {
        conversationInfo.current.createdAt = moment(
          conversationInfo.current.createdAt.seconds * 1000,
        ).valueOf();
      }
      // rejoin if needed
      const currentUserDoc = await usersRef
        .doc(currentUser.id.toString())
        .get();
      if (currentUserDoc.exists) {
        const currentUserData = currentUserDoc.data();
        if (
          currentUserData.conversations &&
          !currentUserData.conversations.find(con => con === conversationId)
        ) {
          await usersRef.doc(currentUser.id.toString()).set(
            {
              conversations: firestore.FieldValue.arrayUnion(conversationId),
            },
            { merge: true },
          );
        }
      }
    } else {
      try {
        // create a conversation with id = conversationId;
        await conversationsRef.doc(conversationId).set({
          ...fConvrs,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        // add this converstion id to buyer
        const updatedFBuyer = {
          conversations: firestore.FieldValue.arrayUnion(conversationId),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };
        if (buyer.id === currentUser.id) {
          updatedFBuyer.lastOnline = firestore.FieldValue.serverTimestamp();
        }
        await usersRef.doc(buyer.id.toString()).set(
          {
            ...updatedFBuyer,
          },
          { merge: true },
        );
        // add this converstion id to seller
        const updatedFSeller = {
          conversations: firestore.FieldValue.arrayUnion(conversationId),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };
        if (seller.id === currentUser.id) {
          updatedFSeller.lastOnline = firestore.FieldValue.serverTimestamp();
        }
        await usersRef.doc(seller.id.toString()).set(
          {
            ...updatedFSeller,
          },
          { merge: true },
        );
        // call to server
        await apiService.createConversation(seller.id, post.id, conversationId);
      } catch (error) {
        console.log('conversation - error:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Add message to Message collection
   *
   * @param { string } type
   * @param { string } content
   * @param { object } meta
   * @param { string } senderId
   */
  async function sendMessageToFirebase(type, content, meta, senderId) {
    console.log('type, content, sender: ', type, content, senderId);
    const msg = {
      type,
      content,
      meta,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      userId: senderId,
      sent: true,
      received: false,
    };
    // create message
    const msgDoc = await conversationsRef
      .doc(conversationId)
      .collection(FIREBASE_COLLECTIONS.messages)
      .add(msg);
    // update latest message in conversation
    conversationsRef.doc(conversationId).set(
      {
        lastMessageId: msgDoc.id,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      },
    );
    // update to buyer
    const updatedBuyer = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
    if (buyer.id === currentUser.id) {
      updatedBuyer.lastOnline = firestore.FieldValue.serverTimestamp();
    }
    usersRef.doc(buyer.id.toString()).set(updatedBuyer, { merge: true });
    // update to seller
    const updatedSeller = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
    if (seller.id === currentUser.id) {
      updatedSeller.lastOnline = firestore.FieldValue.serverTimestamp();
    }
    usersRef.doc(seller.id.toString()).set(updatedSeller, { merge: true });
    // send push notification
    const receiverId = senderId === seller.id ? buyer.id : seller.id;
    apiService
      .pushMessageNotification(
        t('youHaveNewMessage'),
        getOverviewMessage(msg, t),
        post.id,
        receiverId,
        { type: NOTIFICATION_TYPE.CHAT_MESSAGE, conversation: conversationId },
      )
      .then(res => console.log('pushMessageNotification - res: ', res))
      .catch(error =>
        console.log('pushMessageNotification - error: ', JSON.stringify(error)),
      );
  }

  const requestLocationPermission = async () => {
    onComposerTextBlur();
    Keyboard.dismiss();
    try {
      showLoading(true);
      let permission = true;
      let permissionStatus;
      if (Platform.OS === 'ios') {
        permissionStatus = await Geolocation.requestAuthorization('whenInUse');
      } else if (Platform.OS === 'android') {
        permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
      }
      permission = permissionStatus === 'granted';
      if (permission) {
        // get current location
        const position = await getCurrentPosition();
        if (position) {
          sendMessageToFirebase(
            FIREBASE_MESSAGE_TYPE.location,
            `${position.coords.latitude},${position.coords.longitude}`,
            { ...position },
            currentUser.id,
          );
        }
      } else {
        // remove user location
        Alert.alert(t('pleaseAllowToAccessYourLocation'));
      }
    } catch (error) {
      console.log('_requestLocationPermission -> error', error);
    } finally {
      showLoading(false);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('[Geolocation] watchPosition: ', position);
          resolve(position);
        },
        error => {
          console.log('[Geolocation] watchPosition error. ', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
          showLocationDialog: false,
        },
      );
    });
  };

  const doUploadFileAndSendMessage = async (file, messageType, meta) => {
    if (file) {
      try {
        showLoading(true);
        console.log('upload file: ', JSON.stringify(file));
        const response = await apiService.uploadFile([file], conversationId);
        console.log('upload file - response: ', JSON.stringify(response));
        if (
          Utils.isResponseSuccess(response) &&
          response.data.data.length > 0
        ) {
          const uploadedImageUrl = response.data.data[0];
          console.log(
            'doUploadFileAndSendMessage - uploadedImageUrl: ',
            uploadedImageUrl,
          );
          sendMessageToFirebase(
            messageType,
            uploadedImageUrl,
            meta,
            currentUser.id,
          );
        }
      } catch (error) {
        console.log(
          'doUploadFileAndSendMessage - error: ',
          JSON.stringify(error),
        );
      } finally {
        showLoading(false);
      }
    }
  };

  const openVideoSelection = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'video',
        usedCameraButton: true,
        allowedVideoRecording: true,
        allowedPhotograph: false,
        allowedVideo: true,
        singleSelectedMode: true,
        selectedAssets: [],
        maxVideoDuration: 10000,
      });
      console.log('###openVideoSelection - response: ', response);
      if (response && response.length > 0) {
        const videoFile = response[0];
        if (Utils.isAndroid()) {
          videoFile.duration = videoFile.duration / 1000;
          videoFile.path = videoFile.realPath.startsWith('file://')
            ? videoFile.realPath
            : `file://${videoFile.realPath}`;
          videoFile.filename = videoFile.fileName;
        }
        const maxDuration = 60 * 5; // 5 minutes
        const duration = videoFile.duration;
        if (duration <= maxDuration) {
          // do upload
          doUploadFileAndSendMessage(
            {
              uri: videoFile.path,
              type: videoFile.mime,
              fileName: videoFile.filename,
            },
            FIREBASE_MESSAGE_TYPE.video,
            { ...videoFile },
          );
        } else {
          setTimeout(() => {
            navigation.showModal(Screens.TrimmerView, {
              videoFile,
              maxDuration: maxDuration,
              onFinish: _videoFile => {
                console.log('###Trim video: ', _videoFile);
                const paths = _videoFile.path.split('/');
                // do upload
                doUploadFileAndSendMessage(
                  {
                    uri: _videoFile.path,
                    type: _videoFile.mime,
                    fileName: paths[paths.length - 1],
                  },
                  FIREBASE_MESSAGE_TYPE.video,
                  { ...videoFile },
                );
              },
            });
          }, 1000);
        }
      }
    } catch (e) {
      console.log('###openVideoSelection - error: ', e);
    }
  };

  const openPhotoSelection = async () => {
    onComposerTextBlur();
    Keyboard.dismiss();
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        isPreview: false,
        selectedAssets: [],
        singleSelectedMode: true,
      });
      console.log('###openPhotoSelection - response: ', response);
      if (response && response.length > 0) {
        const asset = response[0];
        if (Utils.isAndroid()) {
          asset.path = asset.realPath;
          asset.filename = asset.fileName;
        }
        doUploadFileAndSendMessage(
          {
            uri: asset.path,
            type: asset.mime,
            fileName: asset.filename,
          },
          FIREBASE_MESSAGE_TYPE.image,
          { ...asset },
        );
      }
    } catch (e) {
      console.log('###openPhotoSelection - error: ', e);
    }
  };

  const openDocumentAttachSelection = async () => {
    onComposerTextBlur();
    Keyboard.dismiss();
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
        copyTo: 'cachesDirectory',
      });
      console.log('###DocumentPicker.pick - res: ', res);
      if (res) {
        doUploadFileAndSendMessage(
          {
            uri: res.fileCopyUri,
            type: res.type,
            fileName: res.name,
          },
          FIREBASE_MESSAGE_TYPE.document,
          { ...res },
        );
      }
    } catch (err) {
      console.log('###openDocumentAttachSelection - error: ', err);
    }
  };

  async function handleSend(msg) {
    onComposerTextBlur();
    const { text, user: sender } = msg[0];
    sendMessageToFirebase(FIREBASE_MESSAGE_TYPE.text, text, {}, sender._id);
  }

  const onPressRating = useCallback(() => {
    onComposerTextBlur();
    Keyboard.dismiss();
    navigation.push(Screens.Rating, {
      userId: buyer.id,
      postId: post.id,
    });
  }, [buyer.id, navigation, onComposerTextBlur, post.id]);

  const onPressSendSuggestMessage = useCallback(
    msg => {
      onComposerTextBlur();
      setSuggestMessage(msg);
    },
    [onComposerTextBlur],
  );

  function _renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.flatWhite,
          },
          left: {
            backgroundColor: colors.flatWhite,
          },
        }}
        textStyle={{
          right: {
            color: colors.black,
          },
          left: {
            color: colors.black,
          },
        }}
      />
    );
  }

  function _renderMessageText(props) {
    return (
      <MessageText
        {...props}
        linkStyle={{
          right: {
            color: colors.black,
          },
          left: {
            color: colors.black,
          },
        }}
      />
    );
  }

  function _renderTime(timeProps) {
    return (
      <Time
        {...timeProps}
        timeTextStyle={{
          left: [styles.timeText],
          right: [styles.timeText],
        }}
      />
    );
  }

  function _renderDay(dayProps) {
    const { currentMessage, previousMessage, wrapperStyle } = dayProps;
    if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
      return (
        <View style={[styles.dayContainer]}>
          <View style={wrapperStyle}>
            <Text style={[styles.dayText]}>
              {dayjs(currentMessage.createdAt)
                .locale(storage.userLanguage)
                .format('dddd, DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  }

  function _renderSend(props) {
    return (
      <Send {...props} containerStyle={styles.sendingContainer}>
        <Ionicons name="send-sharp" size={24} color={colors.black} />
      </Send>
    );
  }

  function _renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  function _renderActions() {
    return (
      <View style={styles.actionBox}>
        <TouchableOpacity
          onPress={openPhotoSelection}
          disabled={conversationBlockedStatus}>
          <Ionicons name="image-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pinIcon}
          onPress={openVideoSelection}
          disabled={conversationBlockedStatus}>
          <Ionicons name="film-outline" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pinIcon}
          onPress={openDocumentAttachSelection}
          disabled={conversationBlockedStatus}>
          <Ionicons name="attach" size={24} color={colors.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.pinIcon}
          onPress={requestLocationPermission}
          disabled={conversationBlockedStatus}>
          <Entypo name="location-pin" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
    );
  }

  function _renderInputToolbar(inputToolbarProps) {
    return (
      <InputToolbar
        {...inputToolbarProps}
        primaryStyle={styles.inputToolbarContainerStyle}
      />
    );
  }

  const onComposerTextKeyPress = () => {
    console.log('onComposerTextKeyPress');
    conversationsRef.doc(conversationId).set(
      {
        typing: {
          [currentUser.id]: firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true },
    );
  };

  const onComposerTextFocus = () => {
    console.log('onComposerTextFocus');
    conversationsRef.doc(conversationId).set(
      {
        typing: {
          [currentUser.id]: firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true },
    );
  };

  const onComposerTextBlur = useCallback(() => {
    console.log('onComposerTextBlur');
    conversationsRef.doc(conversationId).set(
      {
        typing: {
          [currentUser.id]: null,
        },
      },
      { merge: true },
    );
  }, [conversationId, currentUser.id]);

  function _renderComposer(props) {
    return (
      <Composer
        {...props}
        disableComposer={conversationBlockedStatus}
        textInputProps={{
          // onFocus: onComposerTextFocus,
          onBlur: onComposerTextBlur,
          onKeyPress: onComposerTextKeyPress,
        }}
      />
    );
  }

  const isShowingRating = () => {
    let isShowing = false;
    if (conversationInfo.current) {
      const durration = moment().valueOf() - conversationInfo.current.createdAt;
      isShowing =
        2 * 24 * 60 * 60 * 1000 < durration &&
        durration < 7 * 24 * 60 * 60 * 1000;
    }
    return isShowing;
  };

  function _renderChatFooter() {
    // get partner
    let partnerName = '';
    if (fBuyer.id === currentUser.id) {
      partnerName = fSeller.name;
    } else {
      partnerName = fBuyer.name;
    }
    return isTyping ? (
      <View style={styles.typingContainer}>
        <Text style={styles.typingUserName}>{partnerName}</Text>
        <Text style={styles.typingText}>{` ${t('userIsTyping')}`}</Text>
        <TypingAnimation
          dotColor="black"
          dotMargin={5}
          dotAmplitude={3}
          dotSpeed={0.15}
          dotRadius={2.5}
        />
      </View>
    ) : currentUser.id === buyer.id ? (
      <Footer
        onPressRating={onPressRating}
        onPressSendSuggestMessage={onPressSendSuggestMessage}
        seller={seller}
        categoryId={post?.categoryId}
        showRating={isShowingRating()}
        showSuggestMessage={messages.length === 0}
      />
    ) : null;
  }

  const onPressVideoMessage = videoMessage => {
    // open video player screen
    if (videoMessage) {
      navigation.showModal(Screens.VideoPlayerScreen, {
        url: videoMessage.video,
      });
    }
  };

  const _renderMessageVideo = props => {
    const { currentMessage } = props;
    const { video, meta } = currentMessage;
    let width = 200;
    let height = 250;
    if (meta && !_.isEmpty(meta) && meta.width && meta.height) {
      width = meta.width;
      height = meta.height;
    }
    return (
      <View>
        <Video
          style={{
            borderRadius: 20,
            width: width / height > 1 ? 250 : 200,
            aspectRatio: width / height,
          }}
          resizeMode="contain"
          muted={true}
          paused={true}
          source={{ uri: video }}
          allowsExternalPlayback={false}
        />
        <TouchableOpacity
          style={styles.playButtonContainer}
          onPress={() => onPressVideoMessage(currentMessage)}>
          <Image source={images.icon_play_video} style={styles.playButton} />
        </TouchableOpacity>
      </View>
    );
  };

  const _renderMessageLocation = props => {
    const {
      currentMessage: { location },
    } = props;
    const onPressLocation = () => {
      if (Linking.canOpenURL(location)) {
        Linking.openURL(location);
      }
    };
    return (
      <TouchableOpacity
        style={styles.locationContainer}
        onPress={onPressLocation}>
        {/* <WebView style={styles.locationPreview} source={{ uri: location }} /> */}
        <Image source={images.map_icon} style={styles.locationIcon} />
      </TouchableOpacity>
    );
  };

  const _renderMessageDocument = props => {
    const { currentMessage } = props;
    const { document, meta } = currentMessage;
    let fileName = document.split('/').pop();
    let size = 0;
    if (meta && !_.isEmpty(meta)) {
      if (meta.name) {
        fileName = meta.name;
      }
      if (meta.size) {
        size = meta.size;
      }
    }
    let icon = images.doc_icon;
    const ext = fileName.split('.').pop();
    if (ext && ext.toLowerCase() === 'pdf') {
      icon = images.pdf_icon;
    }
    const onPressDocument = () => {
      if (Linking.canOpenURL(document)) {
        Linking.openURL(document);
      }
    };
    return (
      <TouchableOpacity style={styles.docContainer} onPress={onPressDocument}>
        {/* <WebView
          style={styles.documentPreview}
          javaScriptEnabled={false}
          source={{ uri: document }}
        /> */}
        <Image source={icon} style={styles.docIcon} />
        <View style={styles.docInfo}>
          <Text style={styles.docName} numberOfLines={3}>
            {fileName}
          </Text>
          <Text style={styles.docSize}>{Utils.humanFileSize(size)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GiftedChat
      alwaysShowSend
      scrollToBottom
      showUserAvatar={false}
      messages={messages}
      user={{
        _id: currentUser.id,
        name: currentUser.hoten,
        avatar: currentUser.icon,
      }}
      placeholder={t('typeMessage')}
      locale="vi"
      text={suggestMessage}
      onSend={handleSend}
      renderBubble={_renderBubble}
      renderMessageText={_renderMessageText}
      renderSend={_renderSend}
      renderLoading={_renderLoading}
      renderTime={_renderTime}
      renderDay={_renderDay}
      renderInputToolbar={_renderInputToolbar}
      renderComposer={_renderComposer}
      renderActions={_renderActions}
      renderMessageVideo={_renderMessageVideo}
      renderMessageLocation={_renderMessageLocation}
      renderMessageDocument={_renderMessageDocument}
      renderChatFooter={_renderChatFooter}
      // bottomOffset={initialWindowMetrics.insets.bottom}
      onInputTextChanged={txt => setSuggestMessage(txt)}
    />
  );
}

export default Conversation;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: wp(15),
    paddingTop: wp(5),
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.black,
  },

  // day
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(5),
    marginBottom: wp(10),
  },
  dayText: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: wp(12),
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // input toolbar
  inputToolbarContainerStyle: {
    alignItems: 'flex-start',
  },

  // action
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: wp(5),
    paddingLeft: wp(10),
    paddingRight: wp(10),
  },
  pinIcon: {
    marginLeft: wp(7),
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: wp(55),
    height: wp(55),
  },
  typingContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(8),
    backgroundColor: Colors.lightFlatGrey,
  },
  typingUserName: {
    fontSize: 12,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  locationContainer: {
    padding: wp(8),
  },
  locationPreview: {
    flex: 1,
  },
  locationIcon: {
    width: wp(48),
    height: wp(48),
  },
  docContainer: {
    padding: wp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIcon: {
    width: wp(48),
    height: wp(64),
  },
  docInfo: {
    width: 200,
    justifyContent: 'space-between',
    padding: 10,
  },
  docName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  docSize: {
    marginTop: 5,
    fontSize: 10,
    fontStyle: 'italic',
  },
});
