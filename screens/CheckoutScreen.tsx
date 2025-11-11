import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, FlatList, Alert } from 'react-native';
import { ScreenProps, MenuItem } from '../App';

// Defines the specific props this screen needs from the central state
// Define specific props for CheckoutScreen
type Props = { 
  // These are standard navigation props
  navigation: ScreenProps<'Checkout'>['navigation'];
  route: ScreenProps<'Checkout'>['route'];
  // These are the global state props that CheckoutScreen actually uses
  orderedItems: MenuItem[];
  setOrderedItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

// This screen shows the items the user has added to their order
export default function CheckoutScreen({ navigation, route, orderedItems, setOrderedItems }: Props) {
  // Calculates the total price of all items in the order.
  // useMemo ensures this only recalculates when the 'orderedItems' list changes.
  const totalAmount = useMemo(() => {
    return orderedItems.reduce((sum, item) => sum + item.price, 0);
  }, [orderedItems]);

  // Handles removing a single item from the order list
  const handleRemoveItem = (itemToRemove: MenuItem) => {
    // We only remove the first instance of the item found.
    const indexToRemove = orderedItems.findIndex(item => item.id === itemToRemove.id);
    if (indexToRemove > -1) {
      const newOrderedItems = [...orderedItems];
      newOrderedItems.splice(indexToRemove, 1);
      setOrderedItems(newOrderedItems);
      Alert.alert("Item Removed", `${itemToRemove.name} has been removed from your order.`);
    }
  };

  // Renders a single row for an item in the checkout list
  const renderOrderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemBox}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}>{item.name} - R{item.price.toFixed(0)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handles the logout action: clears the order and sends the user to the Login screen
  const handleLogout = () => {
     // Clear the central order state
    setOrderedItems([]);
    navigation.navigate('Login');
  };

  return (
    // Give a background image to the checkout screen
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logo} />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* FlatList is an efficient way to display a scrollable list of items */}
          <Text style={styles.listTitle}>List of all the items ordered</Text>
          <FlatList
            data={orderedItems}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>Your order is empty.</Text>}
            style={styles.list}
          />

          {/* Displays the calculated total amount */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total amount:</Text>
            <Text style={styles.totalValue}>R{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer buttons for navigation */}
        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu', {})}>
            <Text style={styles.footerButtonText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.footerButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1 
    },
  overlay: { 
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  list: {
    flexGrow: 0,
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    flex: 1, // Allow text to take up available space
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  menuButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#bd7d1cff', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#dc3545', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});