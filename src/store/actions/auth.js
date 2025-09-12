import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN, BASE_URL } from '../../config/Constant';

export const AUTHENTICATE = 'AUTHENTICATE';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';
export const GET_STATES = 'GET_STATES';
export const GET_DISTRICTS = 'GET_DISTRICTS';
export const GET_REGISTER_AMOUNT = 'GET_REGISTER_AMOUNT';

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
    const response = await fetch(`${BASE_URL}login-submit`, {
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
        throw new Error('Invalid credentials');
      } else {
        const resData = await response.json();
        throw new Error(resData.msg);
      }
    }

    const resData = await response.json();

    if (resData.status) {
      dispatch({
        type: AUTHENTICATE,
        token: resData.token,
      });

      await _storeToken(resData.token);
      return {
        success: true,
        message: resData.msg || 'Login successful',
      };
    } else {
      throw new Error(resData.msg);
    }
  };
};

export const register = formData => {
  return async dispatch => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append('guide_id', formData.samNo || '');
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('mobile', formData.mobileNumber);
      formDataToSend.append('emailid', formData.email);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('amount', formData.amountPaid);

      if (formData.paymentSlip && formData.paymentSlip.uri) {
        formDataToSend.append('payment_slip', {
          uri: formData.paymentSlip.uri,
          type: formData.paymentSlip.mime || 'image/jpeg',
          name: formData.paymentSlip.fileName || 'payment_slip.jpg',
        });
      }

      const response = await fetch(`${BASE_URL}registration-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Registration failed');
      }

      if (result.msg === 'Unauthenticated') {
        dispatch(logout());
        throw new Error('Session expired. Please login again.');
      }

      if (result.status) {
        dispatch({
          type: REGISTER,
        });
        return {
          success: true,
          message: result.msg || 'Registration successful',
        };
      } else {
        throw new Error(result.msg || 'Registration failed');
      }
    } catch (error) {
      throw new Error(
        error.message || 'Registration failed. Please try again.',
      );
    }
  };
};

export const getStates = () => {
  return async dispatch => {
    const response = await fetch(`${BASE_URL}state`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      dispatch({
        type: GET_STATES,
        data: result.states,
      });
      return Promise.resolve(result.states);
    } else {
      throw new Error(result.msg);
    }
  };
};

export const getDistrict = districtId => {
  return async dispatch => {
    const response = await fetch(`${BASE_URL}district/${districtId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      dispatch({
        type: GET_DISTRICTS,
        data: result.districts,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

export const getRegisterAmount = () => {
  return async dispatch => {
    const response = await fetch(`${BASE_URL}registration-amount`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      dispatch({
        type: GET_REGISTER_AMOUNT,
        data: result.amount,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};
