import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { useTabBarVisibility } from '../navigation/BottomTabNavigator';
import HomeHeader from '../components/HomeHeader';
import { useDispatch, useSelector } from 'react-redux';
import * as dashboardActions from '../store/actions/dashboard';
import Loader from '../components/Loader';

export default function HomeScreen({ navigation }) {
  const { totalReferral, totalAmount } = useSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { showTabBar } = useTabBarVisibility();

  useEffect(() => {
    showTabBar();
  }, [showTabBar]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(dashboardActions.getDashboard());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
      />

      {/* Header Section */}
      <HomeHeader navigation={navigation} />

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryBlue]}
            tintColor={Colors.primaryBlue}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Referrals Card */}
          <TouchableOpacity
            style={[styles.statCard, styles.referralCard]}
            onPress={() => navigation.navigate('ReferralList')}
          >
            <View style={styles.statIconContainer}>
              <Ionicons
                name="people-outline"
                size={28}
                color={Colors.primaryBlue}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Referrals</Text>
              <Text style={styles.statValue}>
                {totalReferral !== undefined ? totalReferral : '0'}
              </Text>
              <Text style={styles.statSubtext}>Active Members</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textMediumGray}
            />
          </TouchableOpacity>

          {/* Total Income Card */}
          <TouchableOpacity
            style={[styles.statCard, styles.incomeCard]}
            onPress={() => navigation.navigate('ReferralIncome')}
          >
            <View style={styles.statIconContainer}>
              <Ionicons
                name="wallet-outline"
                size={28}
                color={Colors.success}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Total Income</Text>
              <Text style={styles.statValue}>
                {totalAmount !== undefined ? `₹${totalAmount}` : '₹0'}
              </Text>
              <Text style={styles.statSubtext}>Lifetime Earnings</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textMediumGray}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  statsContainer: {
    flex: 1,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  referralCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primaryBlue,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textMediumGray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: GlobalFonts.textBold,
    color: Colors.textDark,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    fontFamily: GlobalFonts.textLight,
    color: Colors.textLightGray,
  },
});
