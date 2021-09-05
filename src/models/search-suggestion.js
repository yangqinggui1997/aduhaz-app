export default class SearchSuggestionModel {
    constructor() {
      this.id = 0;
      this.parrentId = 0;
      this.searchText = '';
    }
  
    update(data) {
      this.id = data.id_category;
      this.parrentId = data.id_category_parent;
      this.searchText = data.key_search;
    }
  
    static clone(data) {
      const cloneData = new SearchSuggestionModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  