// screens/RegistrationSuccessMessage.js
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../config/Colors';
import { GlobalFonts } from '../../config/GlobalFonts';
import { LOGO } from '../../config/Constant';
import CustomButton from '../../components/CustomButton';
import Ionicons from '@react-native-vector-icons/ionicons';

const RegistrationSuccessMessage = ({ navigation, route }) => {
  const { message } = route.params || {};

  const handleLoginRedirect = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
      />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={LOGO}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Sainik Sanchay</Text>
          </View>

          <View style={styles.content}>
            <Ionicons
              name="checkmark-circle"
              size={80}
              color={Colors.success}
            />

            <Text style={styles.successTitle}>Registration Successful!</Text>

            <Text style={styles.successMessage}>
              {message ||
                'Your payment has been received successfully. Your registration is now complete.'}
            </Text>

            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>What's Next?</Text>

              <View style={styles.detailItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.success}
                />
                <Text style={styles.detailText}>
                  Your payment is being verified by our team.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="call" size={20} color={Colors.primaryBlue} />
                <Text style={styles.detailText}>
                  Login details will be shared with you via a phone call after
                  verification.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons
                  name="phone-portrait"
                  size={20}
                  color={Colors.primaryBlue}
                />
                <Text style={styles.detailText}>
                  You can also download the 'Theek Hai' app from Play Store and
                  create an account using your registered number to receive
                  login details.
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color={Colors.warning} />
                <Text style={styles.detailText}>
                  Verification usually takes 24-48 hours.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton
                title="Continue to Login"
                onPress={handleLoginRedirect}
                variant="primary"
                size="large"
              />
            </View>

            <Text style={styles.contactText}>
              For any queries, please contact support@sainiksanchay.org
            </Text>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
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
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontFamily: GlobalFonts.textBold,
    color: Colors.success,
    marginBottom: 15,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textBold,
    color: Colors.primaryBlue,
    marginBottom: 15,
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textMediumGray,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RegistrationSuccessMessage;
