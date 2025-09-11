import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../../config/GlobalFonts';
import { LOGO } from '../../config/Constant';
import { Colors } from '../../config/Colors';
import * as authActions from '../../store/actions/auth';

import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { useDispatch } from 'react-redux';
import { ShowToast } from '../../components/ShowToast';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('SAM0002');
  const [password, setPassword] = useState('9709970152');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateSection = () => {
    const errors = {};

    if (!username) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateSection()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(authActions.login(username, password));

      if (result.success) {
      } else {
        ShowToast(result.msg || 'Invalid Credentials.');
      }
    } catch (error) {
      ShowToast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
      />
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
                Access your account securely
              </Text>

              {/* Username Input */}
              <CustomTextInput
                iconName="person-outline"
                placeholder="Customer ID / Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                error={formErrors.username}
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
                error={formErrors.password}
              />

              {/* Login Button with financial app styling */}

              <CustomButton
                title={isLoading ? 'Authenticating...' : 'Access My Account'}
                onPress={handleLogin}
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
              />

              {/* Security Features */}
              <View style={styles.securityContainer}>
                <View style={styles.securityItem}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={Colors.success}
                  />
                  <Text style={styles.securityText}>Bank-grade security</Text>
                </View>
                <View style={styles.securityItem}>
                  <Ionicons
                    name="lock-closed"
                    size={16}
                    color={Colors.success}
                  />
                  <Text style={styles.securityText}>SSL encrypted</Text>
                </View>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>New to Sainik Sanchay? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.signupLink}>Register Here</Text>
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
    backgroundColor: Colors.lightBackground,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
    textShadowColor: Colors.transparentBlack30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: GlobalFonts.textBoldItalic,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.lightBlue,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: GlobalFonts.textSemiBoldItalic,
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
    backgroundColor: Colors.transparentBlue15,
    borderRadius: 20,
    zIndex: 1,
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 20,
    zIndex: 2,
    borderWidth: 1,
    borderColor: Colors.transparentWhite80,
    shadowColor: Colors.primaryBlue,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 20,
  },
  loginText: {
    fontSize: 24,
    color: Colors.primaryBlue,
    textAlign: 'center',
    fontFamily: GlobalFonts.textBold,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: Colors.textMediumGray,
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
    borderColor: Colors.darkBlue,
    borderRadius: 2,
    marginRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
  },
  checkedBox: {
    backgroundColor: Colors.darkBlue,
  },
  rememberText: {
    color: Colors.textLightGray,
    fontSize: 12,
    fontFamily: GlobalFonts.textLight,
  },
  forgotText: {
    color: Colors.darkBlue,
    fontSize: 12,
    fontFamily: GlobalFonts.textBold,
  },
  securityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    color: Colors.textLightGray,
    fontSize: 14,
    fontFamily: GlobalFonts.textLightItalic,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: Colors.textGray,
    fontSize: 12,
    fontFamily: GlobalFonts.textLightItalic,
  },
  signupLink: {
    color: Colors.primaryBlue,
    fontSize: 12,
    fontFamily: GlobalFonts.textBoldItalic,
  },
});
