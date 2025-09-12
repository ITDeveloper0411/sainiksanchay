import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { useSelector } from 'react-redux';
import { LOGO } from '../config/Constant'; // Assuming you have a default logo

const HomeHeader = ({ navigation }) => {
  const { profile } = useSelector(state => state.profile);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          {imageLoading && (
            <ActivityIndicator
              style={styles.loader}
              color={Colors.white}
              size="small"
            />
          )}
          <Image
            source={
              imageError || !profile?.profile_img
                ? LOGO
                : { uri: profile.profile_img }
            }
            style={[styles.profileImage, imageLoading && styles.hiddenImage]}
            onError={handleImageError}
            onLoad={handleImageLoad}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
            {profile?.name || 'User Name'}
          </Text>
          <Text style={styles.userId}>
            SAM ID : {profile?.username || 'N/A'}
          </Text>
        </View>
      </View>
      <View style={styles.incomeContainer}>
        <Ionicons name="wallet-outline" size={20} color={Colors.success} />
        <Text style={styles.incomeAmount}>
          {profile?.refAmount ? `₹${profile.refAmount}` : '₹0'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primaryBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.lightBackground,
  },
  hiddenImage: {
    opacity: 0,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.white,
    marginBottom: 2,
    maxWidth: '100%',
  },
  userId: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.lightBlue,
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  incomeAmount: {
    fontSize: 14,
    fontFamily: GlobalFonts.textBold,
    color: Colors.white,
    marginLeft: 6,
  },
});

export default HomeHeader;
