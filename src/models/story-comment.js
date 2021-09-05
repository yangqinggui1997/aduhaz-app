export default class StoryCommentModel {
    constructor() {
      this.id = 0;
      this.parentId = 0;
      this.content = '';
      this.date = '';
      this.numberOflikes = 0;
      this.numberOfReplies = 0;
      this.liked = false;
      this.user = null;
    }
  
    update(data) {
      this.id = data.id;
      this.parentId = data.id_parent;
      this.content = data.content;
      this.date = data.date_submitted;
      this.numberOflikes = data.amount_of_like;
      this.numberOfReplies = data.amount_of_reply;
      this.liked = data.like_status === 1;
      this.user = data.user;
    }
  
    static clone(data) {
      const cloneData = new StoryCommentModel();
      cloneData.update(data);
      return cloneData;
    }
  }
  