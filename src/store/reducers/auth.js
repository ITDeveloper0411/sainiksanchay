import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AUTHENTICATE,
  GET_DISTRICTS,
  GET_REGISTER_AMOUNT,
  GET_STATES,
  LOGOUT,
  REGISTER,
} from '../actions/auth';
import { ToastAndroid } from 'react-native';
import { AUTH_TOKEN } from '../../config/Constant';

const initialState = {
  registered: false,
  token: null,
  stateList: [],
  districtList: [],
  registerAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: {
      return {
        ...state,
        token: action.token,
      };
    }

    case REGISTER: {
      return {
        ...state,
      };
    }

    case GET_STATES: {
      return {
        ...state,
        stateList: action.data,
      };
    }

    case GET_DISTRICTS: {
      return {
        ...state,
        districtList: action.data,
      };
    }

    case GET_REGISTER_AMOUNT: {
      return {
        ...state,
        registerAmount: action.data,
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
