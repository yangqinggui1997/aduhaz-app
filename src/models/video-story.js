export default class VideoStory {
  constructor() {
    this.id = 0;
    this.description = '';
    this.descriptionFont = '';
    this.descriptionColor = '';
    this.poster = '';
    this.mask = '';
    this.createdAt = '';
    this.shareLink = '';
    this.views = 0;
    this.comments = 0;
    this.likes = 0;
    this.liked = 0;
    this.saveStatus = 0;
    this.mutedVideo = false;
    this.video = {};
    this.song = '';
    this.clip_audio = null;
    this.user = {};
  }

  update(data) {
    this.id = data.id;
    this.description = data.description;
    this.descriptionFont = data.description_font;
    this.descriptionColor = data.description_color;
    this.poster = data.poster;
    this.mask = data.mask;
    this.createdAt = data.created_at;
    this.shareLink = data.share_link;
    this.views = data.amount_of_view;
    this.comments = data.comments;
    this.likes = data.amount_of_like;
    this.liked = data.like_status === 1;
    this.saveStatus = data.save_status;
    this.mutedVideo = data.mutedVideo;
    this.video = data.video;
    this.song = data.song;
    this.clip_audio = data.clip_audio;
    this.user = data.user;
  }

  static clone(data) {
    const cloneData = new VideoStory();
    cloneData.update(data);
    return cloneData;
  }
}
