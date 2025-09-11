// components/BackHeader.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const BackHeader = ({
  title,
  showBackButton = true,
  onBackPress,
  rightComponent,
  backgroundColor = Colors.primaryBlue,
  titleColor = Colors.white,
  backIconColor = Colors.white,
}) => {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor }}>
      <View style={[styles.header, { backgroundColor }]}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={backIconColor} />
            </TouchableOpacity>
          )}

          <View style={styles.headerTextContainer}>
            <Text
              style={[styles.headerTitle, { color: titleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
        </View>

        {rightComponent && (
          <View style={styles.headerRight}>{rightComponent}</View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    borderRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: GlobalFonts.textBold,
    marginBottom: 2,
  },
  headerRight: {
    marginLeft: 16,
  },
  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default BackHeader;
