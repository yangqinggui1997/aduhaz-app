import { useEffect } from 'react';
import { Navigation } from 'react-native-navigation';

export default function useComponentDidAppearListener(handler, componentId) {
  useEffect(() => {
    const sub = Navigation.events().registerComponentDidAppearListener(
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
