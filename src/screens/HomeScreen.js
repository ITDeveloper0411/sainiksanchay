import { Text } from 'react-native';
import { useTabBarVisibility } from '../navigation/BottomTabNavigator';
import { useEffect } from 'react';

const HomeScreen = () => {
  const { showTabBar } = useTabBarVisibility();

  useEffect(() => {
    showTabBar();
  }, [showTabBar]);
  return <Text>Home</Text>;
};

export default HomeScreen;
