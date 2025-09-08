import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartedScreen from '../screens/StartedScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={StartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
