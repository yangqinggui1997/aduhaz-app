import User from './user';

export default class VideoPostModel {
  constructor() {
    this.id = 0;
    this.userId = 0;
    this.parentId = 0;
    this.postTitle = '';
    this.content = '';
    this.postDate = 0;
    this.views = 0;
    this.displays = 0;
    this.city = 0;
    this.district = 0;
    this.ward = 0;
    this.shareLink = '';
    this.saved = 0;
    this.icon = '';
    this.videoUrl = '';
    this.comments = 0;
    this.likes = 0;
    this.liked = false;
    this.videoWidth = 0;
    this.videoHeight = 0;
    this.user = new User();
    this.type = '';
  }

  update(data) {
    this.id = data.id;
    this.userId = data.id_user;
    this.parentId = data.id_parent;
    this.postTitle = data.tenbaiviet;
    this.content = data.noidung;
    this.postDate = data.ngaydang;
    this.views = data.soluotxem;
    this.displays = data.soluothienthi;
    this.city = data.tinh_thanh;
    this.district = data.quan_huyen;
    this.ward = data.phuong_xa;
    this.shareLink = data.share_link;
    this.saved = data.save_status;
    this.icon = data.icon || data.poster;
    this.videoUrl = data.dowload;
    this.videoWidth = data.video_width || 0;
    this.videoHeight = data.video_height || 0;
    this.comments = data.comments;
    this.likes = data.likes;
    this.liked = data.like_status === 1;
    this.user = User.clone(data.user);
    this.type = data.type_post;
  }

  static clone(data) {
    const cloneData = new VideoPostModel();
    cloneData.update(data);
    return cloneData;
  }
}
