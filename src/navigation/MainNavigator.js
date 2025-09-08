import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../store/actions/auth';
import Loader from '../components/Loader';
import { AUTH_TOKEN } from '../config/Constant';

const MainNavigator = () => {
  const isMountedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      const accessToken = await AsyncStorage.getItem(AUTH_TOKEN);

      if (accessToken) {
        dispatch(authActions.setToken(accessToken));
        // dispatch(profileActions.getProfile());
      }
      if (isMountedRef.current) {
        setLoading(false);
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [dispatch]);

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
