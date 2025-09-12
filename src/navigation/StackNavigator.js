import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import ReferralListScreen from '../screens/Referral/ReferralListScreen';
import ReferralIncomeScreen from '../screens/Referral/ReferralIncomeScreen';
import NomineeScreen from '../screens/Profile/NomineeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import * as profileActions from '../store/actions/profile';
import { useDispatch } from 'react-redux';
import KYCScreen from '../screens/Profile/KYCScreen';
import ChangePasswordScreen from '../screens/Profile/ChangePasswordScreen';
import ContactScreen from '../screens/ContactScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profileActions.getProfile());
  }, [dispatch]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ReferralList" component={ReferralListScreen} />
      <Stack.Screen name="ReferralIncome" component={ReferralIncomeScreen} />
      <Stack.Screen name="Nominee" component={NomineeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="KYC" component={KYCScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
