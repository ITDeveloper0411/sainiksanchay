import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const CustomTextInput = ({
  iconName,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  isPassword = false,
  showPassword = false,
  togglePasswordVisibility = () => {},
}) => {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={iconName}
        size={20}
        color="#2c6c8c"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#7a9eb5"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#2c6c8c"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e1e8f0',
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#fafbfc',
    shadowColor: '#0d2b4b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0d2b4b',
  },
  eyeIcon: {
    padding: 5,
  },
});

export default CustomTextInput;
