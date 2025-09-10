// components/CustomButton.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'default', // 'default', 'small', 'large'
}) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  // Size calculations
  const getButtonHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 60;
      default:
        return 55;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 17;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.loginButton, { height: getButtonHeight() }]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      <View
        style={[
          styles.buttonContent,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
          isDisabled && styles.disabledButton,
          { height: getButtonHeight() },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={isPrimary ? Colors.white : Colors.primaryBlue}
            />
            <Text
              style={[
                styles.buttonText,
                isPrimary
                  ? styles.primaryButtonText
                  : styles.secondaryButtonText,
                isDisabled && styles.disabledText,
                { fontSize: getFontSize(), marginLeft: 8 },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {title}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.buttonText,
              isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
              isDisabled && styles.disabledText,
              { fontSize: getFontSize() },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.buttonShadow,
          isPrimary ? styles.primaryShadow : styles.secondaryShadow,
          isDisabled && styles.disabledShadow,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 12,
    position: 'relative',
    minWidth: 100, // Ensure minimum width for buttons
  },
  buttonContent: {
    borderRadius: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
    borderWidth: 1,
    paddingHorizontal: 16, // Add horizontal padding
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primaryBlue,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primaryBlue,
  },
  disabledButton: {
    backgroundColor: Colors.textGray,
    borderColor: Colors.borderLight,
  },
  buttonText: {
    letterSpacing: 0.5,
    fontFamily: GlobalFonts.textBoldItalic,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.primaryBlue,
  },
  disabledText: {
    color: Colors.textMediumGray,
  },
  buttonShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    borderRadius: 12,
    zIndex: 1,
  },
  primaryShadow: {
    backgroundColor: 'rgba(13, 43, 75, 0.4)',
  },
  secondaryShadow: {
    backgroundColor: 'rgba(13, 43, 75, 0.2)',
  },
  disabledShadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default CustomButton;
