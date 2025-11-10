import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { ScreenProps, Course, MenuItem } from "../App";

type Props = ScreenProps<'EditMenu'>;
// We exclude 'Drinks' because they are handled separately and not added via this form.
const courseOptions = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Hot Drink', 'Cold Drink'];

// The edit menu screen component 
export default function EditMenuScreen({ navigation, route, menuItems, setMenuItems, drinksData, setDrinksData }: Props) {
  // We still get the current items to know what to navigate with
  const { currentMenuItems } = route.params; 
  // State for the form inputs 
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState('');
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Determine if the selected course is a drink 
  const isDrink = selectedCourse === 'Hot Drink' || selectedCourse === 'Cold Drink';

  // Function to handle saving the new menu item or drink
  const handleSave = () => {
    if (!dishName || !selectedCourse) {
      Alert.alert("Incomplete Form", "Please provide a name and select a course.");
      return;
    }

    // Validate required fields for food items
    if (!isDrink && (!description || !price)) {
      Alert.alert("Incomplete Form", "Please fill out all fields before saving.");
      return;
    }

    if (isDrink) {
      // Handle adding a drink
      const drinkCategory = selectedCourse === 'Hot Drink' ? 'Hot drinks' : 'Cold drinks';
      setDrinksData(prevDrinks => {
        const newDrinks = [...prevDrinks[drinkCategory], dishName];
        return { ...prevDrinks, [drinkCategory]: newDrinks };
      });
      Alert.alert("Success", `${dishName} has been added to ${drinkCategory}.`);
    } else {
      // Handle adding a food item
      const newItem: MenuItem = {
        // Generate a unique ID
        id: `menuItem_${Date.now()}`, 
        name: dishName,
        description: description,
        course: selectedCourse as Exclude<Course, 'Drinks'>,
        price: parseFloat(price),
        // Pass the image URI if available 
        image: image, 
      };
      //
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
    // Check for permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
      return;
    }

    // Launch image picker 
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

  return (
    // Background image for the edit menu screen 
    <ImageBackground source={require("../assets/Background.jpg")} style={styles.container} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
              <Text style={styles.title}>Edit Menu Items</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Dish Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a Dish Name"
                value={dishName}
                onChangeText={setDishName}
              />

              {!isDrink && (
                <>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter a description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </>
              )}

              <Text style={styles.label}>Select the Course</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a course" value="" />
                  {courseOptions.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>

              {!isDrink && (
                <>
                  <Text style={styles.label}>Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter a Price"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                  />
                </>
              )}
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

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.removeItemsButton} onPress={() => navigation.navigate("RemoveItems", { currentMenuItems: menuItems, currentDrinksData: drinksData })}>
                <Text style={styles.removeButtonText}>Remove Items</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuHomeButton} onPress={() => navigation.navigate("Menu", {})}>
                <Text style={styles.buttonText}>Menu-Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.logoutButtonText}>Logout</Text>
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
    marginBottom: 20 
  },
  logo: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 15 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  formSection: { 
    width: '100%', 
    marginBottom: 20 
  },
  label: { 
    fontWeight: 'bold', 
    textDecorationLine: 'underline', 
    marginBottom: 5, 
    fontSize: 16 
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
    width: '100%' 
  },
  middleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 20,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
  navButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 20,
    width: '100%',
  },
  removeItemsButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  removeButtonText: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
  menuHomeButton: {
    backgroundColor: '#a0a0a0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButton: {
    // A distinct color for logout
    backgroundColor: '#bd7d1cff', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
});
