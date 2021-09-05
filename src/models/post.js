export default class PostModel {
  constructor() {
    this.id = 0;
    this.postTitle = '';
    this.price = 0;
    this.postDate = 0;
    this.province = '';
    this.icon = '';
    this.content = '';
    this.createdAt = '';
    this.view = 0;
    this.shareLink = 0;
    this.address = '';
    this.phoneNumber = null;
    this.comments = 0;
    this.like = 0;
    this.categoryName = '';
    this.categories = [];
    this.createdBy = {};
    this.images = [];
    this.categoryId = null;
    this.likeStatus = 0;
    this.saveStatus = 0;
    this.properties = [];
    this.sellBuy = null;
    this.postBy = null;
    this.type = '';
  }

  update(data) {
    this.id = data.id;
    this.postTitle = data.title;
    this.price = data.price;
    this.postDate = data.date_submitted;
    this.province = data.province;
    this.icon = data.icon || data.poster;
    this.content = data.content;
    this.createdAt = data.ngaydang;
    this.createdBy = data.user;
    this.view = data.soluotxem;
    this.shareLink = data.share_link;
    this.comments = data.comments;
    this.like = data.bv_like;
    this.address = data.address;
    this.phoneNumber = data.phone_number;
    this.categoryName = data.category_name;
    this.images = data.images;
    this.categoryId = data.id_category;
    this.likeStatus = data.like_status;
    this.saveStatus = data.save_status;
    this.properties = data.properties;
    this.type = data.type_post;
    this.sellBuy = data.is_sell_post;
    this.postBy = data.type_of_seller;
    this.categories = data.category_tree;
  }

  static clone(data) {
    const cloneData = new PostModel();
    cloneData.update(data);
    return cloneData;
  }
}
