// screens/RegisterScreen.js
import React, { useCallback, useState, useEffect, useMemo } from 'react';
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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { GlobalFonts } from '../../config/GlobalFonts';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import { Colors } from '../../config/Colors';
import SearchableDropdown from '../../components/SearchableDropdown';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  LOGO,
  QR_CODE,
  QR_CODE_URL,
  UPI,
  BASE_URL,
} from '../../config/Constant';
import * as RNFS from 'react-native-fs';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import { ShowToast } from '../../components/ShowToast';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();

  const { stateList, districtList, registerAmount } = useSelector(
    state => state.auth,
  );

  const [currentSection, setCurrentSection] = useState('A');
  const [formErrors, setFormErrors] = useState({});
  const [isDownload, setIsDownload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [samName, setSamName] = useState('');

  const [formData, setFormData] = useState({
    hasSamNo: false,
    samNo: '',
    mobileNumber: '',
    state: '',
    district: '',
    fullName: '',
    email: '',
    paymentSlip: null,
    amountPaid: '',
    agreeTerms: false,
  });

  // Format state and district data for dropdown
  const statesData = useMemo(
    () =>
      stateList?.map(state => ({
        value: state.id.toString(),
        label: state.name,
      })) || [],
    [stateList],
  );

  const districtsData = useMemo(
    () =>
      districtList?.map(district => ({
        value: district.id.toString(),
        label: district.name,
      })) || [],
    [districtList],
  );

  // Update amount paid when registerAmount changes
  useEffect(() => {
    if (registerAmount) {
      setFormData(prev => ({ ...prev, amountPaid: registerAmount.toString() }));
    }
  }, [registerAmount]);

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

  const getDistrict = useCallback(() => {
    setIsLoadingDistricts(true);
    try {
      dispatch(authActions.getDistrict(formData.state));
    } catch (error) {
      ShowToast('Failed to fetch districts');
    } finally {
      setIsLoadingDistricts(false);
    }
  }, [dispatch, formData.state]);

  const getRegisterAmount = useCallback(() => {
    try {
      dispatch(authActions.getRegisterAmount());
    } catch (error) {
      ShowToast('Failed to fetch registration amount');
    }
  }, [dispatch]);

  useEffect(() => {
    getStates();
  }, [getStates]);

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state) {
      getDistrict();
    }
  }, [formData.state, getDistrict]);

  // Fetch register amount when state changes
  useEffect(() => {
    getRegisterAmount();
  }, [getRegisterAmount]);

  // Function to fetch guide details directly
  const fetchGuideDetails = async samNo => {
    if (!samNo || samNo.length < 3) {
      setSamName('');
      return;
    }

    setIsLoadingGuide(true);
    const token = '';

    const response = await fetch(`${BASE_URL}get-guide-details/${samNo}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      setSamName(result.name);
    } else {
      setSamName('');
      throw new Error(result.msg);
    }

    setIsLoadingGuide(false);
  };

  // Fetch guide details when SAM number changes with debounce
  useEffect(() => {
    if (formData.samNo && formData.samNo.length >= 3) {
      const timer = setTimeout(() => {
        fetchGuideDetails(formData.samNo).catch(err =>
          console.error('Error in useEffect:', err),
        );
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSamName('');
    }
  }, [formData.samNo]);

  const validateSection = section => {
    const errors = {};

    if (section === 'A') {
      if (formData.hasSamNo && !formData.samNo) {
        errors.samNo = 'SAM Number is required';
      } else if (formData.hasSamNo && formData.samNo.length < 3) {
        errors.samNo = 'SAM Number must be at least 3 characters';
      }

      if (!formData.mobileNumber) {
        errors.mobileNumber = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        errors.mobileNumber = 'Invalid mobile number';
      }

      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
    } else if (section === 'B') {
      if (!formData.fullName) errors.fullName = 'Full name is required';
      if (!formData.state) errors.state = 'State is required';
      if (!formData.district) errors.district = 'District is required';
    } else if (section === 'C') {
      if (!formData.paymentSlip) {
        errors.paymentSlip = 'Payment slip is required';
      }
      if (!formData.amountPaid || parseFloat(formData.amountPaid) <= 0) {
        errors.amountPaid = 'Valid amount is required';
      }
      if (!formData.agreeTerms) {
        errors.agreeTerms = 'You must agree to the terms';
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Special handling for SAM number field
    if (field === 'samNo') {
      // If value starts with SAM, keep it as is
      if (value.toUpperCase().startsWith('SAM')) {
        setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }));
      } else {
        // If it doesn't start with SAM, add the prefix
        const formattedValue = value ? 'SAM' + value.replace(/^SAM/i, '') : '';
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
      }
    } else if (field === 'hasSamNo') {
      // When toggling hasSamNo, reset samNo if switching to false
      setFormData(prev => ({
        ...prev,
        [field]: value,
        samNo: value ? 'SAM' : '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }

    // If state changes, reset district
    if (field === 'state') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleSamNoChange = text => {
    // Always ensure the input starts with "SAM"
    if (text.toUpperCase().startsWith('SAM')) {
      handleInputChange('samNo', text.toUpperCase());
    } else {
      handleInputChange('samNo', 'SAM' + text);
    }
  };

  const handleNext = () => {
    if (currentSection === 'A' && validateSection('A')) {
      setCurrentSection('B');
    } else if (currentSection === 'B' && validateSection('B')) {
      setCurrentSection('C');
    }
  };

  const handlePrevious = () => {
    if (currentSection === 'B') {
      setCurrentSection('A');
    } else if (currentSection === 'C') {
      setCurrentSection('B');
    }
  };

  const handleSubmit = async () => {
    if (!validateSection('C')) {
      return;
    }

    // Additional validation for amount
    if (parseFloat(formData.amountPaid) <= 0) {
      ShowToast(
        'Registration cannot be completed with zero amount. Please complete the payment.',
      );
      return;
    }

    // Additional validation for payment slip
    if (!formData.paymentSlip) {
      ShowToast('Please upload payment slip before submitting');
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(authActions.register(formData));

      if (result.success) {
        // Navigate to success screen
        navigation.replace('RegistrationSuccessMessage', {
          message: result.message || 'Registration submitted successfully!',
        });
      } else {
        ShowToast(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      ShowToast(
        'Registration failed: ' + (error.message || 'Please try again'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  const selectImage = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 300,
        maxHeight: 400,
      });

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        ShowToast('Failed to select image');
      } else if (response.assets && response.assets.length > 0) {
        const image = response.assets[0];
        setFormData(prev => ({
          ...prev,
          paymentSlip: {
            uri: image.uri,
            width: image.width,
            height: image.height,
            mime: image.type,
            base64: image.base64,
          },
        }));
      }
    } catch (err) {
      ShowToast('Something went wrong while selecting image');
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(UPI);
    ShowToast('UPI ID copied to clipboard');
  };

  const downloadQRCode = useCallback(async () => {
    setIsDownload(true);
    try {
      const downloadDest = `${
        RNFS.PicturesDirectoryPath
      }/qr_code_${Date.now()}.jpg`;

      const result = await RNFS.downloadFile({
        fromUrl: QR_CODE_URL,
        toFile: downloadDest,
      }).promise;

      if (result.statusCode !== 200) {
        throw new Error(`Download failed with status: ${result.statusCode}`);
      }

      ShowToast('QR Code downloaded successfully!');
    } finally {
      setIsDownload(false);
    }
  }, []);

  const showQRInstructions = () => {
    Alert.alert(
      'Payment Instructions',
      '1. Scan the QR code using any UPI app\n2. Complete the payment of ₹' +
        formData.amountPaid +
        '\n3. Take a screenshot of the payment confirmation\n4. Upload the screenshot as payment slip\n\nAlternatively, you can copy the UPI ID and make the payment manually.',
      [{ text: 'OK', style: 'default' }],
    );
  };

  const renderSectionA = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SECTION A: APPLICANT DETAILS</Text>

      <View style={styles.checkboxGroup}>
        <Text style={styles.label}>Do You Have SAM No?</Text>
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('hasSamNo', true)}
          >
            <View
              style={[
                styles.radioOuter,
                formData.hasSamNo && styles.radioOuterSelected,
              ]}
            >
              {formData.hasSamNo && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handleInputChange('hasSamNo', false)}
          >
            <View
              style={[
                styles.radioOuter,
                !formData.hasSamNo && styles.radioOuterSelected,
              ]}
            >
              {!formData.hasSamNo && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>No</Text>
          </TouchableOpacity>
        </View>
      </View>

      {formData.hasSamNo ? (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>SAM (Sanchay Advisor Member) No *</Text>
          <View style={styles.samInputContainer}>
            <View style={styles.samPrefix}>
              <Text style={styles.samPrefixText}>SAM</Text>
            </View>
            <TextInput
              style={[styles.samInput, formErrors.samNo && styles.inputError]}
              placeholder="Enter numbers"
              value={formData.samNo.replace('SAM', '')}
              onChangeText={handleSamNoChange}
              keyboardType="numeric"
              maxLength={20}
            />
          </View>
          {formErrors.samNo && (
            <Text style={styles.errorText}>{formErrors.samNo}</Text>
          )}
          {isLoadingGuide ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primaryBlue} />
              <Text style={styles.loadingText}>Loading ...</Text>
            </View>
          ) : (
            samName && <Text style={styles.samName}>{samName}</Text>
          )}
        </View>
      ) : (
        <View style={styles.samContainer}>
          <Text style={styles.samText}>SAM0000</Text>
          <Text style={styles.samSubtext}>Sainik Sanchay</Text>
        </View>
      )}

      <CustomTextInput
        label={'Mobile Number *'}
        iconName="call-outline"
        placeholder="Enter Mobile Number"
        value={formData.mobileNumber}
        onChangeText={text =>
          handleInputChange('mobileNumber', text.replace(/[^0-9]/g, ''))
        }
        keyboardType="numeric"
        maxLength={10}
        error={formErrors.mobileNumber}
      />

      <CustomTextInput
        label={'Email Id *'}
        iconName="mail-outline"
        placeholder="Enter Email ID"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={formErrors.email}
      />

      <View style={styles.buttonRow}>
        <View style={styles.fullButton}>
          <CustomButton title="Next" onPress={handleNext} variant="primary" />
        </View>
      </View>
    </View>
  );

  const renderSectionB = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SECTION A: APPLICANT DETAILS</Text>

      <CustomTextInput
        label={'Full Name *'}
        iconName="person-outline"
        placeholder="Enter Full Name"
        value={formData.fullName}
        onChangeText={text => handleInputChange('fullName', text)}
        error={formErrors.fullName}
      />

      <View style={[styles.inputGroup]}>
        <Text style={styles.label}>State *</Text>
        <SearchableDropdown
          data={statesData}
          placeholder="Select State"
          value={formData.state}
          onSelect={item => handleInputChange('state', item.value)}
          error={formErrors.state}
          loading={isLoadingStates}
        />
        {formErrors.state && (
          <Text style={styles.errorText}>{formErrors.state}</Text>
        )}
      </View>

      <View style={[styles.inputGroup]}>
        <Text style={styles.label}>District *</Text>
        <SearchableDropdown
          data={districtsData}
          placeholder={
            formData.state ? 'Select District' : 'First select a state'
          }
          value={formData.district}
          onSelect={item => handleInputChange('district', item.value)}
          disabled={!formData.state}
          error={formErrors.district}
          loading={isLoadingDistricts}
        />
        {formErrors.district && (
          <Text style={styles.errorText}>{formErrors.district}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Previous"
            onPress={handlePrevious}
            variant="secondary"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Next" onPress={handleNext} variant="primary" />
        </View>
      </View>
    </View>
  );

  const renderSectionC = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SECTION B: UPLOAD PAYMENT DETAILS</Text>

      <View style={styles.paymentInfo}>
        <View style={styles.sectionHeader}>
          <Text style={styles.paymentTitle}>SCAN & PAY</Text>
          <TouchableOpacity onPress={showQRInstructions}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={Colors.primaryBlue}
            />
          </TouchableOpacity>
        </View>

        <Image source={QR_CODE} style={styles.qrCode} resizeMode="contain" />

        <View style={styles.upiContainer}>
          <Text style={styles.upiId}>UPI ID: {UPI}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
            <Ionicons
              name="copy-outline"
              size={16}
              color={Colors.primaryBlue}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <CustomButton
            title={isDownload ? 'Downloading...' : 'Save QR Code'}
            onPress={downloadQRCode}
            variant="secondary"
            loading={isDownload}
            disabled={isDownload}
            size={'small'}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Upload Payment Slip *</Text>

        {formData.paymentSlip ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: formData.paymentSlip.uri }}
              style={styles.paymentImage}
              resizeMode="contain"
            />
            <View style={styles.imageActions}>
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={selectImage}
              >
                <Ionicons
                  name="camera-outline"
                  size={16}
                  color={Colors.white}
                />
                <Text style={styles.changeImageText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.fileUpload,
              formErrors.paymentSlip && styles.inputError,
            ]}
            onPress={selectImage}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={Colors.primaryBlue}
            />
            <Text style={styles.fileUploadText}>Choose file</Text>
            <Text style={styles.fileName}>No file chosen</Text>
          </TouchableOpacity>
        )}

        {formErrors.paymentSlip && (
          <Text style={styles.errorText}>{formErrors.paymentSlip}</Text>
        )}
      </View>

      <CustomTextInput
        label={'Amount Paid'}
        iconName="cash-outline"
        placeholder="Amount Paid"
        value={formData.amountPaid}
        editable={false}
        error={formErrors.amountPaid}
      />

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          I hereby apply for membership... ₹{formData.amountPaid} membership fee
          is non-refundable.
        </Text>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
        >
          <View
            style={[
              styles.checkbox,
              formData.agreeTerms && styles.checkedBox,
              formErrors.agreeTerms && styles.inputError,
            ]}
          >
            {formData.agreeTerms && (
              <Ionicons name="checkmark" size={16} color={Colors.white} />
            )}
          </View>
          <Text style={styles.checkboxLabel}>I Agree</Text>
        </TouchableOpacity>
        {formErrors.agreeTerms && (
          <Text style={styles.errorText}>{formErrors.agreeTerms}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Previous"
            onPress={handlePrevious}
            variant="secondary"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            title={isLoading ? 'Registering...' : 'Submit'}
            onPress={handleSubmit}
            variant="primary"
            loading={isLoading}
            disabled={
              isLoading ||
              !formData.paymentSlip ||
              parseFloat(formData.amountPaid) <= 0
            }
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
        translucent={Platform.OS === 'android' && Platform.Version >= 21}
      />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.header,
                Platform.OS === 'android' &&
                  Platform.Version >= 21 && {
                    paddingTop: StatusBar.currentHeight,
                  },
              ]}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={LOGO}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Sainik Sanchay</Text>
              <Text style={styles.subtitle}>Member Registration</Text>
            </View>

            <View style={styles.formContainer}>
              {currentSection === 'A' && renderSectionA()}
              {currentSection === 'B' && renderSectionB()}
              {currentSection === 'C' && renderSectionC()}
            </View>

            <View style={styles.loginRedirect}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  safeArea: {
    flex: 1,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: GlobalFonts.textBoldItalic,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.lightBlue,
    fontFamily: GlobalFonts.textSemiBoldItalic,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textBold,
    color: Colors.primaryBlue,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.white,
    minHeight: 55,
  },
  samInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.white,
    minHeight: 55,
    overflow: 'hidden',
  },
  samPrefix: {
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  samPrefixText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
  },
  samInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
  },
  amountInput: {
    backgroundColor: Colors.lightBackground,
    color: Colors.textMediumGray,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  samName: {
    color: Colors.success,
    fontSize: 14,
    marginTop: 5,
    fontFamily: GlobalFonts.textSemiBold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.textMediumGray,
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: Colors.primaryBlue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryBlue,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.textDark,
  },
  samContainer: {
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.lightBackground,
    marginBottom: 10,
  },
  samText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
  },
  samSubtext: {
    fontSize: 12,
    color: Colors.textMediumGray,
    marginTop: 4,
    fontFamily: GlobalFonts.textBold,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonWrapper: {
    width: '48%',
  },
  paymentInfo: {
    backgroundColor: Colors.lightBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  paymentTitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.primaryBlue,
    marginRight: 8,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  upiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  upiId: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textMedium,
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textMediumGray,
    marginTop: 5,
    fontStyle: 'italic',
  },
  fileUpload: {
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileUploadText: {
    fontSize: 16,
    color: Colors.primaryBlue,
    fontFamily: GlobalFonts.textSemiBold,
    marginTop: 10,
  },
  fileName: {
    fontSize: 12,
    color: Colors.textMediumGray,
    marginTop: 5,
  },
  imagePreviewContainer: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentImage: {
    width: '100%',
    height: 200,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Colors.lightBackground,
  },
  changeImageButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: Colors.white,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 15,
    lineHeight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.primaryBlue,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textSemiBold,
  },
  loginRedirect: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 12,
    fontFamily: GlobalFonts.textLightItalic,
    color: Colors.textDark,
  },
  loginLink: {
    color: Colors.primaryBlue,
    fontSize: 12,
    fontFamily: GlobalFonts.textBoldItalic,
  },
  fullButton: {
    width: '100%',
  },
});
