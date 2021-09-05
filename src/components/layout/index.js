/**
 * Use SafeAreaView of react-native-safe-area-context
 * because SafeAreaView of react-native is currently only
 * applicable to iOS devices with iOS version 11 or later
 */
import React from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import style from './style';

const Layout = ({ level = 1, ...props }) => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={[style.container, props.style]} {...props}>
        {props.children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Layout;
