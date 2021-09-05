import { Navigation } from 'react-native-navigation';
import Screens from '../screens/screens';
import i18n from '../../i18n';
import images from '../assets/images';
import Colors from '../theme/colors';
import { Platform } from 'react-native';
import colors from '../theme/colors';

export const setSplashScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: Screens.Splash,
              options: {
                statusBar: {
                  visible: true,
                  style: 'dark',
                },
                topBar: {
                  visible: false,
                },
              },
            },
          },
        ],
      },
    },
  });
  return Screens.Splash;
};

export const setMainScreen = () => {
  // load icon
  const tabIcons = [
    images.tab_home,
    images.tab_video_post,
    images.post_button,
    images.tab_image_stories,
    images.tab_video_stories,
  ];
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    name: Screens.Home,
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: '',
                  icon: tabIcons[0],
                  iconColor: Colors.flatGrey13,
                },
                topBar: {
                  visible: false,
                  drawBehind: true,
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: Screens.HomeVideos,
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: '',
                  icon: tabIcons[1],
                  iconColor: Colors.flatGrey13,
                },
                topBar: {
                  visible: false,
                  drawBehind: true,
                },
              },
            },
          },
          {
            stack: {
              children: [],
              options: {
                bottomTab: {
                  icon: tabIcons[2],
                  selectTabOnPress: false,
                  iconWidth: Platform.select({ ios: 150, android: 70 }),
                  iconHeight: Platform.select({ ios: 150, android: 70 }),
                  iconInsets: {
                    top: -16,
                  },
                  // iconColor: 'transparent'
                },
                topBar: {
                  visible: false,
                  drawBehind: true,
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: Screens.HomeStoryPictures,
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: '',
                  icon: tabIcons[3],
                  iconColor: Colors.flatGrey13,
                },
                topBar: {
                  visible: false,
                  drawBehind: true,
                },
              },
            },
          },
          {
            stack: {
              children: [
                {
                  component: {
                    name: Screens.HomeStoryVideos,
                  },
                },
              ],
              options: {
                bottomTab: {
                  text: '',
                  icon: tabIcons[4],
                  iconColor: Colors.flatGrey13,
                },
                topBar: {
                  visible: false,
                  drawBehind: true,
                },
              },
            },
          },
        ],
        options: {
          bottomTabs: {
            // tabsAttachMode: 'onSwitchToTab',
          },
        },
      },
    },
  });

  return Screens.Home;
};
