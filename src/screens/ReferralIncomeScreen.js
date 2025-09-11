// screens/ReferralIncomeScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import { useTabBarVisibility } from '../navigation/BottomTabNavigator';

const ReferralIncomeScreen = () => {
  const { showTabBar } = useTabBarVisibility();

  useEffect(() => {
    showTabBar();
  }, [showTabBar]);

  // Sample referral income data
  const referralData = [
    {
      id: '1',
      name: 'John Doe',
      date: '2023-10-15',
      amount: '₹500',
      status: 'Completed',
    },
    {
      id: '2',
      name: 'Jane Smith',
      date: '2023-10-14',
      amount: '₹300',
      status: 'Pending',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      date: '2023-10-13',
      amount: '₹700',
      status: 'Completed',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      date: '2023-10-12',
      amount: '₹200',
      status: 'Completed',
    },
    {
      id: '5',
      name: 'Michael Brown',
      date: '2023-10-11',
      amount: '₹400',
      status: 'Pending',
    },
  ];

  const totalEarnings = referralData
    .filter(item => item.status === 'Completed')
    .reduce((sum, item) => sum + parseInt(item.amount.replace('₹', '')), 0);

  const pendingEarnings = referralData
    .filter(item => item.status === 'Pending')
    .reduce((sum, item) => sum + parseInt(item.amount.replace('₹', '')), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Referral Income</Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryAmount}>₹{totalEarnings}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending Earnings</Text>
          <Text style={styles.summaryAmount}>₹{pendingEarnings}</Text>
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        <Text style={styles.listTitle}>Recent Referrals</Text>

        {referralData.map(item => (
          <View key={item.id} style={styles.referralItem}>
            <View style={styles.referralInfo}>
              <Text style={styles.referralName}>{item.name}</Text>
              <Text style={styles.referralDate}>{item.date}</Text>
            </View>

            <View style={styles.referralAmountContainer}>
              <Text style={styles.referralAmount}>{item.amount}</Text>
              <Text
                style={[
                  styles.statusBadge,
                  item.status === 'Completed'
                    ? styles.statusCompleted
                    : styles.statusPending,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share Referral Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  header: {
    backgroundColor: Colors.primaryBlue,
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontFamily: GlobalFonts.textBold,
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 20,
    color: Colors.primaryDark,
    fontFamily: GlobalFonts.textBold,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textBold,
    marginBottom: 16,
  },
  referralItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textSemiBold,
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
  },
  referralAmountContainer: {
    alignItems: 'flex-end',
  },
  referralAmount: {
    fontSize: 16,
    color: Colors.primaryDark,
    fontFamily: GlobalFonts.textBold,
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: Colors.success,
    color: Colors.success,
  },
  statusPending: {
    backgroundColor: Colors.warning,
    color: Colors.warning,
  },
  shareButton: {
    backgroundColor: Colors.primaryBlue,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: GlobalFonts.textSemiBold,
  },
});

export default ReferralIncomeScreen;
