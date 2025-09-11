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

  // Get appropriate colors for disabled state
  const getDisabledColors = () => {
    if (isPrimary) {
      return {
        backgroundColor: Colors.disabledPrimary,
        borderColor: Colors.disabledPrimary,
        textColor: Colors.white,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        loaderColor: Colors.white,
        opacity: 1, // Primary buttons keep full opacity
      };
    } else {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white
        borderColor: 'rgba(13, 43, 75, 0.4)', // Semi-transparent primary blue
        textColor: 'rgba(13, 43, 75, 0.6)', // Semi-transparent primary blue text
        shadowColor: 'rgba(0, 0, 0, 0.05)', // Very light shadow
        loaderColor: 'rgba(13, 43, 75, 0.6)', // Semi-transparent primary blue loader
        opacity: 1, // We'll handle opacity through colors instead
      };
    }
  };

  const disabledColors = isDisabled ? getDisabledColors() : null;

  return (
    <View style={[styles.buttonContainer, { height: getButtonHeight() + 4 }]}>
      {/* Main button content */}
      <TouchableOpacity
        style={[
          styles.buttonContent,
          isPrimary && !isDisabled && styles.primaryButton,
          !isPrimary && !isDisabled && styles.secondaryButton,
          isDisabled && {
            backgroundColor: disabledColors.backgroundColor,
            borderColor: disabledColors.borderColor,
          },
          { height: getButtonHeight() },
        ]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={
                isDisabled
                  ? disabledColors.loaderColor
                  : isPrimary
                  ? Colors.white
                  : Colors.primaryBlue
              }
            />
            <Text
              style={[
                styles.buttonText,
                isPrimary && !isDisabled && styles.primaryButtonText,
                !isPrimary && !isDisabled && styles.secondaryButtonText,
                isDisabled && {
                  color: disabledColors.textColor,
                  // Add opacity only for secondary disabled buttons
                  opacity: !isPrimary ? 0.7 : 1,
                },
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
              isPrimary && !isDisabled && styles.primaryButtonText,
              !isPrimary && !isDisabled && styles.secondaryButtonText,
              isDisabled && {
                color: disabledColors.textColor,
                // Add opacity only for secondary disabled buttons
                opacity: !isPrimary ? 0.7 : 1,
              },
              { fontSize: getFontSize() },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>

      {/* Shadow element - positioned to right and bottom only */}
      <View
        style={[
          styles.buttonShadow,
          isPrimary && !isDisabled && styles.primaryShadow,
          !isPrimary && !isDisabled && styles.secondaryShadow,
          isDisabled && {
            backgroundColor: disabledColors.shadowColor,
            // Reduce shadow opacity for disabled secondary buttons
            opacity: !isPrimary ? 0.5 : 1,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    position: 'relative',
    minWidth: 100,
  },
  buttonContent: {
    borderRadius: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 4,
    bottom: 4,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primaryBlue,
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
  buttonShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    zIndex: 1,
  },
  primaryShadow: {
    backgroundColor: 'rgba(13, 43, 75, 0.4)',
  },
  secondaryShadow: {
    backgroundColor: 'rgba(13, 43, 75, 0.2)',
  },
});

export default CustomButton;
