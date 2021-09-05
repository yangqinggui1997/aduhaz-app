export default class FavoritePostModel {
  constructor() {
    this.id = 0;
    this.postTitle = '';
    this.icon = '';
    this.price = 0;
    this.province = '';
    this.postDate = 0;
    this.comments = 0;
    this.views = 0;
    this.likes = 0;
  }

  update(data) {
    this.id = data.id;
    this.postTitle = data.title;
    this.icon = data.poster;
    this.price = data.price;
    this.province = data.province;
    this.postDate = data.date_submitted;
    this.comments = data.amount_of_comment;
    this.views = data.amount_of_view;
    this.likes = data.amount_of_like;
  }

  static clone(data) {
    const cloneData = new FavoritePostModel();
    cloneData.update(data);
    return cloneData;
  }
}
