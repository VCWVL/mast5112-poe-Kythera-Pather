import React, { useState, useCallback, useMemo } from "react";
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ImageBackground, SectionList,
} from "react-native";
import { ScreenProps, Course, MenuItem, DrinksData, DrinkItem } from "../App";
import { useMenuStats } from "./useMenuStats";
import AddItemForm from './AddItemForm'; // Import the new component

type Props = ScreenProps<'ManageMenu'>;

// Predefined list of courses for consistent ordering and display (for removal section)
const displayCourses: Course[] = [
  'Specials',
  'Starter',
  'Main Course',
  'Dessert',
  'Drinks', // 'Drinks' is a category for display, not an addable course
];

export default function ManageMenuScreen({ navigation, route, menuItems, setMenuItems, drinksData, setDrinksData }: Props) {
  // State to keep track of items selected for removal
  const [itemsToRemove, setItemsToRemove] = useState<Set<string>>(new Set());

  // Custom hook to get menu statistics (like average prices)
  const { totalItemCount, getAveragePrice, getAverageDrinkPrice } = useMenuStats(menuItems, drinksData);

  // --- Functions for Adding Items ---

  // Handles adding a new food or drink item to the menu
  const handleAddItem = (newItem: MenuItem | DrinkItem, isDrink: boolean, course: string) => {
    // Logic for adding a drink
    if (isDrink) {
      // Determine the correct category ('Hot drinks' or 'Cold drinks') from the course string.
      const drinkCategory = course === 'Hot Drink' ? 'Hot drinks' : 'Cold drinks';
      const newDrink = newItem as DrinkItem;

      setDrinksData(prevDrinks => {
        // Check for duplicates before adding
        if (prevDrinks[drinkCategory].some(d => d.name === newDrink.name)) {
          Alert.alert("Duplicate Item", `${newDrink.name} already exists in ${drinkCategory}.`);
          return prevDrinks;
        }
        const newDrinks = [...prevDrinks[drinkCategory], newDrink];
        return { ...prevDrinks, [drinkCategory]: newDrinks };
      });
      Alert.alert("Success", `${newDrink.name} has been added to ${drinkCategory}.`);
    // Logic for adding a food item
    } else {
      const foodItem = newItem as MenuItem;
      // Check for duplicates before adding
      if (menuItems.some(item => item.name === foodItem.name && item.course === foodItem.course)) {
        Alert.alert("Duplicate Item", `${foodItem.name} already exists in ${foodItem.course}.`);
        return;
      }
      setMenuItems(prevItems => [foodItem, ...prevItems]);
      Alert.alert("Success", `${foodItem.name} has been added to the menu.`);
    }
  };

  // --- Functions for Removing Items ---

  // Adds or removes an item's ID from the set of items to be deleted
  const toggleItemForRemoval = useCallback((itemId: string) => {
    setItemsToRemove(prevItems => {
      const newItemsToRemove = new Set(prevItems);
      if (newItemsToRemove.has(itemId)) {
        newItemsToRemove.delete(itemId);
      } else {
        newItemsToRemove.add(itemId);
      }
      return newItemsToRemove;
    });
  }, []);

  // Finalizes the removal of all selected items
  const handleSaveChanges = () => {
    if (itemsToRemove.size === 0) {
      Alert.alert("No Changes", "No items were selected for removal.");
      return;
    }

    // Filter out the removed food items from the main menu state
    const updatedMenuItems = menuItems.filter(item => !itemsToRemove.has(item.id));
    setMenuItems(updatedMenuItems);

    // Filter out the removed drinks from the drinks state
    const newColdDrinks = drinksData['Cold drinks'].filter(drink => !itemsToRemove.has(`cold-${drink.name.replace(/\s+/g, '-')}`));
    const newHotDrinks = drinksData['Hot drinks'].filter(drink => !itemsToRemove.has(`hot-${drink.name.replace(/\s+/g, '-')}`));
    setDrinksData({ 'Cold drinks': newColdDrinks, 'Hot drinks': newHotDrinks });

    // Clear the removal list and show a success message
    setItemsToRemove(new Set());
    Alert.alert("Changes Saved", "The selected items have been removed from the menu.");
  };

  // Organizes the menu items into sections by course for the SectionList component
  const menuSections = useMemo(() => {
    const groupedMenu = menuItems.reduce((acc, item) => {
      (acc[item.course] = acc[item.course] || []).push(item);
      return acc;
    }, {} as Record<Course, MenuItem[]>);

    return displayCourses
      .filter(course => course !== 'Drinks' && groupedMenu[course]?.length > 0)
      .map(course => ({
        title: course,
        data: groupedMenu[course],
      }));
  }, [menuItems]);

  // --- Render Functions for Removal Section ---
  // Renders a single food item card in the "Remove Items" list
  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
    // Check if the item is currently marked for removal to change its style
    const isMarkedForRemoval = itemsToRemove.has(item.id);
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <View style={[styles.menuItemCard, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
        <Image source={imageSource || require('../assets/Logo.jpg')} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name} - R{item.price.toFixed(0)}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
           <TouchableOpacity
             style={[styles.removeButton, isMarkedForRemoval && styles.removeButtonActive]}
             onPress={() => toggleItemForRemoval(item.id)}
           >
             <Text style={styles.removeButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
           </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Renders the entire drinks section (hot and cold) for the "Remove Items" list
  const renderDrinksSection = () => (
     <View>
       <Text style={styles.courseHeader}>Drinks</Text>
       <View style={styles.drinksContainer}>
         {/* Cold Drinks List */}
         <Text style={styles.drinksSubHeader}>Cold drinks</Text>
         {drinksData['Cold drinks'].map((drink, index) => {
           const drinkId = `cold-${drink.name.replace(/\s+/g, '-')}`;
           const isMarkedForRemoval = itemsToRemove.has(drinkId);
           return (
             <View key={`cold-${index}`} style={[styles.drinkItem, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
               <Text style={styles.drinkText}>{drink.name} - R{drink.price}</Text>
               <TouchableOpacity
                 style={[styles.drinkRemoveButton, isMarkedForRemoval && styles.removeButtonActive]}
                 onPress={() => toggleItemForRemoval(drinkId)}
               >
                 <Text style={styles.drinkRemoveButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
               </TouchableOpacity>
             </View>
           );
         })}
         {/* Hot Drinks List */}
         <Text style={[styles.drinksSubHeader, { marginTop: 15 }]}>Hot drinks</Text>
         {drinksData['Hot drinks'].map((drink, index) => {
           const drinkId = `hot-${drink.name.replace(/\s+/g, '-')}`;
           const isMarkedForRemoval = itemsToRemove.has(drinkId);
           return (
             <View key={`hot-${index}`} style={[styles.drinkItem, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
               <Text style={styles.drinkText}>{drink.name} - R{drink.price}</Text>
               <TouchableOpacity
                 style={[styles.drinkRemoveButton, isMarkedForRemoval && styles.removeButtonActive]}
                 onPress={() => toggleItemForRemoval(drinkId)}
               >
                 <Text style={styles.drinkRemoveButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
               </TouchableOpacity>
             </View>
           );
         })}
       </View>
     </View>
  );

  // Header component for the "Remove Items" list, showing stats and instructions
  const RemovalListHeader = () => {
    return (
      <>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total menu items</Text>
            <Text style={styles.statValue}>{totalItemCount} Items</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Avg price per course</Text>
            {displayCourses.filter(c => c !== 'Drinks').map(course => {
              const avg = getAveragePrice(course);
              return avg > 0 ? <Text key={course} style={styles.statValueSmall}>{course}: R{avg.toFixed(0)}</Text> : null;
            })}
            <Text key="hot-drinks-avg" style={styles.statValueSmall}>Hot Drinks: R{getAverageDrinkPrice('Hot drinks').toFixed(0)}</Text>
            <Text key="cold-drinks-avg" style={styles.statValueSmall}>Cold Drinks: R{getAverageDrinkPrice('Cold drinks').toFixed(0)}</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Remove Existing Items</Text>
        <Text style={styles.instructionText}>Tap an item to mark/unmark for removal.</Text>
      </>
    );
  };

  // Header component for the main list, containing the Add Item form
  const MainListHeader = () => (
    <>
            <View style={styles.header}>
              <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
              <Text style={styles.title}>Manage Menu Items</Text>
            </View>
            
            {/* --- Add New Item Form (Now a separate component) --- */}
            <AddItemForm onAddItem={handleAddItem} />

      {/* The header for the removal section is now part of the main list */}
      <RemovalListHeader />
      {renderDrinksSection()}
    </>
  );

  return (
    <ImageBackground source={require("../assets/Background.jpg")} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.innerContainer}>
          {/* --- Main List for Adding and Removing Items --- */}
          <SectionList
            sections={menuSections}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItemCard}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.courseHeader}>{title}</Text>}
            ListHeaderComponent={MainListHeader}
            contentContainerStyle={styles.removalListContent}
            extraData={itemsToRemove} // Ensures re-render when an item is marked
          />

          {/* --- Footer Action Buttons --- */}
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveChanges}>
              <Text style={styles.footerButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuHomeButton} onPress={() => navigation.navigate("Menu", {})}>
              <Text style={styles.footerButtonText}>Menu-Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  formSection: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  middleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#577c7cff',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom: 15,
  },
  saveButton: { 
    backgroundColor: '#c98b2fff', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff', 
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },

  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statBox: {
    width: '48%',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#333',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statValueSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
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
  removalListContent: {
    paddingHorizontal: 20, 
    paddingBottom: 30,
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
    alignItems: 'center',
  },
  itemMarkedForRemoval: {
    backgroundColor: '#ffdddd', 
    borderColor: '#c00',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    flexShrink: 1, 
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
  removeButton: {
    backgroundColor: '#dc3545', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  removeButtonActive: {
    backgroundColor: '#ffc107', 
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  drinksContainer: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  drinksSubHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  drinkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 4,
    borderRadius: 4,
  },
  drinkText: {
    fontSize: 13,
    flex: 1,
  },
  drinkRemoveButton: {
    backgroundColor: '#dc3545', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  drinkRemoveButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Footer Buttons
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%', 
  },
  saveChangesButton: {
    backgroundColor: '#6c86a1ff', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  menuHomeButton: {
    backgroundColor: '#43644eff', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoutButton: {
    backgroundColor: '#bd7d1cff', 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});