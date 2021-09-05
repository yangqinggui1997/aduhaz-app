export default class User {
  constructor() {
    this.id = '';
    this.tentruycap = '';
    this.hoten = '';
    this.email = '';
    this.diachi = '';
    this.sodienthoai = '';
    this.gioitinh = 0;
    this.ngaysinh = '';
    this.cmnd = '';
    this.active = null;
    this.phanquyen = 0;
    this.showhi = 0;
    this.id_facebook = null;
    this.id_google = null;
    this.id_twitter = null;
    this.id_zalo = null;
    this.google_icon = '';
    this.icon = null;
    this.token = '';
    this.refresh_token = '';
    this.keypass = '';
    this.amount_of_following = 0;
    this.amount_of_follower = 0;
    this.amount_of_evaluate = 0;
    this.point_of_evaluate = 0;
    this.friend_status = 0;
    this.money = '';
    this.cover_photo = null;
    this.lastOnline = null;
    this.verifications = [];
  }

  update(data) {
    this.id = data.id;
    this.verifications = data.verifications || this.verifications;
    this.tentruycap = data.tentruycap;
    this.keypass = data.keypass;
    this.hoten = data.hoten || data.full_name || data.name;
    this.email = data.email;
    this.diachi = data.diachi || data.address;
    this.sodienthoai = data.sodienthoai || data.phone_number;
    this.gioitinh = data.gioitinh || data.sex;
    this.ngaysinh = data.ngaysinh || data.date_of_birth;
    this.cmnd = data.cmnd || data.identity_card;
    this.active = data.active;
    this.phanquyen = data.phanquyen;
    this.showhi = data.showhi;
    this.id_facebook = data.id_facebook;
    this.id_google = data.id_google;
    this.id_twitter = data.id_twitter;
    this.id_zalo = data.id_zalo;
    this.google_icon = data.google_icon;
    this.icon = data.icon;
    this.token = data.token;
    this.refresh_token = data.refresh_token;
    this.amount_of_following = data.amount_of_following;
    this.amount_of_follower = data.amount_of_follower;
    this.amount_of_evaluate = data.amount_of_evaluate;
    this.point_of_evaluate = data.point_of_evaluate;
    this.friend_status = data.friend_status;
    this.money = data.money;
    this.cover_photo = data.cover_photo;
    this.lastOnline = data.lastOnline;
  }

  static clone(data) {
    const cloneData = new User();
    cloneData.update(data);
    return cloneData;
  }
}
