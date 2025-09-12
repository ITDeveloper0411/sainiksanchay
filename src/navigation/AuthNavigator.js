import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartedScreen from '../screens/StartedScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RegistrationSuccessMessage from '../screens/auth/RegistrationSuccessMessage';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={StartedScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="RegistrationSuccessMessage"
        component={RegistrationSuccessMessage}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
