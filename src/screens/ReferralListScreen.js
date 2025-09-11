// screens/ReferralListScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import * as referralActions from '../store/actions/referral';
import { useDispatch, useSelector } from 'react-redux';
import { ShowToast } from '../components/ShowToast';
import Icon from '@react-native-vector-icons/material-icons';
import BackHeader from '../components/BackHeader';
import { ANDROID_PACKAGE_NAME } from '../config/Constant';
import Loader from '../components/Loader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ReferralListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const { profile } = useSelector(state => state.profile);
  const {
    referralList,
    totalMember,
    totalPendingMember,
    totalActiveMember,
    totalRejectedMember,
  } = useSelector(state => state.referral);

  const getReferralList = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(referralActions.getReferralList());
    } catch (error) {
      ShowToast('Failed to fetch referral list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getReferralList();
  }, [getReferralList]);

  useEffect(() => {
    getReferralList();
  }, [getReferralList]);

  const shareReferralCode = async () => {
    try {
      const appLink = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;
      const referralMessage = `🌟 Join me on Sainik Sanchay! 🌟

Use my referral (SAM) code: ${profile?.username || 'N/A'}

Download the app now: ${appLink}

Let's grow together! 💪

#SainikSanchay #Referral`;

      const shareOptions = {
        message: referralMessage,
        title: 'Join Sainik Sanchay - Refer a Friend',
      };

      await Share.share(shareOptions);
    } catch (error) {
      ShowToast('Error sharing referral code');
    }
  };

  const getStatusStyle = status => {
    switch (status) {
      case 'APPROVED':
        return [styles.statusIndicator, styles.statusApproved];
      case 'PENDING':
        return [styles.statusIndicator, styles.statusPending];
      case 'REJECTED':
        return [styles.statusIndicator, styles.statusRejected];
      default:
        return [styles.statusIndicator, styles.statusPending];
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'PENDING':
        return 'Pending';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  // Updated Stat Card with equal width
  const StatCard = ({ icon, number, label, color }) => (
    <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
      <View style={styles.statTop}>
        <Icon name={icon} size={16} color={color} />
        <Text style={[styles.statNumber, { color }]}>{number || 0}</Text>
      </View>
      <Text style={[styles.statLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <BackHeader
        title="My Referral"
        onBackPress={() => navigation.goBack()}
        backgroundColor={Colors.primaryBlue}
        rightComponent={
          <TouchableOpacity
            onPress={() => setShowStats(!showStats)}
            style={styles.toggleButton}
          >
            <Icon
              name={showStats ? 'visibility' : 'visibility-off'}
              size={22}
              color={Colors.white}
            />
          </TouchableOpacity>
        }
      />

      {/* Statistics Section - Fixed to single row with equal width */}
      {showStats && (
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <StatCard
              icon="people"
              number={totalMember || 0}
              label="Total"
              color={Colors.primaryBlue}
            />
            <StatCard
              icon="check-circle"
              number={totalActiveMember || 0}
              label="Active"
              color={Colors.success}
            />
            <StatCard
              icon="schedule"
              number={totalPendingMember || 0}
              label="Pending"
              color={Colors.warning}
            />
            <StatCard
              icon="cancel"
              number={totalRejectedMember || 0}
              label="Rejected"
              color={Colors.error}
            />
          </View>
        </View>
      )}

      {/* Header with count and invite button */}
      <View style={styles.listHeaderContainer}>
        <View>
          <Text style={styles.listTitle}>Team Members</Text>
          <Text style={styles.listSubtitle}>
            {referralList?.length || 0} members found
          </Text>
        </View>
        <TouchableOpacity
          style={styles.inviteButtonSmall}
          onPress={shareReferralCode}
        >
          <Icon name="share" size={18} color={Colors.primaryBlue} />
          <Text style={styles.inviteButtonSmallText}>Invite</Text>
        </TouchableOpacity>
      </View>

      {/* Members List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primaryBlue]}
            tintColor={Colors.primaryBlue}
          />
        }
      >
        {referralList?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={60} color={Colors.textGray} />
            <Text style={styles.emptyText}>No team members yet</Text>
            <Text style={styles.emptySubtext}>
              Start inviting people to build your team
            </Text>
            <TouchableOpacity
              style={styles.emptyInviteButton}
              onPress={shareReferralCode}
            >
              <Icon name="share" size={20} color={Colors.white} />
              <Text style={styles.emptyInviteButtonText}>Invite Friends</Text>
            </TouchableOpacity>
          </View>
        ) : (
          referralList?.map((member, index) => (
            <View key={member.id || index} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.avatarText}>
                    {member.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.memberBasicInfo}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {member.name || 'N/A'}
                  </Text>
                  <Text style={styles.memberUsername}>
                    @{member.username || 'N/A'}
                  </Text>
                </View>
                <View style={getStatusStyle(member.payment_status)}>
                  <Text style={styles.statusText}>
                    {getStatusText(member.payment_status)}
                  </Text>
                </View>
              </View>

              <View style={styles.memberDetails}>
                <View style={styles.detailRow}>
                  <Icon name="phone" size={14} color={Colors.textLight} />
                  <Text style={styles.detailText}>
                    {member.mobile || 'N/A'}
                  </Text>
                </View>

                {member.emailid ? (
                  <View style={styles.detailRow}>
                    <Icon name="email" size={14} color={Colors.textLight} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {member.emailid}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.detailRow}>
                  <Icon name="location-on" size={14} color={Colors.textLight} />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {[member.district, member.state]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
  },
  toggleButton: {
    padding: 5,
  },
  statsSection: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  statCard: {
    width: (SCREEN_WIDTH - 32 - 30) / 4, // Equal width with spacing
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: GlobalFonts.textBold,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: GlobalFonts.textMedium,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  listTitle: {
    fontSize: 18,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textBold,
  },
  listSubtitle: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
  },
  inviteButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  inviteButtonSmallText: {
    color: Colors.primaryBlue,
    fontSize: 12,
    fontFamily: GlobalFonts.textSemiBold,
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textSemiBold,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyInviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  emptyInviteButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: GlobalFonts.textSemiBold,
  },
  memberCard: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
  },
  memberBasicInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textSemiBold,
    marginBottom: 2,
  },
  memberUsername: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusApproved: {
    backgroundColor: Colors.success + '20',
  },
  statusPending: {
    backgroundColor: Colors.warning + '20',
  },
  statusRejected: {
    backgroundColor: Colors.error + '20',
  },
  statusText: {
    fontSize: 11,
    fontFamily: GlobalFonts.textMedium,
  },
  memberDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textMedium,
    marginLeft: 8,
    flex: 1,
  },
});

export default ReferralListScreen;
