export default class FavoriteStoryModel {
    constructor() {
      this.id = 0;
      this.title = '';
      this.poster = '';
      this.user = {};
    }
  
    update(data) {
      this.id = data.id;
      this.title = data.title;
      this.poster = data.poster;
      this.user = data.user;
    }
  
    static clone(data) {
      const cloneData = new FavoriteStoryModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  