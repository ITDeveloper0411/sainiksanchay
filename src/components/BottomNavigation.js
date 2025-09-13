import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Colors } from '../config/Colors';
import { GlobalFonts } from '../config/GlobalFonts';

const BottomNavigation = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  const tabs = [
    {
      label: 'Home',
      emoji: '🏠',
      screen: 'Home',
    },
    {
      label: 'Account',
      emoji: '👤',
      screen: 'Account',
    },
  ];

  // Calculate responsive bottom padding based on screen height
  const getBottomPadding = () => {
    if (Platform.OS === 'ios') {
      return Math.max(insets.bottom, 16);
    } else {
      // For Android, use a percentage of screen height
      return screenHeight < 700 ? 8 : 16;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View
        style={[
          styles.container,
          {
            paddingBottom: getBottomPadding(),
          },
        ]}
      >
        <View style={styles.navBar}>
          {tabs.map((tab, i) => {
            const isFocused = state.index === i;

            return (
              <TouchableOpacity
                key={i}
                style={styles.navItem}
                onPress={() => navigation.navigate(tab.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.iconLabelContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      isFocused && styles.activeIconContainer,
                    ]}
                  >
                    <Text style={styles.emojiIcon}>{tab.emoji}</Text>
                  </View>
                  <Text
                    style={[
                      styles.label,
                      isFocused ? styles.activeLabel : styles.inactiveLabel,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
                {isFocused && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  container: {
    paddingHorizontal: 0,
  },
  navBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 60 : 56, // Slightly smaller on Android
    backgroundColor: Colors.white,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    // Add any active icon styling if needed
  },
  emojiIcon: {
    fontSize: 18,
  },
  label: {
    fontSize: 11,
    fontFamily: GlobalFonts.textMedium,
  },
  activeLabel: {
    color: Colors.primaryBlue,
    fontFamily: GlobalFonts.textSemiBold,
  },
  inactiveLabel: {
    color: Colors.textGray,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryBlue,
  },
});

export default BottomNavigation;
