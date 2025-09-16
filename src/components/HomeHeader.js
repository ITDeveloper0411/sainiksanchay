import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { useSelector } from 'react-redux';
import { LOGO } from '../config/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: Colors.primaryBlue }}
    >
      <View style={styles.headerContainer}>
        {/* Custom Status Bar for Android 15+ */}
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.primaryBlue}
        />

        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => navigation.navigate('Account')}
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
                style={[
                  styles.profileImage,
                  imageLoading && styles.hiddenImage,
                ]}
                onError={handleImageError}
                onLoad={handleImageLoad}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {profile?.name || 'User Name'}
              </Text>
              <Text style={styles.userId}>
                SAM ID : {profile?.username || 'N/A'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.incomeContainer}
            onPress={() => navigation.navigate('ReferralIncome')}
          >
            <Ionicons name="wallet-outline" size={20} color={Colors.success} />
            <Text style={styles.incomeAmount}>
              {profile?.refAmount ? `₹${profile.refAmount}` : '₹0'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.primaryBlue,
  },
  header: {
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
