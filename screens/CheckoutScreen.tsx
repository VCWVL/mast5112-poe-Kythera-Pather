import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, FlatList } from 'react-native';
import { ScreenProps, MenuItem } from '../App';

type Props = ScreenProps<'Checkout'>;

export default function CheckoutScreen({ navigation, route }: Props) {
  // Assume orderedItems are passed via route params. Default to empty array if not provided.
  const { orderedItems = [] } = route.params || {};

  // Calculate total amount of ordered items 
  const totalAmount = useMemo(() => {
    return orderedItems.reduce((sum, item) => sum + item.price, 0);
  }, [orderedItems]);

  // Render each ordered item 
  const renderOrderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemBox}>
      <Text style={styles.itemText}>{item.name} - R{item.price.toFixed(0)}</Text>
    </View>
  );

  return (
    // Give a background image to the checkout screen
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logo} />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.listTitle}>List of all the items ordered</Text>
          <FlatList
            data={orderedItems}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>Your order is empty.</Text>}
            style={styles.list}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total amount:</Text>
            <Text style={styles.totalValue}>R{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Menu', {})}>
            <Text style={styles.footerButtonText}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
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
  itemText: {
    fontSize: 16,
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
    // A distinct color for logout
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
});