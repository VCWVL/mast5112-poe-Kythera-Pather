import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, Alert, ScrollView, SectionList } from 'react-native';
import { ScreenProps, MenuItem, Course, DrinkItem } from '../App';
import { useMenuStats } from './useMenuStats';

type Props = ScreenProps<'Menu'>;

// Predefined list of courses for consistent ordering
const predefinedCourses: Course[] = [
  'Specials',
  'Starter',
  'Main Course',
  'Dessert',
  'Drinks',
];

// This is the main screen for displaying the restaurant menu
export default function MenuScreen({ navigation, route, menuItems, setMenuItems, drinksData, setDrinksData, orderedItems, setOrderedItems }: Props) {
  // Check if the logged-in user is an admin
  const isAdmin = route.params?.isAdmin;
  // Use the custom hook to get menu statistics like average prices
  const { totalItemCount, getAveragePrice, getAverageDrinkPrice } = useMenuStats(menuItems, drinksData);

  // Groups the flat list of menu items into an object with courses as keys
  const groupedMenu = menuItems.reduce((acc, item) => {
    (acc[item.course] = acc[item.course] || []).push(item);
    return acc;
  }, {} as Record<Course, MenuItem[]>);

  // Format the data for the SectionList
  const menuSections = predefinedCourses
    .filter(course => course !== 'Drinks' && groupedMenu[course]?.length > 0)
    .map(course => ({
      title: course,
      data: groupedMenu[course],
    }));

  // Renders a single card for a food item
  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
    // Use the uploaded image URI if it exists, otherwise use the require() path
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    // Handle adding items to the checkout
    const handleAddToCheckout = () => {
      setOrderedItems(prevItems => [...prevItems, item]);
      Alert.alert("Item Added", `${item.name} has been added to your order.`);
    };

    return (
      // Menu item card component for displaying individual menu items which is Food or drink items 
      <View style={styles.menuItemCard}>
        <Image source={imageSource || require('../assets/Logo.jpg')} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>
            {item.name} - R{item.price.toFixed(0)}
          </Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleAddToCheckout}>
            <Text style={styles.checkoutButtonText}>Add to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // A component that renders the top part of the screen, including stats and navigation
  const ListHeader = () => {
    return (
      <>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logoPlaceholder} />
          <Text style={styles.headerTitle}>The Menu</Text>
          <View style={styles.headerNavContainer}>

            {/* Navigation buttons */}
            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('FilterByCourse', { currentMenuItems: menuItems, currentDrinksData: drinksData })}>
              <Text style={styles.headerNavText}>Filter by course</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.headerNavText}>Checkout ({orderedItems.length})</Text>
            </TouchableOpacity>
            {/* This button only shows if the user is an admin */}
            {isAdmin && (
              <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('ManageMenu', { currentMenuItems: menuItems, currentDrinksData: drinksData })}>
                <Text style={styles.headerNavText}>Remove Items</Text>
              </TouchableOpacity>
            )}

          </View>
        </View>
        {/* The container for the statistics boxes */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total number of menu items</Text>
            <Text style={styles.statValue}>{totalItemCount} Items</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Average price of each course</Text>
            {predefinedCourses.filter(c => c !== 'Drinks').map(course => {
              const avg = getAveragePrice(course);
              if (avg > 0) { return <Text key={course} style={styles.statValueSmall}>{course}: R{avg.toFixed(0)}</Text>; }
              return null;
            })}
            <Text key="hot-drinks-avg" style={styles.statValueSmall}>Hot Drinks: R{getAverageDrinkPrice('Hot drinks').toFixed(0)}</Text>
            <Text key="cold-drinks-avg" style={styles.statValueSmall}>Cold Drinks: R{getAverageDrinkPrice('Cold drinks').toFixed(0)}</Text>
          </View>
        </View>
      </>
    );
  };

  // Function to handle adding drink items to the checkout
  const handleAddDrinkToCheckout = (drink: DrinkItem) => {
    const newDrinkItem: MenuItem = {
      // Unique ID for the ordered item
      id: `drink_${drink.name}_${Date.now()}`, 
      name: drink.name,
      description: 'A refreshing beverage',
      course: 'Drinks',
      price: drink.price, 
      image: null,
    };
    setOrderedItems(prevItems => [...prevItems, newDrinkItem]);
    Alert.alert("Item Added", `${drink.name} has been added to your order.`);
  };

  // Renders the list of hot and cold drinks
  const renderDrinksSection = () => (
    <View>
      <Text style={styles.courseHeader}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <Text style={styles.drinksSubHeader}>Cold drinks</Text>
        {drinksData['Cold drinks'].map((drink, index) => (
          <View key={`cold-${index}`} style={styles.drinkItem}>
            <Text style={styles.drinkText}>{drink.name} - R{drink.price}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => handleAddDrinkToCheckout(drink)}>
              <Text style={styles.checkoutButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <Text style={[styles.drinksSubHeader, { marginTop: 15 }]}>Hot drinks</Text>
        {drinksData['Hot drinks'].map((drink, index) => (
          <View key={`hot-${index}`} style={styles.drinkItem}>
            <Text style={styles.drinkText}>{drink.name} - R{drink.price}</Text>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => handleAddDrinkToCheckout(drink)}>
              <Text style={styles.checkoutButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    // The main container with a background image
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.ImageBackground} resizeMode="stretch">
      <SafeAreaView style={styles.overlay}>
        {/* SectionList is used to display the menu items grouped by course */}
        <SectionList
            sections={menuSections}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItemCard}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.courseHeader}>{title}</Text>
            )}
            // Combine the ListHeader and Drinks section in the header
            ListHeaderComponent={<><ListHeader />{renderDrinksSection()}</>}
            contentContainerStyle={styles.scrollViewContent}
          />
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,    
  },
  overlay: {
    // This ensures the safe area fills the background
    flex: 1, 
    // Semi-transparent white background
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
  },
  scrollViewContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  ImageBackground: {
    flex: 1, // Use flex: 1 to ensure it fills the screen
    width: '100%',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginBottom: 10 
  },
  logoPlaceholder: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  headerNavContainer: {  
    justifyContent: 'flex-end', 
    alignItems: 'flex-end' 
  },
  headerNavButton: { 
    backgroundColor: '#2e2b2bff', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderWidth: 1, 
    borderColor: '#fcf9f9ff', 
    borderRadius: 3, 
    marginBottom: 2 
  },
  headerNavText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#e9e5e5ff' 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  statTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 4 
  },
  statValue: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333', 
    lineHeight: 18 
  },
  statValueSmall: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#333', 
    lineHeight: 16 
  },
  courseHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    textDecorationLine: 'underline',
    color: '#333',
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80, 
    borderRadius: 40,
    marginRight: 12,
    borderColor: '#333',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  drinksContainer: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  drinksSubHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  drinkItem: { 
    marginBottom: 5, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drinkText: { 
    fontSize: 13,
    flex: 1,
  },
});
