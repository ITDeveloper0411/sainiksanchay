import { ToastAndroid } from 'react-native';

export const ShowToast = message => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};
