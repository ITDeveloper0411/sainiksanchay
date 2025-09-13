import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Linking,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { GlobalFonts } from '../../config/GlobalFonts';
import { Colors } from '../../config/Colors';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as profileActions from '../../store/actions/profile';
import { LOGO } from '../../config/Constant';
import { ShowToast } from '../../components/ShowToast';

const { width, height } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const { profile } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [image, setImage] = useState(profile?.profile_img || null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Check Android version
  const isAndroid13OrAbove =
    Platform.OS === 'android' && Platform.Version >= 33;

  // Request camera permissions for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          // Permission denied permanently - show alert with settings option
          Alert.alert(
            'Permission Denied',
            'Camera permission has been permanently denied. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return false;
        } else {
          return false;
        }
      } catch (err) {
        console.warn('Camera permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Request gallery permissions for Android - handles all versions
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        let permission;

        // For Android 13+ (API level 33) we need READ_MEDIA_IMAGES
        if (isAndroid13OrAbove) {
          permission = PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
        } else {
          // For older Android versions
          permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        }

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Gallery Permission',
          message: 'This app needs access to your photos to select images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          // Permission denied permanently - show alert with settings option
          Alert.alert(
            'Permission Denied',
            'Gallery permission has been permanently denied. Please enable it in app settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ],
          );
          return false;
        } else {
          return false;
        }
      } catch (err) {
        console.warn('Gallery permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Check if we already have permissions
  const checkExistingPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        let cameraGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );

        let galleryGranted;
        if (isAndroid13OrAbove) {
          galleryGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
        } else {
          galleryGranted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
        }

        return { cameraGranted, galleryGranted };
      } catch (err) {
        console.warn('Permission check error:', err);
        return { cameraGranted: false, galleryGranted: false };
      }
    }
    return { cameraGranted: true, galleryGranted: true };
  };

  // Improved image upload function with better error handling
  const uploadProfileImage = async imageData => {
    try {
      setUploading(true);

      // Create form data for the image
      const formData = new FormData();
      formData.append('profile_img', {
        uri: imageData.path,
        type: imageData.mime,
        name: imageData.filename || `profile_${Date.now()}.jpg`,
      });

      // Dispatch the action to update profile image
      const result = await dispatch(
        profileActions.profileImageUpdate(formData),
      );

      // Refresh profile data
      await dispatch(profileActions.getProfile());

      if (result && result.success) {
        setImage(imageData.path);
        ShowToast('Profile image updated successfully!');
      } else {
        throw new Error(result?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      ShowToast(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    setModalVisible(false);

    // First check if we already have permissions
    const { galleryGranted } = await checkExistingPermissions();

    if (!galleryGranted) {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;
    }

    try {
      const result = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
      });

      // Upload the image to server
      await uploadProfileImage(result);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);

    // First check if we already have permissions
    const { cameraGranted } = await checkExistingPermissions();

    if (!cameraGranted) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;
    }

    try {
      const result = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
      });

      // Upload the image to server
      await uploadProfileImage(result);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(authActions.logout()),
      },
    ]);
  };

  // Function to get KYC status details
  const getKycStatusDetails = () => {
    const status = profile?.kyc_status || 'NOT VERIFIED';
    let icon, color, message, bgColor;

    switch (status) {
      case 'VERIFIED':
        icon = 'checkmark-circle';
        color = Colors.success;
        bgColor = Colors.featureTeal;
        message = 'Your KYC has been successfully verified';
        break;
      case 'NOT VERIFIED':
        icon = 'alert-circle';
        color = Colors.textMediumGray;
        bgColor = Colors.lightBackground;
        message = 'Please complete your KYC verification';
        break;
      case 'SEND FOR APPROVAL':
        icon = 'time';
        color = Colors.warning;
        bgColor = Colors.featureYellow;
        message = 'Your KYC is under review';
        break;
      case 'REJECTED':
        icon = 'close-circle';
        color = Colors.error;
        bgColor = Colors.featureRed;
        message = profile?.kyc_rejection || 'Your KYC has been rejected';
        break;
      default:
        icon = 'alert-circle';
        color = Colors.textMediumGray;
        bgColor = Colors.lightBackground;
        message = 'KYC status unknown';
    }

    return { status, icon, color, message, bgColor };
  };

  const kycStatus = getKycStatusDetails();

  const menuItems = [
    {
      id: 1,
      title: 'Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
      color: '#6366F1',
    },
    {
      id: 2,
      title: 'Nominee',
      icon: 'people-outline',
      onPress: () => navigation.navigate('Nominee'),
      color: '#EC4899',
    },
    {
      id: 3,
      title: 'KYC',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('KYC'),
      color: '#F59E0B',
      status: kycStatus.status,
      statusColor: kycStatus.color,
    },
    {
      id: 4,
      title: 'My Referral',
      icon: 'gift-outline',
      onPress: () => navigation.navigate('ReferralList'),
      color: Colors.success,
    },
    {
      id: 5,
      title: 'Referral Income',
      icon: 'wallet-outline',
      onPress: () => navigation.navigate('ReferralIncome'),
      color: '#8B5CF6',
    },
    {
      id: 6,
      title: 'Change Password',
      icon: 'lock-closed-outline',
      onPress: () => navigation.navigate('ChangePassword'),
      color: '#06B6D4',
    },
  ];

  return (
    <View style={styles.fullContainer}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
        translucent={Platform.OS === 'android'}
      />

      {/* SafeAreaView with proper edges for iOS and Android */}
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Profile Header Section */}
          <View style={styles.profileHeader}>
            <View style={styles.profileCard}>
              <View style={styles.imageContainer}>
                {uploading ? (
                  <View style={styles.imageLoading}>
                    <ActivityIndicator
                      size="large"
                      color={Colors.primaryBlue}
                    />
                  </View>
                ) : (
                  <Image
                    source={image ? { uri: image } : LOGO}
                    style={styles.profileImage}
                    onError={() => setImage(null)}
                  />
                )}
                <TouchableOpacity
                  style={styles.editImageButton}
                  onPress={() => setModalVisible(true)}
                  disabled={uploading}
                >
                  <Ionicons name="camera" size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {profile?.name || 'User Name'}
                </Text>
                <Text style={styles.userId}>
                  SAM ID: {profile?.username || 'N/A'}
                </Text>
                <Text style={styles.userPhone}>{profile?.mobile || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* KYC Status Banner */}
          {profile?.kyc_status && (
            <View
              style={[styles.kycBanner, { backgroundColor: kycStatus.bgColor }]}
            >
              <View style={styles.kycBannerContent}>
                <Ionicons
                  name={kycStatus.icon}
                  size={24}
                  color={kycStatus.color}
                  style={styles.kycIcon}
                />
                <View style={styles.kycTextContainer}>
                  <Text
                    style={[styles.kycStatusText, { color: kycStatus.color }]}
                  >
                    KYC {kycStatus.status}
                  </Text>
                  <Text style={styles.kycMessageText}>{kycStatus.message}</Text>
                </View>
              </View>
              {profile?.kyc_status === 'REJECTED' && (
                <TouchableOpacity
                  style={styles.kycActionButton}
                  onPress={() => navigation.navigate('KYC')}
                >
                  <Text
                    style={[styles.kycActionText, { color: kycStatus.color }]}
                  >
                    Resubmit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.menuIcon, { backgroundColor: item.color }]}
                >
                  <Ionicons name={item.icon} size={20} color={Colors.white} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.status ? (
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: item.statusColor },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.textLight}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Support Section */}
          <View style={styles.supportContainer}>
            <Text style={styles.sectionTitle}>Support</Text>
            <TouchableOpacity
              style={styles.supportCard}
              onPress={() => navigation.navigate('Contact')}
            >
              <View style={styles.supportIcon}>
                <Ionicons name="help-buoy-outline" size={24} color="#6366F1" />
              </View>
              <View style={styles.supportContent}>
                <Text style={styles.supportTitle}>Need Help?</Text>
                <Text style={styles.supportSubtitle}>
                  Contact our support team for assistance
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Image Picker Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Profile Photo</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={takePhoto}
                activeOpacity={0.7}
              >
                <View style={styles.modalIcon}>
                  <Ionicons name="camera" size={24} color="#6366F1" />
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalOptionText}>Take Photo</Text>
                  <Text style={styles.modalOptionSubtext}>
                    Use your camera to take a new photo
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <View style={styles.modalIcon}>
                  <Ionicons name="image" size={24} color="#6366F1" />
                </View>
                <View style={styles.modalTextContainer}>
                  <Text style={styles.modalOptionText}>
                    Choose from Gallery
                  </Text>
                  <Text style={styles.modalOptionSubtext}>
                    Select an existing photo from your device
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.modalSeparator} />

              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 60, // Extra padding for logout button
    minHeight: height,
  },
  profileHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.primaryBlue,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.borderLight,
  },
  imageLoading: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderWidth: 3,
    borderColor: Colors.borderLight,
  },
  editImageButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: Colors.primaryBlue,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 6,
  },
  userId: {
    fontSize: 14,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textGray,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textGray,
  },
  // KYC Banner Styles
  kycBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kycBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  kycIcon: {
    marginRight: 12,
  },
  kycTextContainer: {
    flex: 1,
  },
  kycStatusText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textSemiBold,
    marginBottom: 4,
  },
  kycMessageText: {
    fontSize: 14,
    fontFamily: GlobalFonts.textRegular,
    color: Colors.textGray,
  },
  kycActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  kycActionText: {
    fontSize: 14,
    fontFamily: GlobalFonts.textMedium,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textLightGray,
  },
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  supportContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    padding: 16,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.featureBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 14,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textGray,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 30 : 50, // Extra margin for Android
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.error,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.transparentBlack30,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: width * 0.85,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.featureBlue,
    marginRight: 16,
  },
  modalTextContainer: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    marginBottom: 4,
  },
  modalOptionSubtext: {
    fontSize: 13,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textGray,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  modalCancel: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: Colors.lightBackground,
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textGray,
  },
});

export default SettingsScreen;
