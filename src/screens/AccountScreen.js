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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as profileActions from '../store/actions/profile';
import { LOGO } from '../config/Constant';

const { width } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {
  const { profile } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [image, setImage] = useState(profile?.profile_img || null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Request camera permissions for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Request gallery permissions for Android
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Gallery Permission',
            message: 'This app needs access to your gallery',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    setModalVisible(false);

    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Sorry, we need gallery permissions to make this work!',
      );
      return;
    }

    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
        mediaType: 'photo',
      });

      // Upload the image to server
      setUploading(true);
      await dispatch(profileActions.profileImageUpdate(image));

      setImage(image.path);
      setUploading(false);
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      setUploading(false);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to pick image');
        console.error(error);
      }
    }
  };

  const takePhoto = async () => {
    setModalVisible(false);

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Sorry, we need camera permissions to make this work!',
      );
      return;
    }

    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.7,
        mediaType: 'photo',
      });

      // Upload the image to server
      setUploading(true);
      await dispatch(profileActions.profileImageUpdate(image));

      setImage(image.path);
      setUploading(false);
      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      setUploading(false);
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to take photo');
        console.error(error);
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

  const menuItems = [
    {
      id: 1,
      title: 'Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
      color: Colors.primaryBlue,
    },
    {
      id: 2,
      title: 'Nominee',
      icon: 'people-outline',
      onPress: () => navigation.navigate('Nominee'),
      color: '#FF6B6B',
    },
    {
      id: 3,
      title: 'KYC',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('KYC'),
      color: '#FFD93D',
    },
    {
      id: 4,
      title: 'My Referral',
      icon: 'list-outline',
      onPress: () => navigation.navigate('ReferralList'),
      color: '#6BCB77',
    },
    {
      id: 5,
      title: 'Referral Income',
      icon: 'wallet-outline',
      onPress: () => navigation.navigate('ReferralIncome'),
      color: '#9B5DE5',
    },
    {
      id: 6,
      title: 'Change Password',
      icon: 'lock-closed-outline',
      onPress: () => navigation.navigate('ChangePassword'),
      color: '#00BBF9',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.profileCard}>
            <View style={styles.imageContainer}>
              {uploading ? (
                <View style={styles.imageLoading}>
                  <ActivityIndicator size="large" color={Colors.primaryBlue} />
                </View>
              ) : (
                <Image
                  source={image ? { uri: image } : LOGO}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="camera" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {profile?.name || 'User Name'}
              </Text>
              <Text style={styles.userId}>
                ID: {profile?.username || 'N/A'}
              </Text>
              <Text style={styles.userPhone}>{profile?.phone || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={18} color={Colors.white} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.textLightGray}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          </View>
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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile Photo</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={takePhoto}
              activeOpacity={0.7}
            >
              <View style={styles.modalIcon}>
                <Ionicons name="camera" size={22} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <View style={styles.modalIcon}>
                <Ionicons name="image" size={22} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
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
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 16,
    backgroundColor: Colors.primaryBlue,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.primaryBlue,
  },
  imageLoading: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 3,
    borderColor: Colors.primaryBlue,
  },
  editImageButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: Colors.primaryBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  userId: {
    fontSize: 13,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textMediumGray,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textMediumGray,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  modalIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 15,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  modalCancel: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 15,
    fontFamily: GlobalFonts.textBold,
    color: Colors.error,
  },
});

export default AccountScreen;
