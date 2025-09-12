import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import * as authActions from '../store/actions/auth';
import { getToken } from '../utils/tokenManager';

const MainNavigator = () => {
  const { token } = useSelector(state => state.auth);
  const isMountedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      try {
        const accessToken = await getToken();

        if (accessToken) {
          // First set the token in Redux store
          dispatch(authActions.setToken(accessToken));
        }

        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setLoading(false);
        }
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
