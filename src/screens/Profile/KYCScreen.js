import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { GlobalFonts } from '../../config/GlobalFonts';
import { Colors } from '../../config/Colors';
import Icon from '@react-native-vector-icons/material-icons';
import BackHeader from '../../components/BackHeader';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import { ShowToast } from '../../components/ShowToast';
import { useDispatch, useSelector } from 'react-redux';
import * as profileActions from '../../store/actions/profile';
import { launchImageLibrary } from 'react-native-image-picker';

const ImagePickerButton = ({ label, onImagePicked, error, image, style }) => {
  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
      includeExtra: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        ShowToast('Failed to select image');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        // Create a proper image object with all needed properties
        const imageObject = {
          uri:
            Platform.OS === 'android'
              ? asset.uri
              : asset.uri.replace('file://', ''),
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `image_${Date.now()}.jpg`,
          isNew: true, // Flag to indicate this is a new image
        };
        onImagePicked(imageObject);
      }
    });
  };

  const imageUri = typeof image === 'string' ? image : image?.uri;

  return (
    <View style={[styles.imageContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.button, error && styles.errorBorder]}
        onPress={handleSelectImage}
      >
        {imageUri ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.changeOverlay}>
              <Icon name="camera-alt" size={20} color={Colors.white} />
              <Text style={styles.changeText}>Change</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Icon name="camera-alt" size={24} color={Colors.textLightGray} />
            <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const KYCScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.profile);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    aadhaar: '',
    pan: '',
    aadhaar_img: null,
    aadhaar_back_img: null,
    pan_img: null,
    checkbook_img: null,
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        aadhaar: profile?.aadhaar || '',
        pan: profile?.pan || '',
        aadhaar_img: profile?.aadhaar_img || null,
        aadhaar_back_img: profile?.aadhaar_back_img || null,
        pan_img: profile?.pan_img || null,
        checkbook_img: profile?.checkbook_img || null,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const hasFormChanged =
        formData.aadhaar !== (profile.aadhaar || '') ||
        formData.pan !== (profile.pan || '') ||
        (formData.aadhaar_img && typeof formData.aadhaar_img !== 'string') ||
        (formData.aadhaar_back_img &&
          typeof formData.aadhaar_back_img !== 'string') ||
        (formData.pan_img && typeof formData.pan_img !== 'string') ||
        (formData.checkbook_img && typeof formData.checkbook_img !== 'string');

      setHasChanges(hasFormChanged);
    }
  }, [formData, profile]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (!formData.pan.trim()) {
      newErrors.pan = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'Please enter a valid PAN number';
    }

    if (!formData.aadhaar_img) {
      newErrors.aadhaar_img = 'Aadhaar front image is required';
    }

    if (!formData.aadhaar_back_img) {
      newErrors.aadhaar_back_img = 'Aadhaar back image is required';
    }

    if (!formData.pan_img) {
      newErrors.pan_img = 'PAN image is required';
    }

    if (!formData.checkbook_img) {
      newErrors.checkbook_img = 'Cheque image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const prepareFormData = useCallback(() => {
    const data = new FormData();

    // Always include all fields in the form data
    data.append('aadhaar', formData.aadhaar);
    data.append('pan', formData.pan);

    // Handle image fields
    if (formData.aadhaar_img) {
      if (typeof formData.aadhaar_img === 'string') {
        // If it's a string (existing image URL), send it as a regular field
        data.append('aadhaar_img', formData.aadhaar_img);
      } else {
        // It's a new image file object
        data.append('aadhaar_img', formData.aadhaar_img);
      }
    }

    if (formData.aadhaar_back_img) {
      if (typeof formData.aadhaar_back_img === 'string') {
        data.append('aadhaar_back_img', formData.aadhaar_back_img);
      } else {
        data.append('aadhaar_back_img', formData.aadhaar_back_img);
      }
    }

    if (formData.pan_img) {
      if (typeof formData.pan_img === 'string') {
        data.append('pan_img', formData.pan_img);
      } else {
        data.append('pan_img', formData.pan_img);
      }
    }

    if (formData.checkbook_img) {
      if (typeof formData.checkbook_img === 'string') {
        data.append('checkbook_img', formData.checkbook_img);
      } else {
        data.append('checkbook_img', formData.checkbook_img);
      }
    }

    return data;
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
      const formDataToSend = prepareFormData();
      const result = await dispatch(profileActions.kycUpdate(formDataToSend));

      if (result?.success) {
        await dispatch(profileActions.getProfile());
        ShowToast(result.message || 'KYC details updated successfully');
        navigation.goBack();
      } else {
        throw new Error(result?.message || 'Failed to update KYC details');
      }
    } catch (error) {
      console.log('KYC Update Error:', error.message);
      ShowToast(error.message || 'Failed to save KYC details');
    } finally {
      setUpdating(false);
    }
  }, [validateForm, hasChanges, dispatch, navigation, prepareFormData]);

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

  const handleImagePick = useCallback(
    (field, image) => {
      setFormData(prev => ({ ...prev, [field]: image }));
      // Clear error when user selects an image
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    },
    [errors],
  );

  return (
    <View style={styles.container}>
      <BackHeader
        title="KYC Verification"
        onBackPress={() => navigation.goBack()}
        backgroundColor={Colors.primaryBlue}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <Icon name="info" size={20} color={Colors.primaryBlue} />
          <Text style={styles.infoText}>
            Please provide your KYC documents for account verification. All
            documents must be clear and valid.
          </Text>
        </View>

        <CustomTextInput
          label="Aadhaar Number"
          iconName="id-card"
          placeholder="Enter 12-digit Aadhaar number"
          value={formData.aadhaar}
          onChangeText={text =>
            handleInputChange('aadhaar', text.replace(/[^0-9]/g, ''))
          }
          error={errors.aadhaar}
          keyboardType="numeric"
          maxLength={12}
          returnKeyType="next"
        />

        <View style={styles.imageRow}>
          <ImagePickerButton
            label="Aadhaar Front Image"
            onImagePicked={image => handleImagePick('aadhaar_img', image)}
            error={errors.aadhaar_img}
            image={formData.aadhaar_img}
            style={styles.halfWidth}
          />
          <ImagePickerButton
            label="Aadhaar Back Image"
            onImagePicked={image => handleImagePick('aadhaar_back_img', image)}
            error={errors.aadhaar_back_img}
            image={formData.aadhaar_back_img}
            style={styles.halfWidth}
          />
        </View>

        <CustomTextInput
          label="PAN Number"
          iconName="card"
          placeholder="Enter PAN number"
          value={formData.pan}
          onChangeText={text => handleInputChange('pan', text.toUpperCase())}
          error={errors.pan}
          autoCapitalize="characters"
          maxLength={10}
          returnKeyType="next"
        />

        <ImagePickerButton
          label="PAN Card Image"
          onImagePicked={image => handleImagePick('pan_img', image)}
          error={errors.pan_img}
          image={formData.pan_img}
        />

        <ImagePickerButton
          label="Cancelled Cheque Image"
          onImagePicked={image => handleImagePick('checkbook_img', image)}
          error={errors.checkbook_img}
          image={formData.checkbook_img}
        />

        <CustomButton
          title={updating ? 'Uploading...' : 'Submit for Verification'}
          onPress={handleSubmit}
          variant="primary"
          loading={updating}
          disabled={updating || !hasChanges}
          style={[styles.submitButton, !hasChanges && styles.disabledButton]}
        />

        {/* Add extra padding at the bottom to ensure button is visible */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 30, // Added extra padding at the bottom
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
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  bottomPadding: {
    height: 20, // Extra space to ensure button is not hidden
  },
  imageContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    marginBottom: 8,
  },
  button: {
    height: 150,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.textLight,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    color: Colors.white,
    marginLeft: 5,
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textLight,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.textLightGray,
    fontFamily: GlobalFonts.textLight,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontFamily: GlobalFonts.textLight,
    marginTop: 4,
  },
});

export default KYCScreen;
