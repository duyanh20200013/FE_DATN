import { Dimensions } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { StatusBar } from 'react-native';

export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
// export const STATUSBAR_HEIGHT = StatusBar.currentHeight !== undefined ? StatusBar.currentHeight : 100;
// export const STATUSBAR_HEIGHT = StatusBar.currentHeight;
export const STATUSBAR_HEIGHT = getStatusBarHeight()

export const FIXED_STATUSBAR_HEIGHT = 44