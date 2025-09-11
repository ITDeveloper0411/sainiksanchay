// components/MonthYearPicker.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { GlobalFonts } from '../config/GlobalFonts';
import { Colors } from '../config/Colors';

const MonthYearPicker = ({
  type,
  value,
  visible,
  onSelect,
  onClose,
  onOpen,
}) => {
  const months = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    id: currentYear - i,
    name: `${currentYear - i}`,
  }));

  const data = type === 'month' ? months : years;
  const selectedItem = data.find(item => item.id === value);
  const displayValue = selectedItem?.name;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.pickerItem, item.id === value && styles.selectedItem]}
      onPress={() => {
        onSelect(item.id);
        onClose();
      }}
    >
      <Text
        style={[
          styles.pickerItemText,
          item.id === value && styles.selectedItemText,
        ]}
      >
        {item.name}
      </Text>
      {item.id === value && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.customPicker} onPress={onOpen}>
        <Text style={styles.pickerText}>{displayValue}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
          <View style={styles.pickerContainer}>
            <FlatList
              data={data}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  customPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    backgroundColor: Colors.white,
  },
  pickerText: {
    flex: 1,
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    fontSize: 14,
  },
  dropdownIcon: {
    fontSize: 10,
    color: Colors.textGray,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    maxHeight: 300,
    width: 200,
    elevation: 5,
  },
  pickerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: Colors.lightBlue,
  },
  pickerItemText: {
    fontFamily: GlobalFonts.textMedium,
    color: Colors.textDark,
    textAlign: 'center',
  },
  selectedItemText: {
    color: Colors.primaryBlue,
    fontFamily: GlobalFonts.textSemiBold,
  },
  checkmark: {
    color: Colors.primaryBlue,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MonthYearPicker;
