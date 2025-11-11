import React, { useState, useCallback, useMemo } from "react";
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ImageBackground, SectionList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { ScreenProps, Course, MenuItem, DrinksData, DrinkItem } from "../App";
import { useMenuStats } from "./useMenuStats";

type Props = ScreenProps<'ManageMenu'>;

// Course options for adding items (includes specific drink types)
const addCourseOptions = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Hot Drink', 'Cold Drink'];

// Predefined list of courses for consistent ordering and display (for removal section)
const displayCourses: Course[] = [
  'Specials',
  'Starter',
  'Main Course',
  'Dessert',
  'Drinks', // 'Drinks' is a category for display, not an addable course
];

export default function ManageMenuScreen({ navigation, route, menuItems, setMenuItems, drinksData, setDrinksData }: Props) {
  // State for adding new items
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState('');
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // State for removing items
  const [itemsToRemove, setItemsToRemove] = useState<Set<string>>(new Set());

  // Use the custom hook for menu statistics
  const { totalItemCount, getAveragePrice, getAverageDrinkPrice } = useMenuStats(menuItems, drinksData);

  // Determine if the selected course for adding is a drink
  const isDrink = selectedCourse === 'Hot Drink' || selectedCourse === 'Cold Drink';

  // --- Functions for Adding Items ---
  const handleAddItem = () => {
    if (!dishName || !selectedCourse) {
      Alert.alert("Incomplete Form", "Please provide a name and select a course.");
      return;
    }

    if ((!isDrink && !description) || !price) {
      Alert.alert("Incomplete Form", "Please fill out all required fields.");
      return;
    }

    if (isDrink) {
      const drinkCategory = selectedCourse === 'Hot Drink' ? 'Hot drinks' : 'Cold drinks';
      const newDrink: DrinkItem = {
        name: dishName,
        price: parseFloat(price),
      };

      setDrinksData(prevDrinks => {
        // Check for duplicates before adding
        if (prevDrinks[drinkCategory].some(d => d.name === dishName)) {
          Alert.alert("Duplicate Item", `${dishName} already exists in ${drinkCategory}.`);
          return prevDrinks;
        }
        const newDrinks = [...prevDrinks[drinkCategory], newDrink];
        return { ...prevDrinks, [drinkCategory]: newDrinks };
      });
      Alert.alert("Success", `${dishName} has been added to ${drinkCategory}.`);
    } else {
      const newItem: MenuItem = {
        id: `menuItem_${Date.now()}`,
        name: dishName,
        description: description,
        course: selectedCourse as Exclude<Course, 'Drinks'>,
        price: parseFloat(price),
        image: image,
      };
      // Check for duplicates before adding
      if (menuItems.some(item => item.name === dishName && item.course === selectedCourse)) {
        Alert.alert("Duplicate Item", `${dishName} already exists in ${selectedCourse}.`);
        return;
      }
      setMenuItems(prevItems => [newItem, ...prevItems]);
      Alert.alert("Success", `${newItem.name} has been added to the menu.`);
    }

    // Clear the form fields after saving
    setDishName("");
    setDescription("");
    setSelectedCourse('');
    setPrice("");
    setImage(null);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- Functions for Removing Items ---
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

  const handleSaveChanges = () => {
    if (itemsToRemove.size === 0) {
      Alert.alert("No Changes", "No items were selected for removal.");
      return;
    }

    const updatedMenuItems = menuItems.filter(item => !itemsToRemove.has(item.id));
    setMenuItems(updatedMenuItems);

    const newColdDrinks = drinksData['Cold drinks'].filter(drink => !itemsToRemove.has(`cold-${drink.name.replace(/\s+/g, '-')}`));
    const newHotDrinks = drinksData['Hot drinks'].filter(drink => !itemsToRemove.has(`hot-${drink.name.replace(/\s+/g, '-')}`));
    setDrinksData({ 'Cold drinks': newColdDrinks, 'Hot drinks': newHotDrinks });

    setItemsToRemove(new Set());
    Alert.alert("Changes Saved", "The selected items have been removed from the menu.");
  };

  // Prepare sections for SectionList (for displaying/removing)
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
  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
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

  const renderDrinksSection = () => (
     <View>
       <Text style={styles.courseHeader}>Drinks</Text>
       <View style={styles.drinksContainer}>
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

  // Header component for the removal section, showing stats
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

  return (
    <ImageBackground source={require("../assets/Background.jpg")} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
              <Text style={styles.title}>Manage Menu Items</Text>
            </View>

            {/* --- Add Item Section --- */}
            <Text style={styles.sectionTitle}>Add New Item</Text>
            <View style={styles.formSection}>
              <Text style={styles.label}>Dish/Drink Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={dishName}
                onChangeText={setDishName}
              />

              {!isDrink && (
                <>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </>
              )}

              <Text style={styles.label}>Select Course/Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a course/category" value="" />
                  {addCourseOptions.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>

              <>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </>
            </View>

            <View style={styles.middleSection}>
              {!isDrink && (
                <>
                  {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                  <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.buttonText}>Upload Image</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
                <Text style={styles.buttonText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {/* --- Remove Item Section --- */}
            <SectionList
              sections={menuSections}
              keyExtractor={(item) => item.id}
              renderItem={renderMenuItemCard}
              renderSectionHeader={({ section: { title } }) => <Text style={styles.courseHeader}>{title}</Text>}
              ListHeaderComponent={() => (<><RemovalListHeader />{renderDrinksSection()}</>)}
              contentContainerStyle={styles.removalListContent}
              extraData={itemsToRemove} // Ensures re-render when an item is marked
              scrollEnabled={false} // Disable SectionList's own scroll as it's inside a ScrollView
            />

            {/* --- Action Buttons --- */}
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
        </ScrollView>
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
    padding: 20,
  },
  innerContainer: {
    flex: 1,
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
  saveButton: { // For adding item
    backgroundColor: '#c98b2fff', // Green for add
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff', // White text for save/add buttons
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },

  // Styles for Removal Section (adapted from RemoveItemsScreen)
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
    paddingHorizontal: 5, // Slightly less padding for the list itself
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
    backgroundColor: '#ffdddd', // Highlight items marked for removal
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
    backgroundColor: '#dc3545', // Red for remove
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  removeButtonActive: {
    backgroundColor: '#ffc107', // Orange for undo
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
    backgroundColor: '#dc3545', // Red for remove
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
    marginTop: 30,
    paddingHorizontal: 10,
    width: '100%', 
  },
  saveChangesButton: {
    backgroundColor: '#6c86a1ff', // Blue for save changes
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  menuHomeButton: {
    backgroundColor: '#43644eff', // Grey for menu home
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  logoutButton: {
    backgroundColor: '#bd7d1cff', // Distinct color for logout
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