// components/CustomTextInput.js
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '../config/Colors';
import { GlobalFonts } from '../config/GlobalFonts';

const CustomTextInput = ({
  label,
  iconName,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  isPassword = false,
  showPassword = false,
  togglePasswordVisibility = () => {},
  error = null,
  keyboardType = 'default',
  maxLength,
  editable = true,
  ...props
}) => {
  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? Colors.error : Colors.primaryBlue}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, !editable && styles.disabledInput]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMediumGray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword ? !showPassword : false}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
          editable={editable}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={error ? Colors.error : Colors.primaryBlue}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textMedium,
  },
  disabledInput: {
    backgroundColor: Colors.lightBackground,
    color: Colors.textMediumGray,
  },
  inputIcon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 5,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
    fontFamily: GlobalFonts.textLight,
  },
  label: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
  },
});

export default CustomTextInput;
