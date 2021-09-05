import i18n from 'i18next';
import images from '../assets/images';
import { POST_MENU_TYPE, SORT_BY, ORDER } from '../commons/constants';

export const MENU = {
  postDetail: [
    {
      label: 'post_menu_save_title',
      desc: 'post_menu_save_desc',
      icon: images.icon_heart_outline,
      type: POST_MENU_TYPE.SAVE,
    },
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_report_title',
      desc: 'post_menu_report_desc',
      icon: images.icon_report_outline,
      type: POST_MENU_TYPE.REPORT,
    },
  ],
  myPostDetail: [
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
  ],
  grids: [
    {
      label: 'post_menu_save_title',
      desc: 'post_menu_save_desc',
      icon: images.icon_heart_outline,
      type: POST_MENU_TYPE.SAVE,
    },
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_report_title',
      desc: 'post_menu_report_desc',
      icon: images.icon_report_outline,
      type: POST_MENU_TYPE.REPORT,
    },
  ],
  unSaveGrids: [
    {
      label: 'post_menu_unsave_post_title',
      desc: 'post_menu_unsave_desc',
      icon: images.icon_heart_outline,
      type: POST_MENU_TYPE.UNSAVE,
    },
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_report_title',
      desc: 'post_menu_report_desc',
      icon: images.icon_report_outline,
      type: POST_MENU_TYPE.REPORT,
    },
  ],
  itemSalingMenu: [
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_edit',
      desc: 'post_menu_edit_desc',
      icon: images.icon_edit,
      type: POST_MENU_TYPE.EDIT,
    },
    {
      label: 'post_menu_hide_or_sold',
      desc: 'post_menu_hide_or_sold_des',
      icon: images.icon_hide,
      type: POST_MENU_TYPE.HIDE,
    },
    {
      label: 'post_menu_delete',
      desc: 'post_menu_delete_desc',
      icon: images.icon_delete_post,
      type: POST_MENU_TYPE.DELETE,
    },
  ],
  itemHiddenMenu: [
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_edit',
      desc: 'post_menu_edit_desc',
      icon: images.icon_edit,
      type: POST_MENU_TYPE.EDIT,
    },
    {
      label: 'post_menu_show_post',
      desc: 'post_menu_show_post_des',
      icon: images.icon_hide,
      type: POST_MENU_TYPE.SHOW,
    },
    {
      label: 'post_menu_delete',
      desc: 'post_menu_delete_desc',
      icon: images.icon_delete_post,
      type: POST_MENU_TYPE.DELETE,
    },
  ],
  itemVideoMenu: [
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_edit',
      desc: 'post_menu_edit_desc',
      icon: images.icon_edit,
      type: POST_MENU_TYPE.EDIT,
    },
    {
      label: 'post_menu_delete',
      desc: 'post_menu_delete_desc',
      icon: images.icon_trash,
      type: POST_MENU_TYPE.DELETE,
    },
  ],
  itemSavedMenu: [
    {
      label: 'post_menu_share',
      desc: 'post_menu_share_desc',
      icon: images.icon_share,
      type: POST_MENU_TYPE.SHARE,
    },
    {
      label: 'post_menu_unsave',
      desc: 'post_menu_unsave_desc',
      icon: images.icon_trash,
      type: POST_MENU_TYPE.UNSAVE,
    },
  ],
  savedListSort: [
    {
      label: 'sort_by_newest',
      desc: 'sort_by_newest_desc',
      icon: images.icon_sort_by_newest,
      sortBy: SORT_BY.DATE_OF_POST,
      order: ORDER.ASCENDING,
      id: 1,
    },
    {
      label: 'sort_by_oldest',
      desc: 'sort_by_oldest_desc',
      icon: images.icon_sort_by_oldest,
      sortBy: SORT_BY.DATE_OF_POST,
      order: ORDER.ASCENDING,
      id: 2,
    },
    {
      label: 'sort_by_most_popular',
      desc: 'sort_by_most_popular_desc',
      icon: images.icon_sort_by_most_popular,
      sortBy: SORT_BY.VIEW,
      order: ORDER.DESCENDING,
      id: 3,
    },
  ],
};
