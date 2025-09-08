import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { LOGO } from '../config/Constant';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    // Handle login logic here
    Alert.alert('Success', 'Login successful!');
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#0d2b4b" barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Sainik Sanchay</Text>
            <Text style={styles.subtitle}>
              Banking Solutions for Our Heroes
            </Text>
          </View>

          {/* Login Form with financial app styling */}
          <View style={styles.formWrapper}>
            <View style={styles.formShadow} />
            <View style={styles.formContainer}>
              <Text style={styles.loginText}>Secure Login</Text>
              <Text style={styles.welcomeSubtext}>
                Access your loan account securely
              </Text>

              {/* Username Input */}
              <CustomTextInput
                iconName="person-outline"
                placeholder="Customer ID / Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              {/* Password Input */}
              <CustomTextInput
                iconName="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                isPassword={true}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.rememberContainer}>
                <TouchableOpacity
                  onPress={toggleRememberMe}
                  style={styles.rememberCheck}
                >
                  <View
                    style={[styles.checkbox, rememberMe && styles.checkedBox]}
                  >
                    {rememberMe && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button with financial app styling */}
              <CustomButton title="Access My Account" onPress={handleLogin} />

              {/* Security Features */}
              <View style={styles.securityContainer}>
                <View style={styles.securityItem}>
                  <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                  <Text style={styles.securityText}>Bank-grade security</Text>
                </View>
                <View style={styles.securityItem}>
                  <Ionicons name="lock-closed" size={16} color="#10b981" />
                  <Text style={styles.securityText}>SSL encrypted</Text>
                </View>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New to Sainik Sanchay? </Text>
                <TouchableOpacity>
                  <Text style={styles.signupLink}>Apply for a Loan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0d2b4b',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: GlobalFonts.textBold,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0c1d4',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: GlobalFonts.textSemiBold,
  },
  formWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    position: 'relative',
    zIndex: 2,
  },
  formShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: 'rgba(13, 43, 75, 0.15)',
    borderRadius: 20,
    zIndex: 1,
  },
  formContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#0d2b4b',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  loginText: {
    fontSize: 24,
    color: '#0d2b4b',
    textAlign: 'center',
    fontFamily: GlobalFonts.textBold,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: GlobalFonts.textLight,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  rememberCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#2c6c8c',
    borderRadius: 2,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  checkedBox: {
    backgroundColor: '#2c6c8c',
  },
  rememberText: {
    color: '#4B5563',
    fontSize: 12,
    fontFamily: GlobalFonts.textRegular,
  },
  forgotText: {
    color: '#2c6c8c',
    fontSize: 12,
    fontFamily: GlobalFonts.textBold,
  },
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    color: '#4B5563',
    fontSize: 14,
    fontFamily: GlobalFonts.textLight,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 15,
    fontFamily: GlobalFonts.textLight,
  },
  signupLink: {
    color: '#0d2b4b',
    fontSize: 15,
    fontFamily: GlobalFonts.textBold,
  },
});
