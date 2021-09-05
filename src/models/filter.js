export default class FilterGroupModel {
  constructor() {
    this.id = '';
    this.name = '';
    this.slug = '';
    this.controlType = '';
    this.icon = '';
    (this.min = 0), (this.max = 0);
    this.childs = [];
  }

  update(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.controlType = data.input_control;
    this.icon = data.icon;
    this.min = data.min;
    this.max = data.max;
    this.childs = data.childs
      ? data.childs.map(c => FilterOptionModel.clone(c))
      : [];
  }

  static clone(data) {
    const cloneData = new FilterGroupModel();
    cloneData.update(data);
    return cloneData;
  }
}

class FilterOptionModel {
  constructor() {
    this.id = 0;
    this.name = '';
    this.parentId = 0;
    this.icon = '';
  }

  update(data) {
    this.id = data.id;
    this.parentId = data.id_parent;
    this.name = data.title;
    this.icon = data.icon;
  }

  static clone(data) {
    const cloneData = new FilterOptionModel();
    cloneData.update(data);
    return cloneData;
  }
}
