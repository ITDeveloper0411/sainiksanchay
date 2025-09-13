import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../config/Colors';
import BackHeader from '../../components/BackHeader';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import SearchableDropdown from '../../components/SearchableDropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ShowToast } from '../../components/ShowToast';
import { useDispatch, useSelector } from 'react-redux';
import * as profileActions from '../../store/actions/profile';
import * as authActions from '../../store/actions/auth';
import { GlobalFonts } from '../../config/GlobalFonts';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.profile);
  const { stateList, districtList } = useSelector(state => state.auth);

  const [updating, setUpdating] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    father: '',
    dob: '',
    gender: '',
    emailid: '',
    mobile: '',
    state: '',
    district: '',
    pincode: '',
    occupation: '',
    address: '',
    state_id: '',
    district_id: '',
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // Gender options
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile?.name || '',
        father: profile?.father || '',
        dob: profile?.dob || '',
        gender: profile?.gender || '',
        emailid: profile?.emailid || '',
        mobile: profile?.mobile || '',
        state: profile?.state || '',
        district: profile?.district || '',
        pincode: profile?.pincode || '',
        occupation: profile?.occupation || '',
        address: profile?.address || '',
        state_id: profile?.state_id || '',
        district_id: profile?.district_id || '',
      });
    }
  }, [profile]);

  // Track form changes
  useEffect(() => {
    if (profile) {
      const hasFormChanged =
        formData.name !== (profile.name || '') ||
        formData.father !== (profile.father || '') ||
        formData.dob !== (profile.dob || '') ||
        formData.gender !== (profile.gender || '') ||
        formData.emailid !== (profile.emailid || '') ||
        formData.mobile !== (profile.mobile || '') ||
        formData.state !== (profile.state || '') ||
        formData.district !== (profile.district || '') ||
        formData.pincode !== (profile.pincode || '') ||
        formData.occupation !== (profile.occupation || '') ||
        formData.address !== (profile.address || '');

      setHasChanges(hasFormChanged);
    }
  }, [formData, profile]);

  // Fetch states on component mount
  const getStates = useCallback(() => {
    setIsLoadingStates(true);
    try {
      dispatch(authActions.getStates());
    } catch (error) {
      ShowToast('Failed to fetch states');
    } finally {
      setIsLoadingStates(false);
    }
  }, [dispatch]);

  // Fetch districts when state changes
  const getDistrict = useCallback(() => {
    if (formData.state_id) {
      setIsLoadingDistricts(true);
      try {
        dispatch(authActions.getDistrict(formData.state_id));
      } catch (error) {
        ShowToast('Failed to fetch districts');
      } finally {
        setIsLoadingDistricts(false);
      }
    }
  }, [dispatch, formData.state_id]);

  useEffect(() => {
    getStates();
  }, [getStates]);

  useEffect(() => {
    getDistrict();
  }, [formData.state_id, getDistrict]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.emailid.trim()) {
      newErrors.emailid = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.emailid)) {
      newErrors.emailid = 'Please enter a valid email address';
    }

    if (!formData.father.trim()) {
      newErrors.father = "Father's name is required";
    }

    if (!formData.dob.trim()) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!formData.state_id) {
      newErrors.state = 'State is required';
    }

    if (!formData.district_id) {
      newErrors.district = 'District is required';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
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
      const result = await dispatch(profileActions.profileUpdate(formData));

      if (result?.success) {
        // Refresh profile data
        await dispatch(profileActions.getProfile());
        ShowToast(result.message || 'Profile updated successfully');
        navigation.goBack();
      } else {
        throw new Error(result?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.log(error.message);
      ShowToast(error.message || 'Failed to save profile details');
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

  const handleStateSelect = useCallback(
    item => {
      handleInputChange('state_id', item.value);
      handleInputChange('state', item.label);
      // Reset district when state changes
      handleInputChange('district_id', '');
      handleInputChange('district', '');
    },
    [handleInputChange],
  );

  const handleDistrictSelect = useCallback(
    item => {
      handleInputChange('district_id', item.value);
      handleInputChange('district', item.label);
    },
    [handleInputChange],
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    const formattedDate = date.toISOString().split('T')[0];
    handleInputChange('dob', formattedDate);
    hideDatePicker();
  };

  // Format states and districts for dropdown
  const stateOptions =
    stateList?.map(state => ({
      label: state.name,
      value: state.id.toString(),
    })) || [];

  const districtOptions =
    districtList?.map(district => ({
      label: district.name,
      value: district.id.toString(),
    })) || [];

  return (
    <View style={styles.fullContainer}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
        translucent={Platform.OS === 'android'}
      />

      <SafeAreaView
        style={styles.container}
        edges={['right', 'left', 'bottom']}
      >
        <BackHeader
          title="Edit Profile"
          onBackPress={() => navigation.goBack()}
          backgroundColor={Colors.primaryBlue}
          titleColor={Colors.white}
          backIconColor={Colors.white}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <CustomTextInput
                label="Full Name *"
                iconName="person-outline"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={text => handleInputChange('name', text)}
                error={errors.name}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <CustomTextInput
                label="Mobile Number *"
                iconName="call-outline"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChangeText={text =>
                  handleInputChange('mobile', text.replace(/[^0-9]/g, ''))
                }
                error={errors.mobile}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
              />

              <CustomTextInput
                label="Email ID *"
                iconName="mail-outline"
                placeholder="Enter your email address"
                value={formData.emailid}
                onChangeText={text => handleInputChange('emailid', text)}
                error={errors.emailid}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <CustomTextInput
                label="Father's Name *"
                iconName="person-outline"
                placeholder="Enter your father's name"
                value={formData.father}
                onChangeText={text => handleInputChange('father', text)}
                error={errors.father}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <TouchableOpacity onPress={showDatePicker}>
                <CustomTextInput
                  label="Date of Birth *"
                  iconName="calendar-outline"
                  placeholder="Select your date of birth"
                  value={formData.dob}
                  editable={false}
                  error={errors.dob}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              <Text style={styles.label}>Gender *</Text>
              <SearchableDropdown
                data={genderOptions}
                placeholder="Select Gender *"
                value={formData.gender}
                onSelect={item => handleInputChange('gender', item.value)}
                searchPlaceholder="Search gender..."
                error={errors.gender}
                style={styles.dropdown}
              />

              <CustomTextInput
                label="Residential Address *"
                iconName="location-outline"
                placeholder="Enter your complete address"
                value={formData.address}
                onChangeText={text => handleInputChange('address', text)}
                error={errors.address}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="next"
              />

              <CustomTextInput
                label="Pincode *"
                iconName="pin-outline"
                placeholder="Enter your pincode"
                value={formData.pincode}
                onChangeText={text =>
                  handleInputChange('pincode', text.replace(/[^0-9]/g, ''))
                }
                error={errors.pincode}
                keyboardType="number-pad"
                maxLength={6}
                returnKeyType="next"
              />

              <Text style={styles.label}>State *</Text>
              <SearchableDropdown
                data={stateOptions}
                placeholder="Select State"
                value={formData.state_id}
                onSelect={handleStateSelect}
                searchPlaceholder="Search state..."
                error={errors.state}
                style={styles.dropdown}
                loading={isLoadingStates}
              />

              <Text style={styles.label}>District *</Text>
              <SearchableDropdown
                data={districtOptions}
                placeholder="Select District"
                value={formData.district_id}
                onSelect={handleDistrictSelect}
                searchPlaceholder="Search district..."
                error={errors.district}
                style={styles.dropdown}
                loading={isLoadingDistricts}
                disabled={!formData.state_id}
              />

              <CustomTextInput
                label="Occupation *"
                iconName="briefcase-outline"
                placeholder="Enter your occupation"
                value={formData.occupation}
                onChangeText={text => handleInputChange('occupation', text)}
                error={errors.occupation}
                autoCapitalize="words"
                returnKeyType="done"
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                maximumDate={new Date()}
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  title={updating ? 'Updating...' : 'Update Profile'}
                  onPress={handleSubmit}
                  variant="primary"
                  loading={updating}
                  disabled={updating || !hasChanges}
                  style={[!hasChanges && styles.disabledButton]}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBlue,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    padding: 20,
  },
  dropdown: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default ProfileScreen;
