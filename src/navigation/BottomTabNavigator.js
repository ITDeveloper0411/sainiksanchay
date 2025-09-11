import React, { useState, createContext, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNavigation from '../components/BottomNavigation';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

// Create context for tab bar visibility
const TabBarVisibilityContext = createContext({
  showTabBar: () => {},
  hideTabBar: () => {},
});

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

const renderBottomNavigation = props => <BottomNavigation {...props} />;

const BottomTabNavigator = () => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(false);

  const showTabBar = () => setIsTabBarVisible(true);
  const hideTabBar = () => setIsTabBarVisible(false);

  return (
    <TabBarVisibilityContext.Provider value={{ showTabBar, hideTabBar }}>
      <Tab.Navigator
        tabBar={isTabBarVisible ? renderBottomNavigation : () => null}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </TabBarVisibilityContext.Provider>
  );
};

export default BottomTabNavigator;
