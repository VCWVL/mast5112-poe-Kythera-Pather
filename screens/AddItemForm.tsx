import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Course, MenuItem, DrinkItem } from '../App';

// These are the options that will appear in the dropdown menu for selecting a course.
const addCourseOptions = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Hot Drink', 'Cold Drink'];

// This defines what kind of information (props) the AddItemForm component expects to receive from its parent.
// It expects one prop: a function called `onAddItem` that it will call when the user saves a new item.
type AddItemFormProps = {
  onAddItem: (item: MenuItem | DrinkItem, isDrink: boolean, course: string) => void;
};

// This is the main component for the form. It manages its own state and UI.
export default function AddItemForm({ onAddItem }: AddItemFormProps) {

  // These are state variables. They hold the data the user types into the form fields.
  // `useState` creates a piece of state; the first variable holds the value, the second is a function to update it.
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState('');
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // A simple check to see if the selected course is a drink. This is used to show/hide fields later.
  const isDrink = selectedCourse === 'Hot Drink' || selectedCourse === 'Cold Drink';

  // This function handles opening the phone's image library to pick a photo.
  const pickImage = async () => {
    // First, ask for permission to access the user's photos.
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
      return; // Stop if permission is not granted.
    }
    // Launch the image library, allowing the user to pick and edit an image.
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    // If the user picked an image (didn't cancel), save its location (URI) to the state.
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // This function is called when the user presses the "Add Item" button.
  const handlePressAddItem = () => {
    // --- Validation Checks ---
    // Check if the most important fields are filled out.
    if (!dishName || !selectedCourse || !price) {
      Alert.alert("Incomplete Form", "Please provide a name, course, and price.");
      return;
    }
    // If it's a food item (not a drink), make sure it has a description.
    if (!isDrink && !description) {
      Alert.alert("Incomplete Form", "Please provide a description for the food item.");
      return;
    }

    // --- Create the New Item Object ---
    let newItem: MenuItem | DrinkItem;
    // If it's a drink, create a simple drink object.
    if (isDrink) {
      newItem = {
        name: dishName,
        price: parseFloat(price),
      };
    // If it's a food item, create a more detailed menu item object.
    } else {
      newItem = {
        id: `menuItem_${Date.now()}`,
        name: dishName,
        description: description,
        course: selectedCourse as Exclude<Course, 'Drinks'>,
        price: parseFloat(price),
        image: image,
      };
    }

    // --- Send Data to Parent and Reset Form ---
    // Call the `onAddItem` function passed from the parent, sending the new item data up.
    onAddItem(newItem, isDrink, selectedCourse);

    // Clear all the form fields so the user can add another item.
    setDishName("");
    setDescription("");
    setSelectedCourse('');
    setPrice("");
    setImage(null);
  };

  return (
    // This is the UI of the form, written in JSX.
    <>
      <Text style={styles.sectionTitle}>Add New Item</Text>
      <View style={styles.formSection}>
        {/* Input for the item's name */}
        <Text style={styles.label}>Dish/Drink Name</Text>
        <TextInput style={styles.input} placeholder="Enter Name" value={dishName} onChangeText={setDishName} />

        {/* The description field is only shown if the selected item is NOT a drink. */}
        {!isDrink && (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter description" value={description} onChangeText={setDescription} multiline />
          </>
        )}
        
        {/* Dropdown menu (Picker) to select the course category. */}
        <Text style={styles.label}>Select Course/Category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedCourse} onValueChange={(itemValue) => setSelectedCourse(itemValue)} style={styles.picker}>
            <Picker.Item label="Select a course/category" value="" />
            {addCourseOptions.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        {/* Input for the item's price. `keyboardType="numeric"` shows a number pad on mobile. */}
        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} placeholder="Enter Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      </View>

      {/* This section contains the image upload and final "Add Item" button. */}
      <View style={styles.middleSection}>
        {!isDrink && (
          <>
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </>
        )}
        {/* The button that triggers the `handlePressAddItem` function when pressed. */}
        <TouchableOpacity style={styles.saveButton} onPress={handlePressAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// These are the styles that make the form look good.
const styles = StyleSheet.create({
    sectionTitle: 
    { fontSize: 20, 
        fontWeight: 'bold', 
        textDecorationLine: 'underline', 
        marginBottom: 15, 
        marginTop: 20, 
        textAlign: 'center' 
    },
    formSection:  { 
        width: '100%', 
        marginBottom: 20, 
        padding: 10, 
        backgroundColor: 'rgba(255,255,255,0.8)', 
        borderRadius: 10, 
        borderWidth: 1,
         borderColor: '#ddd' 
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
         fontSize: 16 
        },
    pickerContainer: { 
        backgroundColor: '#f0f0f0',
        borderRadius: 20, 
        marginBottom: 15, 
        justifyContent: 'center' 
    },
    picker: { 
        height: 50, 
        width: '100%' 
    },
    middleSection: { 
        alignItems: 'center', 
        marginBottom: 30
     },
    uploadButton: { 
        backgroundColor: '#577c7cff', 
        paddingVertical: 15, 
        paddingHorizontal: 50, 
        borderRadius: 20, 
        marginBottom: 15
     },
    saveButton: { 
        backgroundColor: '#c98b2fff', 
        paddingVertical: 12, 
        paddingHorizontal: 40, 
        borderRadius: 20 
    },
    buttonText: { 
        fontWeight: 'bold', 
        color: '#fff' 
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15, 
        borderWidth: 2, 
        borderColor: '#ccc' 
        }
});