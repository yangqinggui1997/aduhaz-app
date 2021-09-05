import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Progress from 'react-native-progress';
import colors from '../../theme/colors';
import style from './style';

const UploadProgressView = ({ progress, ...props }) => {
  const [uploadProgress, setUploadProgress] = useState(progress);

  useEffect(() => {
    setUploadProgress(progress);
  }, [progress]);

  return (
    <View style={style.container}>
      <Progress.Pie
        size={40}
        progress={uploadProgress}
        color={colors.appYellow}
        borderWidth={2}
      />
      <Text style={style.textProgress}>{`${Math.round(
        uploadProgress * 100,
      )}%`}</Text>
    </View>
  );
};

UploadProgressView.propTypes = {};

export default UploadProgressView;
