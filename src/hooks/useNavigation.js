import { Keyboard } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Screens from '../screens/screens';

const PUSH_SCREEN_DELAY_TIME = 1000;

const useNavigation = componentId => {
  let pressed = true;

  const push = (name, passProps = {}, options = {}) => {
    if (pressed) {
      Keyboard.dismiss();
      pressed = false;
      setTimeout(() => (pressed = true), PUSH_SCREEN_DELAY_TIME);

      Navigation.push(componentId, {
        component: {
          name,
          passProps,
          options: {
            bottomTabs: {
              visible: false,
              drawBehind: true,
            },
            ...options,
          },
        },
      });
    }
  };

  const pop = () => {
    Keyboard.dismiss();
    Navigation.pop(componentId);
  };

  const popToRoot = () => {
    Navigation.popToRoot(componentId);
  };

  const setRoot = layout => {
    Navigation.setRoot(layout);
  };

  const showModal = (screen, passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: screen,
              passProps,
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
          },
        },
      },
    });
  };

  return { push, pop, setRoot, popToRoot, showModal };
};

export default useNavigation;
