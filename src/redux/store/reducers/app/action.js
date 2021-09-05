import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

import actionTypes from './type';
import Storage from '../../../../storage';
import { FIREBASE_COLLECTIONS } from '../../../../commons/firebase';

const usersRef = firestore().collection(FIREBASE_COLLECTIONS.users);

export function signIn(userData) {
  return dispatch => {
    Storage.saveUser(userData)
      .then(user => {
        dispatch(changeUser(user));
        // call to firebase
        usersRef
          .doc(`${user.id}`)
          .get()
          .then(doc => {
            const fUser = {
              id: user.id,
              name: user.hoten,
              avatar: user.icon,
              lastOnline: firestore.FieldValue.serverTimestamp(),
              updatedAt: firestore.FieldValue.serverTimestamp(),
            };
            if (!doc.exists) {
              usersRef.doc(`${user.id}`).set({
                ...fUser,
                conversations: [],
                createdAt: firestore.FieldValue.serverTimestamp(),
              });
            } else {
              usersRef.doc(`${user.id}`).set(
                {
                  ...fUser,
                },
                { merge: true },
              );
            }
          });
      })
      .catch(error => {
        console.log('signIn -> error', error);
      });
  };
}

export function signOut() {
  return dispatch => {
    Storage.removeUser();
    dispatch(changeUser(null));
  };
}

export function appInitialized() {
  return changeAppInitializing(false);
}

export function appStartInitializing() {
  return changeAppInitializing(true);
}

export function updateUserInfo(userData) {
  return dispatch => {
    Storage.saveUser(userData)
      .then(user => {
        dispatch(changeUser(user));
        // call to firebase
        usersRef
          .doc(`${user.id}`)
          .get()
          .then(doc => {
            const fUser = {
              id: user.id,
              name: user.hoten,
              avatar: user.icon,
              lastOnline: firestore.FieldValue.serverTimestamp(),
              updatedAt: firestore.FieldValue.serverTimestamp(),
            };
            if (!doc.exists) {
              usersRef.doc(`${user.id}`).set({
                ...fUser,
                conversations: [],
                createdAt: firestore.FieldValue.serverTimestamp(),
              });
            } else {
              usersRef.doc(`${user.id}`).set(
                {
                  ...fUser,
                },
                { merge: true },
              );
            }
          });
      })
      .catch(error => {
        console.log('updateUserInfo -> error', error);
      });
  };
}

export function changeAppInitializing(initializing) {
  return { type: actionTypes.APP_INITIALIZING_CHANGED, initializing };
}

export function changeUser(user) {
  return { type: actionTypes.USER_CHANGED, user };
}

export function changeOpeningConversation(openingConversation) {
  return { type: actionTypes.OPENING_CONVERSATION, openingConversation };
}

export function changeNumberOfUnreadMessage(numberOfUnreadMessage) {
  return {
    type: actionTypes.NOTIFICATION,
    notification: { numberOfUnreadMessage },
  };
}

export function changeNumberOfUnreadNotify(numberOfUnreadNotify) {
  return {
    type: actionTypes.NOTIFICATION,
    notification: { numberOfUnreadNotify },
  };
}

export function changeNotificationUnreadNumber(
  numberOfUnreadMessage,
  numberOfUnreadNotify,
) {
  return {
    type: actionTypes.NOTIFICATION,
    notification: { numberOfUnreadMessage, numberOfUnreadNotify },
  };
}

export function changeOpenedNotification(openedNotification) {
  return {
    type: actionTypes.NOTIFICATION,
    notification: { openedNotification },
  };
}
