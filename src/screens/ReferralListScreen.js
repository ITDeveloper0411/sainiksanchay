// screens/ReferralListScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';

const ReferralListScreen = () => {
  // Sample team/referral list data
  const teamData = [
    {
      id: '1',
      name: 'John Doe',
      joinDate: '2023-10-15',
      level: 'Level 1',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      joinDate: '2023-10-14',
      level: 'Level 2',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      joinDate: '2023-10-13',
      level: 'Level 1',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      joinDate: '2023-10-12',
      level: 'Level 3',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Michael Brown',
      joinDate: '2023-10-11',
      level: 'Level 1',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Emily Davis',
      joinDate: '2023-10-10',
      level: 'Level 2',
      status: 'Inactive',
    },
  ];

  const activeMembers = teamData.filter(
    member => member.status === 'Active',
  ).length;
  const totalMembers = teamData.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Team</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMembers}</Text>
          <Text style={styles.statLabel}>Total Members</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{activeMembers}</Text>
          <Text style={styles.statLabel}>Active Members</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalMembers - activeMembers}</Text>
          <Text style={styles.statLabel}>Inactive Members</Text>
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        <Text style={styles.listTitle}>Team Members</Text>

        {teamData.map(member => (
          <View key={member.id} style={styles.memberItem}>
            <View style={styles.memberAvatar}>
              <Text style={styles.avatarText}>
                {member.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberDetails}>
                Joined: {member.joinDate} • {member.level}
              </Text>
            </View>

            <View
              style={[
                styles.statusIndicator,
                member.status === 'Active'
                  ? styles.statusActive
                  : styles.statusInactive,
              ]}
            >
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.inviteButton}>
        <Text style={styles.inviteButtonText}>Invite to Team</Text>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    color: Colors.primaryDark,
    fontFamily: GlobalFonts.textBold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
    textAlign: 'center',
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
  memberItem: {
    flexDirection: 'row',
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
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontFamily: GlobalFonts.textBold,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: Colors.textDark,
    fontFamily: GlobalFonts.textSemiBold,
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 12,
    color: Colors.textGray,
    fontFamily: GlobalFonts.textMedium,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: Colors.successLight,
  },
  statusInactive: {
    backgroundColor: Colors.warningLight,
  },
  statusText: {
    fontSize: 10,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
  },
  inviteButton: {
    backgroundColor: Colors.primaryBlue,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: GlobalFonts.textSemiBold,
  },
});

export default ReferralListScreen;
