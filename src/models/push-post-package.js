export default class PushPostModel {
    constructor() {
      this.name = '';
      this.price = 0;
      this.icon = '';
      this.description = '';
      this.type = '';
      this.times = [];
    }
  
    update(data) {
      this.name = data.name;
      this.price = data.price;
      this.icon = data.icon;
      this.description = data.description;
      this.type = data.type;
      this.times = data.list_of_days;
    }
  
    static clone(data) {
      const cloneData = new PushPostModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  