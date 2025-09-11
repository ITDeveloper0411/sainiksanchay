import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import { AUTH_TOKEN } from '../config/Constant';
import * as authActions from '../store/actions/auth';
import * as profileActions from '../store/actions/profile';

const MainNavigator = () => {
  const { token } = useSelector(state => state.auth);
  const isMountedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    isMountedRef.current = true;

    const bootstrapAsync = async () => {
      try {
        const accessToken = await AsyncStorage.getItem(AUTH_TOKEN);

        if (accessToken) {
          // First set the token in Redux store
          await dispatch(authActions.setToken(accessToken));

          // Then get the profile (only if we have a token)
          dispatch(profileActions.getProfile());
        }

        if (isMountedRef.current) {
          setIsTokenChecked(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading token:', error);
        if (isMountedRef.current) {
          setIsTokenChecked(true);
          setLoading(false);
        }
      }
    };

    bootstrapAsync();

    return () => {
      isMountedRef.current = false;
    };
  }, [dispatch]);

  useEffect(() => {
    // Get states only after token check is complete
    if (isTokenChecked) {
      dispatch(authActions.getStates());
    }
  }, [dispatch, isTokenChecked]);

  // Additional effect to handle token changes
  useEffect(() => {
    if (token && isTokenChecked) {
      // If we have a token and token check is complete, get profile
      dispatch(profileActions.getProfile());
    }
  }, [token, isTokenChecked, dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {token ? <StackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
