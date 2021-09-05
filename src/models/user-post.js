export default class UserPostModel {
  constructor() {
    this.id = 0;
    this.postTitle = '';
    this.price = 0;
    this.postDate = 0;
    this.shareLink = '';
    this.icon = '';
    this.cateId = 0;
    this.images = [];
    this.poster = '';
  }

  update(data) {
    this.id = data.id;
    this.postTitle = data.title;
    this.price = data.price;
    this.postDate = data.date_submitted;
    this.shareLink = data.share_link;
    this.icon = data.icon;
    this.cateId = data.id_category;
    this.images = data.images;
    this.poster = data.poster;
  }

  static clone(data) {
    const cloneData = new UserPostModel();
    cloneData.update(data);
    return cloneData;
  }
}
