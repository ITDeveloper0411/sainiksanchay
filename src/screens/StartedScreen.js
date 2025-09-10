import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { LOGO, WIDTH } from '../config/Constant';
import { Colors } from '../config/Colors';

import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';

const StartedScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const featuresData = {
    savings: [
      {
        id: '1',
        icon: '💰',
        bgColor: Colors.featureBlue,
        title: 'Start Small',
        desc: 'From just ₹100/month',
      },
      {
        id: '2',
        icon: '📈',
        bgColor: Colors.featureGreen,
        title: 'High Returns',
        desc: 'Up to 8% interest',
      },
      {
        id: '3',
        icon: '🛡️',
        bgColor: Colors.featureRed,
        title: 'Insurance',
        desc: 'Free term coverage',
      },
      {
        id: '4',
        icon: '🔒',
        bgColor: Colors.featurePurple,
        title: 'Secure',
        desc: 'RBI compliant',
      },
    ],
    loans: [
      {
        id: '1',
        icon: '⚡',
        bgColor: Colors.featureYellow,
        title: 'Quick Access',
        desc: 'Borrow instantly',
      },
      {
        id: '2',
        icon: '📝',
        bgColor: Colors.featureLightGreen,
        title: 'No CIBIL',
        desc: '0% impact on score',
      },
      {
        id: '3',
        icon: '💳',
        bgColor: Colors.featurePink,
        title: 'High Value',
        desc: 'Up to 75% of savings',
      },
      {
        id: '4',
        icon: '🔄',
        bgColor: Colors.featureTeal,
        title: 'Flexible',
        desc: 'Multiple purposes',
      },
    ],
    msme: [
      {
        id: '1',
        icon: '🏪',
        bgColor: Colors.featureOrange,
        title: 'MSME Support',
        desc: 'Local businesses',
      },
      {
        id: '2',
        icon: '⏱️',
        bgColor: Colors.featureIndigo,
        title: 'Interest-Free',
        desc: '10-day credit',
      },
      {
        id: '3',
        icon: '🇮🇳',
        bgColor: Colors.featureLightPink,
        title: 'Indian MSME',
        desc: 'Support local',
      },
      {
        id: '4',
        icon: '🤝',
        bgColor: Colors.featureMint,
        title: 'Community',
        desc: 'Growth together',
      },
    ],
  };

  const infoData = [
    {
      id: '1',
      type: 'savings',
      title: 'Flexible Savings Plans',
      text: 'Choose from multiple savings options starting at just ₹100 per month. Our premium plans offer higher returns and additional benefits.',
      features: featuresData.savings,
      color: Colors.primary,
    },
    {
      id: '2',
      type: 'loans',
      title: 'Instant Loan Facilities',
      text: 'Access loans against your savings without any CIBIL check. Get approvals within hours for urgent financial needs.',
      features: featuresData.loans,
      color: Colors.primaryLight,
    },
    {
      id: '3',
      type: 'msme',
      title: 'SUCY Credit Scheme',
      text: 'Support Indian micro-enterprises with 10-day interest-free credit for purchases on IndianMSME.org using your savings.',
      features: featuresData.msme,
      color: '#2d3748',
    },
  ];

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderFeatureItem = ({ item }) => (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: item.bgColor }]}>
        <Text style={styles.featureEmoji}>{item.icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{item.title}</Text>
      <Text style={styles.featureDesc}>{item.desc}</Text>
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.page, { width: WIDTH }]}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{item.title}</Text>
          <Text style={styles.infoText}>{item.text}</Text>
        </View>

        <FlatList
          data={item.features}
          renderItem={renderFeatureItem}
          keyExtractor={feature => feature.id}
          numColumns={2}
          columnWrapperStyle={styles.featuresRow}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const scrollToIndex = index => {
    animateButton();
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ animated: true, index });
  };

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / WIDTH);
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primaryDark}
      />

      {/* Premium Header Design */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Elements */}
        <View style={styles.headerPattern} />
        <View style={styles.cornerAccentTopLeft} />
        <View style={styles.cornerAccentTopRight} />

        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            <View style={styles.logoGlow} />
          </View>

          <View style={styles.headerTextContainer}>
            <View style={styles.headerBadge}>
              <Ionicons name="ribbon" size={14} color={Colors.white} />
              <Text style={styles.headerBadgeText}>Service First</Text>
            </View>
            <Text style={styles.headerTitle}>Sainik Sanchay</Text>
            <Text style={styles.headerSubtitle}>Banking for Our Heroes</Text>

            <View style={styles.headerDivider}>
              <View style={styles.dividerLine} />
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={Colors.accentBlue}
              />
              <View style={styles.dividerLine} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content with Horizontal Scroll */}
      <View style={styles.flatListContainer}>
        <FlatList
          ref={flatListRef}
          data={infoData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.flatListContent}
          getItemLayout={(data, index) => ({
            length: WIDTH,
            offset: WIDTH * index,
            index,
          })}
        />

        {/* New Indicator Design */}
        <View style={styles.indicatorContainer}>
          {infoData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={styles.indicatorButton}
            >
              <View
                style={[
                  styles.indicatorLine,
                  {
                    backgroundColor:
                      index === activeIndex
                        ? Colors.indicatorActive
                        : Colors.indicatorInactive,
                    width: index === activeIndex ? 30 : 20,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Get Started Button - Only show on the last screen */}
      {activeIndex === infoData.length - 1 && (
        <Animated.View
          style={[
            styles.getStartedContainer,
            { transform: [{ scale: buttonScale }] },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => {
              // Handle get started actions
              navigation.navigate('Login');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={22} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.05,
  },
  cornerAccentTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 60,
    borderTopWidth: 60,
    borderRightColor: 'transparent',
    borderTopColor: Colors.transparentBlue10,
  },
  cornerAccentTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderTopWidth: 60,
    borderLeftColor: 'transparent',
    borderTopColor: Colors.transparentBlue10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  logo: {
    width: 70,
    height: 70,
    zIndex: 2,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    borderRadius: 100,
    backgroundColor: Colors.transparentBlue40,
    zIndex: 1,
  },
  headerTextContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: GlobalFonts.textBoldItalic,
    color: Colors.white,
    marginBottom: 5,
    textShadowColor: Colors.transparentBlack30,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: GlobalFonts.textMediumItalic,
    color: Colors.accentBlue,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  headerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    height: 1,
    width: 40,
    backgroundColor: Colors.transparentBlue40,
    marginHorizontal: 8,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.transparentOrange90,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.white,
    marginLeft: 4,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  flatListContent: {
    flexGrow: 1,
  },
  page: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoTitle: {
    fontSize: 22,
    fontFamily: GlobalFonts.textSemiBoldItalic,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: GlobalFonts.textLightItalic,
    color: Colors.textGray,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 10,
  },
  featuresRow: {
    justifyContent: 'space-between',
  },
  featureItem: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    margin: 5,
    width: WIDTH / 2 - 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBoldItalic,
    color: Colors.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    fontFamily: GlobalFonts.textLightItalic,
    color: Colors.textGray,
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicatorButton: {
    padding: 5,
  },
  indicatorLine: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  getStartedContainer: {
    paddingHorizontal: 40,
    paddingBottom: 30,
    paddingTop: 10,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: GlobalFonts.textBoldItalic,
    color: Colors.white,
    marginRight: 10,
  },
});

export default StartedScreen;
