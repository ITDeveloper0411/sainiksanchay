import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactScreen = ({ navigation }) => {
  const phoneNumber = '8800001249';
  const emailAddress = 'support@sainiksanchay.org';

  const handleCall = () => {
    Linking.openURL(`tel:${phoneNumber.replace(/[^0-9]/g, '')}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
        translucent={Platform.OS === 'android'}
      />

      {/* Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Contact Us</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Get in Touch</Text>
          <Text style={styles.headerSubtitle}>
            We'd love to hear from you. Here's how you can reach us.
          </Text>
        </View>

        {/* Contact Cards */}
        <View style={styles.cardsContainer}>
          {/* Phone Card */}
          <TouchableOpacity style={styles.card} onPress={handleCall}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: Colors.transparentBlue40 },
              ]}
            >
              <Ionicons name="call" size={28} color={Colors.primaryBlue} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Call Us</Text>
              <Text style={styles.cardValue}>{phoneNumber}</Text>
              <Text style={styles.cardDescription}>
                Available 9:30 AM - 6:30 PM
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Email Card */}
          <TouchableOpacity style={styles.card} onPress={handleEmail}>
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: Colors.featureGreen },
              ]}
            >
              <Ionicons name="mail" size={28} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Email Us</Text>
              <Text style={styles.cardValue}>{emailAddress}</Text>
              <Text style={styles.cardDescription}>
                We respond within 24 hours
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.white,
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    borderRadius: 20,
  },
  backButtonPlaceholder: {
    width: 32,
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    padding: 30,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: GlobalFonts.textBold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textLight,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  cardsContainer: {
    padding: 20,
    marginTop: -30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.primaryBlue,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    fontFamily: GlobalFonts.textLight,
    color: '#666',
  },
});

export default ContactScreen;
