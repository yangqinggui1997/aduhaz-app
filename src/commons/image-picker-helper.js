import ImageResizer from 'react-native-image-resizer';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import Utils from './utils';

const MAX_SIZE_IMAGE_UPLOAD = 4048000;

export function checkAndResizeImage(image) {
  let divider = 1;
  if (image.size > MAX_SIZE_IMAGE_UPLOAD) {
    divider = image.size / MAX_SIZE_IMAGE_UPLOAD;
  }
  return new Promise((resolve, reject) => {
    ImageResizer.createResizedImage(
      image.path,
      image.width / divider,
      image.height / divider,
      'JPEG',
      100,
      0,
      null,
    )
      .then(resp => {
        resolve(resp);
      })
      .catch(err => {
        console.log(`createResizedImage: ${err}`);
        reject(err);
      });
  });
}

export function openPicker() {
  return new Promise((resolve, reject) => {
    MultipleImagePicker.openPicker({
      mediaType: 'image',
      isPreview: false,
      selectedAssets: [],
      singleSelectedMode: true,
    })
      .then(async response => {
        if (response && response.length > 0) {
          const asset = response[0];
          if (Utils.isAndroid()) {
            asset.path = asset.realPath;
            asset.filename = asset.fileName;
          }
          resolve(asset);
        }
      })
      .catch(error => {
        console.log(`###openPicker - error: ${error}`);
        reject(error);
      });
  });
}
