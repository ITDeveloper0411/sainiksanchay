import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTHENTICATE, LOGOUT } from '../actions/auth';
import { ToastAndroid } from 'react-native';
import { AUTH_TOKEN } from '../../config/Constant';

const initialState = {
  registered: false,
  token: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      return {
        ...state,
        token: action.token,
      };
    }
    case LOGOUT:
      AsyncStorage.removeItem(AUTH_TOKEN);
      ToastAndroid.show('Logout Successfully !', ToastAndroid.SHORT);
      return { ...initialState };
    default:
      return state;
  }
};
