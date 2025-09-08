// BottomNavigation.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';

const BottomNavigation = ({ navigation, state }) => {
  const insets = useSafeAreaInsets();
  const cartCount = useSelector(state => state.cart.cart);

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
              <View style={{ position: 'relative' }}>
                <Text style={[styles.navIcon, isFocused && styles.activeIcon]}>
                  {tab.icon}
                </Text>
                {tab.label === 'Cart' && cartCount.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount?.length}</Text>
                  </View>
                )}
              </View>
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
    borderTopColor: Colors.disabled,
    backgroundColor: Colors.white,
  },
  navItem: {
    alignItems: 'center',
    paddingBottom: 6,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryColor,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
    color: Colors.grey,
  },
  navLabel: {
    fontSize: 12,
    color: Colors.grey,
  },
  activeIcon: {
    color: Colors.primaryColor,
  },
  activeLabel: {
    color: Colors.primaryColor,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
