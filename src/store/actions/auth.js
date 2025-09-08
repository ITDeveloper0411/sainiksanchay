import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN, BASE_URL } from '../../config/Constant';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

const _storeToken = async token => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN, token);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = () => {
  return async dispatch => {
    dispatch({
      type: LOGOUT,
    });
  };
};

export const setToken = token => {
  return async dispatch => {
    dispatch({ type: AUTHENTICATE, token });
  };
};

export const login = (username, password) => {
  return async dispatch => {
    const response = await fetch(`${BASE_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('You have entered an incorrect password.');
      } else {
        const resData = await response.json();
        throw new Error(resData.msg);
      }
    }

    const resData = await response.json();

    if (resData.status) {
      dispatch({
        type: AUTHENTICATE,
        token: resData.data,
      });
      await _storeToken(resData.data);
    } else {
      throw new Error(resData.msg);
    }
  };
};
