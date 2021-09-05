export const FIREBASE_COLLECTIONS = {
  users: 'USERS',
  conversations: 'CONVERSATIONS',
  messages: 'MESSAGES',
};

export const FIREBASE_MESSAGE_TYPE = {
  text: 'text',
  image: 'image',
  video: 'video',
  audio: 'audio',
  document: 'document',
  location: 'location',
};

export const getOverviewMessage = (message, t) => {
  let content = '';
  if (message) {
    content = message.content;
    switch (message.type) {
      case FIREBASE_MESSAGE_TYPE.audio:
      case FIREBASE_MESSAGE_TYPE.video:
      case FIREBASE_MESSAGE_TYPE.image:
      case FIREBASE_MESSAGE_TYPE.document:
        content = t('attachmentFile');
        break;
      case FIREBASE_MESSAGE_TYPE.location:
        content = t('attachmentLocation');
        break;
    }
  }
  return content;
};
