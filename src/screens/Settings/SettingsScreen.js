import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { GlobalFonts } from '../../config/GlobalFonts';
import { Colors } from '../../config/Colors';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as profileActions from '../../store/actions/profile';
import { HEIGHT, LOGO } from '../../config/Constant';
import { ShowToast } from '../../components/ShowToast';

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const [image, setImage] = useState(profile?.profile_img || null);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const uploadProfileImage = async imageData => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('profile_img', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.fileName || `profile_${Date.now()}.jpg`,
      });

      const result = await dispatch(
        profileActions.profileImageUpdate(formData),
      );
      await dispatch(profileActions.getProfile());

      if (result && result.success) {
        setImage(imageData.uri);
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
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 400,
        maxHeight: 400,
        includeBase64: false,
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.error('ImagePicker Error: ', response.error);
          Alert.alert('Error', 'Failed to pick image');
        } else if (response.assets && response.assets.length > 0) {
          const imageData = response.assets[0];
          uploadProfileImage(imageData);
        }
      });
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel', onPress: () => setLoggingOut(false) },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await dispatch(authActions.logout());
          } catch (error) {
            console.error('Logout error:', error);
            ShowToast('Failed to logout. Please try again.');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

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
      />

      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingBottom: insets.bottom + 100 },
          ]}
        >
          {/* --- Profile Header --- */}
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
                  onPress={pickImage}
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

          {/* --- KYC Banner --- */}
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

          {/* --- Menu Items --- */}
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

          {/* --- Support --- */}
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

          {/* --- Logout --- */}
          <TouchableOpacity
            style={[styles.logoutButton, loggingOut && { opacity: 0.6 }]}
            onPress={handleLogout}
            activeOpacity={0.7}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            )}
            <Text style={styles.logoutText}>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, backgroundColor: Colors.lightBackground },
  scrollView: { flex: 1 },
  scrollContentContainer: { minHeight: HEIGHT },
  profileHeader: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.primaryBlue,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  imageContainer: { position: 'relative', marginRight: 20 },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  imageLoading: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 6,
  },
  userId: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textGray,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textGray,
  },
  kycBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kycBannerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  kycIcon: { marginRight: 12 },
  kycTextContainer: { flex: 1 },
  kycStatusText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textSemiBold,
    marginBottom: 4,
  },
  kycMessageText: {
    fontSize: 14,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textGray,
  },
  kycActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  kycActionText: { fontSize: 14, fontFamily: GlobalFonts.textMedium },
  sectionTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
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
  supportContent: { flex: 1 },
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
  },
  logoutText: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.error,
    marginLeft: 10,
  },
});

export default SettingsScreen;
