export class RatingDetailModel {
  constructor() {
    this.id = 0;
    this.user = {};
    this.desc = '';
    this.rating = 0;
    this.date = '';
  }

  update(data) {
    this.id = data.id_post;
    this.user = data.user;
    this.desc = data.content;
    this.rating = data.amount_of_star;
    this.date = data.date_submitted;
  }

  static clone(data) {
    const cloneData = new RatingDetailModel();
    cloneData.update(data);
    return cloneData;
  }
}
