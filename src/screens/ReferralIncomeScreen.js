// screens/ReferralIncomeScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { useDispatch, useSelector } from 'react-redux';
import * as referralActions from '../store/actions/referral';
import { ShowToast } from '../components/ShowToast';
import Loader from '../components/Loader';
import { Colors } from '../config/Colors';
import BackHeader from '../components/BackHeader';
import MonthYearPicker from '../components/MonthYearPicker';

const ReferralIncomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const { referralIncome } = useSelector(state => state.referral);

  const incomeData = referralIncome || {
    direct: { count: 0, amount: 0, current_count: 0, current_amount: 0 },
    level1: { count: 0, amount: 0, current_count: 0, current_amount: 0 },
    level2: { count: 0, amount: 0, current_count: 0, current_amount: 0 },
    level3: { count: 0, amount: 0, current_count: 0, current_amount: 0 },
    level4: { count: 0, amount: 0, current_count: 0, current_amount: 0 },
  };

  const getReferralList = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(
        referralActions.getReferralIncome(selectedMonth, selectedYear),
      );
    } catch (error) {
      ShowToast('Failed to fetch referral income');
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedMonth, selectedYear]);

  useEffect(() => {
    getReferralList();
  }, [getReferralList]);

  // Prepare table data
  const tableData = [
    {
      level: 'Direct',
      overallTeam: incomeData.direct.count,
      overallAmount: `₹${incomeData.direct.amount.toFixed(2)}`,
      currentTeam: incomeData.direct.current_count,
      currentAmount: `₹${incomeData.direct.current_amount.toFixed(2)}`,
    },
    {
      level: 'SHG-1',
      overallTeam: incomeData.level1.count,
      overallAmount: `₹${incomeData.level1.amount.toFixed(2)}`,
      currentTeam: incomeData.level1.current_count,
      currentAmount: `₹${incomeData.level1.current_amount.toFixed(2)}`,
    },
    {
      level: 'SHG-2',
      overallTeam: incomeData.level2.count,
      overallAmount: `₹${incomeData.level2.amount.toFixed(2)}`,
      currentTeam: incomeData.level2.current_count,
      currentAmount: `₹${incomeData.level2.current_amount.toFixed(2)}`,
    },
    {
      level: 'SHG-3',
      overallTeam: incomeData.level3.count,
      overallAmount: `₹${incomeData.level3.amount.toFixed(2)}`,
      currentTeam: incomeData.level3.current_count,
      currentAmount: `₹${incomeData.level3.current_amount.toFixed(2)}`,
    },
    {
      level: 'SHG-4',
      overallTeam: incomeData.level4.count,
      overallAmount: `₹${incomeData.level4.amount.toFixed(2)}`,
      currentTeam: incomeData.level4.current_count,
      currentAmount: `₹${incomeData.level4.current_amount.toFixed(2)}`,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <BackHeader
        title="Referral Income"
        onBackPress={() => navigation.goBack()}
        backgroundColor={Colors.primaryBlue}
      />

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Month:</Text>
          <MonthYearPicker
            type="month"
            value={selectedMonth}
            visible={showMonthPicker}
            onSelect={setSelectedMonth}
            onClose={() => setShowMonthPicker(false)}
            onOpen={() => setShowMonthPicker(true)}
          />
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Year:</Text>
          <MonthYearPicker
            type="year"
            value={selectedYear}
            visible={showYearPicker}
            onSelect={setSelectedYear}
            onClose={() => setShowYearPicker(false)}
            onOpen={() => setShowYearPicker(true)}
          />
        </View>
      </View>

      {/* Table Container */}
      <View style={styles.tableContainer}>
        <View style={styles.tableWrapper}>
          {/* Fixed Level Column */}
          <View style={styles.fixedColumn}>
            {/* Level Header - Merged cell spanning both header rows */}
            <View style={[styles.headerCell, styles.levelHeaderCell]}>
              <Text style={styles.headerText}>Level</Text>
            </View>

            {/* Level Rows */}
            {tableData.map((row, index) => (
              <View
                key={index}
                style={[
                  styles.bodyCell,
                  styles.levelCell,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={styles.levelText}>{row.level}</Text>
              </View>
            ))}
          </View>

          {/* Scrollable Content */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Main Headers - Overall and Current Month */}
              <View style={styles.scrollableHeader}>
                <View style={[styles.headerCell, styles.dataGroupHeader]}>
                  <Text style={styles.headerText}>Overall</Text>
                </View>
                <View style={[styles.headerCell, styles.dataGroupHeader]}>
                  <Text style={styles.headerText}>Current Month</Text>
                </View>
              </View>

              {/* Sub Headers */}
              <View style={styles.scrollableSubHeader}>
                {/* Overall Sub Headers */}
                <View style={[styles.subHeaderCell, styles.teamColumn]}>
                  <Text style={styles.subHeaderText}>Team</Text>
                </View>
                <View style={[styles.subHeaderCell, styles.amountColumn]}>
                  <Text style={styles.subHeaderText}>Amount</Text>
                </View>

                {/* Current Month Sub Headers */}
                <View style={[styles.subHeaderCell, styles.teamColumn]}>
                  <Text style={styles.subHeaderText}>Team</Text>
                </View>
                <View style={[styles.subHeaderCell, styles.amountColumn]}>
                  <Text style={styles.subHeaderText}>Amount</Text>
                </View>
              </View>

              {/* Table Rows */}
              <View style={styles.scrollableBody}>
                {tableData.map((row, index) => (
                  <View
                    key={index}
                    style={[
                      styles.scrollableRow,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    {/* Overall Data */}
                    <View style={[styles.bodyCell, styles.teamColumn]}>
                      <Text style={styles.bodyText}>{row.overallTeam}</Text>
                    </View>
                    <View style={[styles.bodyCell, styles.amountColumn]}>
                      <Text style={styles.bodyText}>{row.overallAmount}</Text>
                    </View>

                    {/* Current Month Data */}
                    <View style={[styles.bodyCell, styles.teamColumn]}>
                      <Text style={styles.bodyText}>{row.currentTeam}</Text>
                    </View>
                    <View style={[styles.bodyCell, styles.amountColumn]}>
                      <Text style={styles.bodyText}>{row.currentAmount}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const levelColumnWidth = 100;
const teamColumnWidth = 80;
const amountColumnWidth = 100;
const headerHeight = 50;
const subHeaderHeight = 40;
const rowHeight = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 8,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    fontSize: 14,
  },
  tableContainer: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  tableWrapper: {
    flexDirection: 'row',
  },
  fixedColumn: {
    zIndex: 10,
    elevation: 3,
  },
  levelHeaderCell: {
    width: levelColumnWidth,
    height: headerHeight + subHeaderHeight, // Combined height of main header + sub header
    justifyContent: 'center',
    backgroundColor: Colors.primaryBlue,
  },
  levelCell: {
    width: levelColumnWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: rowHeight,
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue,
  },
  headerText: {
    color: Colors.white,
    fontFamily: GlobalFonts.textSemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
  scrollableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
  },
  dataGroupHeader: {
    width: teamColumnWidth + amountColumnWidth,
    height: headerHeight,
  },
  scrollableSubHeader: {
    flexDirection: 'row',
  },
  subHeaderCell: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: subHeaderHeight,
    backgroundColor: Colors.lightBackground,
  },
  teamColumn: {
    width: teamColumnWidth,
  },
  amountColumn: {
    width: amountColumnWidth,
  },
  subHeaderText: {
    color: Colors.textDark,
    fontFamily: GlobalFonts.textMedium,
    fontSize: 12,
    textAlign: 'center',
  },
  scrollableBody: {
    // Empty style, just for structure
  },
  scrollableRow: {
    flexDirection: 'row',
  },
  bodyCell: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: rowHeight,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  evenRow: {
    backgroundColor: Colors.white,
  },
  oddRow: {
    backgroundColor: Colors.lightBackground,
  },
  levelText: {
    fontFamily: GlobalFonts.textSemiBold,
    color: Colors.textDark,
    fontSize: 14,
  },
  bodyText: {
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    fontSize: 14,
  },
});

export default ReferralIncomeScreen;
