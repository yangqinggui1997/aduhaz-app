import {
  Navigation,
  OptionsModalPresentationStyle,
} from 'react-native-navigation';
import { Dimensions } from 'react-native';

import Colors from '../theme/colors';
import Fonts from '../theme/fonts';

const flags = {
  showTextInputToTestKeyboardInteraction: false,
  useCustomAnimations: false,
  useSlowOpenScreenAnimations: false,
  useSlideAnimation: true,
};

export let NAVIGATION_CONSTANT;

export const loadNavigationConstant = async () => {
  NAVIGATION_CONSTANT = await Navigation.constants();
};

const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

const DEFAULT_DURATION = 300;
const SHOW_DURATION =
  DEFAULT_DURATION * (flags.useSlowOpenScreenAnimations ? 2 : 1);

const setDefaultOptions = () =>
  Navigation.setDefaultOptions({
    layout: {
      componentBackgroundColor: Colors.white,
      orientation: ['portrait'],
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysHide',
    },
    bottomTab: {
      selectedIconColor: Colors.flatBlack02,
      textColor: Colors.flatGrey13,
      selectedTextColor: Colors.flatBlack02,
      fontFamily: Fonts.SemiBold,
      fontSize: 10,
      selectedFontSize: 10,
    },
    animations: {
      ...(flags.useSlideAnimation
        ? slideAnimations
        : flags.useCustomAnimations
        ? customAnimations
        : {}),
    },
    modalPresentationStyle: OptionsModalPresentationStyle.fullScreen,
    statusBar: {
      backgroundColor: Colors.white,
      style: 'dark',
    },
    sideMenu: {
      right: {
        width: width * 0.7,
      },
    },
  });

const slideAnimations = {
  push: {
    // waitForRender: true,
    content: {
      translationX: {
        from: width,
        to: 0,
        duration: SHOW_DURATION,
      },
      alpha: {
        from: 0.7,
        to: 1,
        duration: SHOW_DURATION,
      },
    },
  },
  pop: {
    content: {
      translationX: {
        from: 0,
        to: width,
        duration: SHOW_DURATION,
      },
      alpha: {
        from: 1,
        to: 0.3,
        duration: SHOW_DURATION,
      },
    },
  },
  showOverlay: {
    // waitForRender: true,
    content: {
      alpha: {
        from: 0.7,
        to: 1,
        duration: SHOW_DURATION,
      },
    },
  },
  dismissOverlay: {
    content: {
      alpha: {
        from: 1,
        to: 0,
        duration: SHOW_DURATION,
      },
    },
  },
  showModal: {
    // waitForRender: true,
    alpha: {
      from: 0.75,
      to: 1,
      duration: 100,
    },
  },
  dismissModal: {
    alpha: {
      from: 1,
      to: 0,
      duration: 100,
    },
  },
  // showModal: {
  //   waitForRender: true,
  //   translationY: {
  //     from: height,
  //     to: 0,
  //     duration: SHOW_DURATION,
  //   },
  //   alpha: {
  //     from: 0.7,
  //     to: 1,
  //     duration: SHOW_DURATION,
  //   },
  // },
  // dismissModal: {
  //   translationY: {
  //     from: 0,
  //     to: height,
  //     duration: SHOW_DURATION,
  //   },
  //   alpha: {
  //     from: 1,
  //     to: 0.3,
  //     duration: SHOW_DURATION,
  //   },
  // },
};

const customAnimations = {
  showModal: {
    waitForRender: true,
    translationY: {
      from: height,
      to: 0,
      duration: SHOW_DURATION,
      interpolation: 'decelerate',
    },
    alpha: {
      from: 0.65,
      to: 1,
      duration: SHOW_DURATION * 0.7,
      interpolation: 'accelerate',
    },
  },
  dismissModal: {
    translationY: {
      from: 0,
      to: height,
      duration: SHOW_DURATION * 0.9,
    },
  },
  push: {
    waitForRender: true,
    content: {
      alpha: {
        from: 0.65,
        to: 1,
        duration: SHOW_DURATION * 0.7,
        interpolation: 'accelerate',
      },
      translationY: {
        from: height * 0.3,
        to: 0,
        duration: SHOW_DURATION,
        interpolation: 'decelerate',
      },
    },
  },
  pop: {
    content: {
      alpha: {
        from: 1,
        to: 0,
        duration: SHOW_DURATION,
      },
      translationY: {
        from: 0,
        to: height * 0.7,
        duration: SHOW_DURATION * 0.9,
      },
    },
  },
};

const fullScreenOptions = {
  bottomTabs: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export { setDefaultOptions, fullScreenOptions };
