export default class UserStoryModel {
  constructor() {
    this.id = 0;
    this.title = '';
    this.poster = '';
    this.createdAt = '';
  }

  update(data) {
    this.id = data.id;
    this.title = data.title;
    this.poster = data.poster;
    this.createdAt = data.date_submitted;
  }

  static clone(data) {
    const cloneData = new UserStoryModel();
    cloneData.update(data);
    return cloneData;
  }
}
