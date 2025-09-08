import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.loginButton} onPress={onPress}>
      <View style={styles.buttonContent}>
        <Text style={styles.loginButtonText}>{title}</Text>
      </View>
      <View style={styles.buttonShadow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 12,
    height: 55,
    marginBottom: 20,
    position: 'relative',
  },
  buttonContent: {
    backgroundColor: '#0d2b4b',
    borderRadius: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(13, 43, 75, 0.4)',
    borderRadius: 12,
    zIndex: 1,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 17,
    letterSpacing: 0.5,
    fontFamily: GlobalFonts.textBold,
  },
});

export default CustomButton;
