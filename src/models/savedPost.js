export default class SavedPostModel {
  constructor() {
    this.id = 0;
    this.postTitle = '';
    this.poster = '';
    this.type = '';
    this.shareLink = '';
    this.user = {};
    this.dayOfPost = 0;
    this.views = 0;
  }

  update(data) {
    this.id = data.id;
    this.postTitle = data.title;
    this.poster = data.poster;
    this.type = data.type;
    this.shareLink = data.share_link;
    this.user = data.user;
    this.dayOfPost = data.date_submitted;
    this.views = data.amount_of_view;
  }

  static clone(data) {
    const cloneData = new SavedPostModel();
    cloneData.update(data);
    return cloneData;
  }
}
