export default class PostStatisticsModel {
  constructor() {
    this.id = 0;
    this.postTitle = '';
    this.price = 0;
    this.postDate = 0;
    this.province = '';
    this.icon = '';
    this.pageOrder = 1;
    this.cateId = 0;
    this.updateAt = 0;
    this.views = 0;
    this.impressions = 0;
    this.totalPage = 1;
  }

  update(data) {
    this.id = data.id;
    this.postTitle = data.title;
    this.price = data.price;
    this.postDate = data.date_submitted;
    this.province = data.location_of_post;
    this.icon = data.icon;
    this.pageOrder = data.page_order;
    this.totalPage = data.total_page;
    this.cateId = data.id_category;
    this.updateAt = data.updated_at;
    this.views = data.amount_of_view;
    this.impressions = data.amount_of_display;
  }

  static clone(data) {
    const cloneData = new PostStatisticsModel();
    cloneData.update(data);
    return cloneData;
  }
}
