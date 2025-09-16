import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalFonts } from '../../config/GlobalFonts';
import { Colors } from '../../config/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import BackHeader from '../../components/BackHeader';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { ShowToast } from '../../components/ShowToast';
import { useDispatch } from 'react-redux';
import * as profileActions from '../../store/actions/profile';
import * as authActions from '../../store/actions/auth';

const ChangePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.old_password.trim()) {
      newErrors.old_password = 'Current password is required';
    }

    if (!formData.new_password.trim()) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters long';
    }

    if (!formData.new_password_confirmation.trim()) {
      newErrors.new_password_confirmation = 'Please confirm your new password';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      ShowToast('Please fix the errors before submitting');
      return;
    }

    setUpdating(true);
    try {
      const result = await dispatch(profileActions.changePassword(formData));

      if (result?.success) {
        ShowToast(result.message || 'Password changed successfully');

        // Clear form
        setFormData({
          old_password: '',
          new_password: '',
          new_password_confirmation: '',
        });

        // Logout after password change for security
        await dispatch(authActions.logout());
      } else {
        throw new Error(result?.message || 'Failed to change password');
      }
    } catch (error) {
      ShowToast(error.message || 'Failed to change password');
    } finally {
      setUpdating(false);
    }
  }, [formData, validateForm, dispatch]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <BackHeader
          title="Change Password"
          onBackPress={() => navigation.goBack()}
          backgroundColor={Colors.primaryBlue}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoContainer}>
            <Ionicons
              name="information-circle"
              size={20}
              color={Colors.primaryBlue}
            />
            <Text style={styles.infoText}>
              Please enter your current password and set a new password for your
              account. You will be logged out after successful password change.
            </Text>
          </View>

          <CustomTextInput
            label="Current Password"
            iconName="lock-closed-outline"
            placeholder="Enter your current password"
            value={formData.old_password}
            onChangeText={text => handleInputChange('old_password', text)}
            error={errors.old_password}
            secureTextEntry={true}
            returnKeyType="next"
          />

          <CustomTextInput
            label="New Password"
            iconName="lock-closed-outline"
            placeholder="Enter your new password"
            value={formData.new_password}
            onChangeText={text => handleInputChange('new_password', text)}
            error={errors.new_password}
            secureTextEntry={true}
            returnKeyType="next"
          />

          <CustomTextInput
            label="Confirm New Password"
            iconName="lock-closed-outline"
            placeholder="Confirm your new password"
            value={formData.new_password_confirmation}
            onChangeText={text =>
              handleInputChange('new_password_confirmation', text)
            }
            error={errors.new_password_confirmation}
            secureTextEntry={true}
            returnKeyType="done"
          />

          <CustomButton
            title={updating ? 'Updating...' : 'Change Password'}
            onPress={handleSubmit}
            variant="primary"
            loading={updating}
            disabled={updating}
            style={styles.submitButton}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 30, // Extra padding to ensure button is visible
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryBlue + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textMedium,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 20, // Ensure button has space at bottom
  },
});

export default ChangePasswordScreen;
