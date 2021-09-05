import { useEffect } from 'react';
import { Navigation } from 'react-native-navigation';

export default function useComponentDidDisappearListener(handler, componentId) {
  useEffect(() => {
    const sub = Navigation.events().registerComponentDidDisappearListener(
      event => {
        if (event.componentId === componentId) {
          handler(event);
        }
      },
    );
    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
