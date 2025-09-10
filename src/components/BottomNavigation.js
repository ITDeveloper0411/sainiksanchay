// BottomNavigation.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';

const BottomNavigation = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', icon: '', screen: 'Home' },
    { label: 'Explore', icon: '', screen: 'Explore' },
    { label: 'Category', icon: '', screen: 'Category' },
    { label: 'Cart', icon: '', screen: 'Cart' },
    { label: 'Account', icon: '', screen: 'Account' },
  ];

  return (
    <View style={{ paddingBottom: insets.bottom }}>
      <View style={styles.bottomNav}>
        {tabs.map((tab, i) => {
          const isFocused = state.index === i;

          return (
            <TouchableOpacity
              key={i}
              style={[styles.navItem, isFocused && styles.activeNavItem]}
              onPress={() => navigation.navigate(tab.screen)}
            >
              <Text style={[styles.navIcon, isFocused && styles.activeIcon]}>
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  GlobalFonts.textMedium,
                  isFocused && styles.activeLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.textGray,
    backgroundColor: Colors.white,
  },
  navItem: {
    alignItems: 'center',
    paddingBottom: 6,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryDark,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
    color: Colors.lightBlue,
  },
  navLabel: {
    fontSize: 12,
    color: Colors.lightBlue,
  },
  activeIcon: {
    color: Colors.primaryDark,
  },
  activeLabel: {
    color: Colors.primaryDark,
  },
});

export default BottomNavigation;
