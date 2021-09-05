export default class Category {
  constructor() {
    this.id = '';
    this.parentId = '';
    this.name = '';
    this.seoName = '';
    this.icon = '';
  }

  update(data) {
    this.id = data.id_category;
    this.parentId = data.id_category_parent;
    this.name = data.category_name;
    this.seoName = data.seo_name;
    this.icon = data.icon;
  }

  static clone(data) {
    const cloneData = new Category();
    cloneData.update(data);
    return cloneData;
  }
}
