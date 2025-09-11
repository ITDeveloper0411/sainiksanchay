import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './BottomTabNavigator';
import ReferralListScreen from '../screens/ReferralListScreen';
import ReferralIncomeScreen from '../screens/ReferralIncomeScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ReferralList" component={ReferralListScreen} />
      <Stack.Screen name="ReferralIncome" component={ReferralIncomeScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
