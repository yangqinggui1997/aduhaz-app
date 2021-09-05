export default class FriendModel {
  constructor() {
    this.id = 0;
    this.userName = '';
    this.avatar = '';
    this.friendStatus = 0;
  }

  update(data) {
    this.id = data.id;
    this.userName = data.user_name;
    this.avatar = data.avatar;
    this.friendStatus = data.friend_status;
  }

  static clone(data) {
    const cloneData = new FriendModel();
    cloneData.update(data);
    return cloneData;
  }
}
