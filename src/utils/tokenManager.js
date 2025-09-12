// utils/tokenManager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN = 'auth_token';

export const storeToken = async token => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN, token);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN);
  } catch (error) {
    throw new Error(error.message);
  }
};
