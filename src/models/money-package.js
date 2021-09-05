export default class MoneyPackageModel {
    constructor() {
      this.id = 0;
      this.title = '';
      this.price = 0;
      this.discount = 0;
    }
  
    update(data) {
      this.id = data.id;
      this.title = data.title;
      this.price = data.price;
      this.discount = data.discount;
    }
  
    static clone(data) {
      const cloneData = new MoneyPackageModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  