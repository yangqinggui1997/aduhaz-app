export default class StoryImageItem {
  constructor() {
    this.id = 0;
    this.description = '';
    this.descriptionFont = '';
    this.descriptionColor = '';
    this.poster = '';
    this.numberOfViews = 0;
    this.numberOfLikes = 0;
    this.numberOfComments = 0;
    this.shareLink = '';
    this.images = [];
    this.song = null;
    this.clip_audio = null;
    this.user = null;
    this.liked = false;
    this.createdAt = null;
  }

  update(data) {
    this.id = data.id;
    this.description = data.description;
    this.descriptionFont = data.description_font;
    this.descriptionColor = data.description_color;
    this.poster = data.poster;
    this.numberOfViews = data.amount_of_view ?? 0;
    this.numberOfLikes = data.amount_of_like ?? 0;
    this.numberOfComments = data.comments ?? 0;
    this.shareLink = data.share_link;
    this.images = data.images;
    this.song = data.song;
    this.clip_audio = data.clip_audio;
    this.user = data.user;
    this.liked = data.like_status === 1;
    this.createdAt = data.created_at;
  }

  static clone(data) {
    const cloneData = new StoryImageItem();
    cloneData.update(data);
    return cloneData;
  }
}
