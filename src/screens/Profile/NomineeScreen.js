import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GlobalFonts } from '../../config/GlobalFonts';
import { Colors } from '../../config/Colors';
import Icon from '@react-native-vector-icons/material-icons';
import BackHeader from '../../components/BackHeader';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { ShowToast } from '../../components/ShowToast';
import { useDispatch, useSelector } from 'react-redux';
import * as profileActions from '../../store/actions/profile';

const NomineeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.profile);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    nominee_name: 'sdjkfs',
    relationship: 'sdf',
    nominee_mobile: '1234567890',
    nominee_address: 'sd,mfjsu',
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        nominee_name: profile?.nominee_name || '',
        relationship: profile?.relationship || '',
        nominee_mobile: profile?.nominee_mobile || '',
        nominee_address: profile?.nominee_address || '',
      });
    }
  }, [profile]);

  // Track form changes
  useEffect(() => {
    if (profile) {
      const hasFormChanged =
        formData.nominee_name !== (profile.nominee_name || '') ||
        formData.relationship !== (profile.relationship || '') ||
        formData.nominee_mobile !== (profile.nominee_mobile || '') ||
        formData.nominee_address !== (profile.nominee_address || '');

      setHasChanges(hasFormChanged);
    }
  }, [formData, profile]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nominee_name.trim()) {
      newErrors.nominee_name = 'Nominee name is required';
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    if (!formData.nominee_mobile.trim()) {
      newErrors.nominee_mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.nominee_mobile)) {
      newErrors.nominee_mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.nominee_address.trim()) {
      newErrors.nominee_address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      ShowToast('Please fix the errors before submitting');
      return;
    }

    if (!hasChanges) {
      ShowToast('No changes to save');
      return;
    }

    setUpdating(true);
    try {
      const result = await dispatch(
        profileActions.nomineeDetailsUpdate(formData),
      );

      if (result?.success) {
        // Refresh profile data
        await dispatch(profileActions.getProfile());
        ShowToast(result.message || 'Nominee details updated successfully');
        navigation.goBack();
      } else {
        throw new Error(result?.message || 'Failed to update nominee details');
      }
    } catch (error) {
      console.log(error.message);
      ShowToast(error.message || 'Failed to save nominee details');
    } finally {
      setUpdating(false);
    }
  }, [formData, validateForm, hasChanges, dispatch, navigation]);

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
      <BackHeader
        title="Nominee Details"
        onBackPress={() => navigation.goBack()}
        backgroundColor={Colors.primaryBlue}
      />

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <Icon name="info" size={20} color={Colors.primaryBlue} />
          <Text style={styles.infoText}>
            Please provide your nominee details for account security purposes.
          </Text>
        </View>

        <CustomTextInput
          label="Nominee Name"
          iconName="person-outline"
          placeholder="Enter nominee's full name"
          value={formData.nominee_name}
          onChangeText={text => handleInputChange('nominee_name', text)}
          error={errors.nominee_name}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <CustomTextInput
          label="Relationship"
          iconName="people-outline"
          placeholder="e.g., Father, Mother, Spouse, etc."
          value={formData.relationship}
          onChangeText={text => handleInputChange('relationship', text)}
          error={errors.relationship}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <CustomTextInput
          label="Mobile Number"
          iconName="call-outline"
          placeholder="Enter nominee's mobile number"
          value={formData.nominee_mobile}
          onChangeText={text =>
            handleInputChange('nominee_mobile', text.replace(/[^0-9]/g, ''))
          }
          error={errors.nominee_mobile}
          keyboardType="phone-pad"
          maxLength={10}
          returnKeyType="next"
        />

        <CustomTextInput
          label="Address"
          iconName="location-outline"
          placeholder="Enter nominee's complete address"
          value={formData.nominee_address}
          onChangeText={text => handleInputChange('nominee_address', text)}
          error={errors.nominee_address}
          multiline={true}
          numberOfLines={4}
          returnKeyType="done"
        />

        <CustomButton
          title={updating ? 'Updating...' : 'Update Nominee'}
          onPress={handleSubmit}
          variant="primary"
          loading={updating}
          disabled={updating || !hasChanges}
          style={[!hasChanges && styles.disabledButton]}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  formContainer: {
    flex: 1,
    padding: 16,
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
  disabledButton: {
    opacity: 0.6,
  },
});

export default NomineeScreen;
