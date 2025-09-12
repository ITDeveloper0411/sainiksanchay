// components/SearchableDropdown.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../config/Colors';
import Ionicons from '@react-native-vector-icons/ionicons';

const SearchableDropdown = ({
  data = [],
  placeholder,
  value,
  onSelect,
  searchPlaceholder = 'Search...',
  style,
  disabled = false,
  error = null,
  loading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleSelect = item => {
    onSelect(item);
    setSearchText('');
    setIsVisible(false);
    Keyboard.dismiss();
  };

  const handleToggle = () => {
    if (disabled || loading) return;

    setIsVisible(!isVisible);
    if (!isVisible) {
      setSearchText('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const selectedItem = data.find(item => {
    return item.value?.toString() === value?.toString();
  });

  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={Colors.primaryBlue} />
          <Text style={styles.emptyText}>Loading data...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={24}
          color={Colors.textMediumGray}
        />
        <Text style={styles.emptyText}>No options found</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.dropdownTrigger,
          (disabled || loading) && styles.disabledTrigger,
          error && styles.errorTrigger,
        ]}
        disabled={disabled || loading}
      >
        <View style={styles.selectedTextContainer}>
          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primaryBlue}
              style={styles.loader}
            />
          )}
          <Text
            style={[
              styles.selectedText,
              !selectedItem && styles.placeholderText,
              (disabled || loading) && styles.disabledText,
            ]}
            numberOfLines={1}
          >
            {loading
              ? 'Loading...'
              : selectedItem
              ? selectedItem.label
              : placeholder}
          </Text>
        </View>
        {loading ? (
          <View style={styles.iconPlaceholder} />
        ) : (
          <Ionicons
            name={isVisible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={disabled ? Colors.textMediumGray : Colors.textDark}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={20}
                color={Colors.textMediumGray}
                style={styles.searchIcon}
              />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={Colors.textMediumGray}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.textMediumGray}
                  />
                </TouchableOpacity>
              )}
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primaryBlue} />
                <Text style={styles.loadingText}>Loading options...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.listItemText}>{item.label}</Text>
                    {value === item.value && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={Colors.primaryBlue}
                      />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={renderEmptyList}
                style={styles.list}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    padding: 15,
    backgroundColor: Colors.white,
    minHeight: 55,
  },
  disabledTrigger: {
    backgroundColor: Colors.lightBackground,
  },
  errorTrigger: {
    borderColor: Colors.error,
  },
  selectedTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    marginRight: 8,
  },
  selectedText: {
    fontSize: 16,
    color: Colors.textDark,
    flex: 1,
  },
  placeholderText: {
    color: Colors.textMediumGray,
  },
  disabledText: {
    color: Colors.textMediumGray,
  },
  iconPlaceholder: {
    width: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    padding: 0,
  },
  list: {
    maxHeight: 400,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  listItemText: {
    fontSize: 16,
    color: Colors.textDark,
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyText: {
    marginLeft: 10,
    color: Colors.textMediumGray,
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 10,
    color: Colors.textMediumGray,
    fontSize: 16,
  },
});

export default SearchableDropdown;
