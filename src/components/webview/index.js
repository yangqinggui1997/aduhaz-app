import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../theme/colors';

const sizeObserverScript = `
        const loadedAt = Date.now()
        const sizeObserver = new ResizeObserver(entries=>{
            const entry = entries[0]
            try{
                window.ReactNativeWebView.postMessage(JSON.stringify({height:document.body.scrollHeight, onSizeChange:true, loadedAt, messageSendingAt: Date.now(), diff: (Date.now() - loadedAt)/1000}));
            }catch(e){}
        });
        sizeObserver.observe(document.body);
        true;
    `;
const baseUrl = Platform.OS === 'android' ? 'file:///android_asset' : '';

const getRelativeURI = uri => `${baseUrl}${uri}`;

const fileUri = Platform.select({
  ios: 'googleSans-Regular',
  android: 'file:///android_asset/font/GoogleSans/GoogleSans-Regular.ttf',
});

const createCSSInjectionScriptFromURI = uri => {
  const js = `(()=>{const styleSheet=document.createElement('link');styleSheet.setAttribute('rel', 'stylesheet');styleSheet.setAttribute('href','${getRelativeURI(
    uri,
  )}');
styleSheet.onload=()=>{window.ReactNativeWebView.postMessage('success')};
styleSheet.onerror=()=>{window.ReactNativeWebView.postMessage('fail')};
;document.head.append(styleSheet);
})();
true;`;
  return js;
};
const wrapHTMLInBody = (innerBody, textColor) => {
  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <style media="screen" type="text/css">@font-face {font-family: 'googleSans-Regular';src: local('googleSans-Regular'), url(${fileUri}) format("truetype");}</style>
    <style>body{margin:0;background: transparent; padding: 0;color: ${textColor}; line-height: 26px !important; font-family: 'googleSans-Regular' !important;}</style>
    <style> img { display: block; max-width: 100%; height: auto; } </style>
    <style>p,b {margin-bottom: 32px !important;}</style>
    <style></style>
</head><body>${innerBody}</body></html>`;
  return html;
};

const createCSSInjectionScriptFromString = content => {
  let js = [];
  js.push("const stylesheet = document.createElement('style');");
  js.push(
    `const content = decodeURIComponent("${encodeURIComponent(content)}")`,
  );
  js.push('stylesheet.innerHTML = content');
  js.push('document.head.append(stylesheet)');
  js.push('window.ReactNativeWebView.postMessage(document.head.innerHTML)');
  js.push('true');
  return `(()=>{${js.join(';')}})()`;
};

const WebViewWrapper = props => {
  const { resources, source, textColor, ...otherProps } = props;
  const innerBody = source.html;
  const isSourceHTML = !!innerBody;
  const html = useMemo(() => wrapHTMLInBody(innerBody, textColor), [
    innerBody,
    textColor,
  ]);
  const [editorHeight, setEditorHeight] = useState(1);
  const ref = useRef();
  const handleMessage = event => {
    try {
      const height = JSON.parse(event.nativeEvent.data).height;
      height && setEditorHeight(parseInt(height, 10));
    } catch (e) {}
  };
  const injectScript = code => {
    ref.current && ref.current.injectJavaScript(code);
  };
  useEffect(() => {
    if (resources) {
      if (Array.isArray(resources.css)) {
        resources.css.forEach(resource => {
          const { uri, content } = resource;
          if (uri) {
            const a = createCSSInjectionScriptFromURI(uri);
            injectScript(a);
          } else {
            injectScript(createCSSInjectionScriptFromString(content));
          }
        });
      }
    }
  });
  const webViewWrapperStyle = {
    flexGrow: 1,
    overflow: 'hidden',
    // height: editorHeight
  };
  const webViewStyle = {
    height: editorHeight,
    backgroundColor: Colors.transparent,
    opacity: 0.99,
  };
  return (
    <View style={[webViewWrapperStyle]}>
      <WebView
        {...otherProps}
        source={isSourceHTML ? { html } : source}
        onMessage={handleMessage}
        originWhitelist={['*']}
        allowFileAccess
        allowingReadAccessToURL={'file://'}
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        mixedContentMode={'always'}
        scalesPageToFit={true}
        injectedJavaScript={sizeObserverScript}
        style={webViewStyle}
        ref={ref}
        baseUrl={baseUrl}
        onHttpError={syntheticEvent => {
          // const { nativeEvent } = syntheticEvent;
        }}
      />
    </View>
  );
};

export default WebViewWrapper;
