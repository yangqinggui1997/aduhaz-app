export default class LocationModel {
    constructor() {
      this.id = '';
      this.name = '';
      this.seoName = '';
    }
  
    update(data) {
      this.id = data.id;
      this.name = data.name;
      this.seoName = data.seo_name;
    }
  
    static clone(data) {
      const cloneData = new LocationModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  