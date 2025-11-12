import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Course, MenuItem, DrinkItem } from '../App';

const addCourseOptions = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Hot Drink', 'Cold Drink'];

type AddItemFormProps = {
  onAddItem: (item: MenuItem | DrinkItem, isDrink: boolean, course: string) => void;
};

export default function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState('');
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const isDrink = selectedCourse === 'Hot Drink' || selectedCourse === 'Cold Drink';

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
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePressAddItem = () => {
    if (!dishName || !selectedCourse || !price) {
      Alert.alert("Incomplete Form", "Please provide a name, course, and price.");
      return;
    }
    if (!isDrink && !description) {
      Alert.alert("Incomplete Form", "Please provide a description for the food item.");
      return;
    }

    let newItem: MenuItem | DrinkItem;
    if (isDrink) {
      newItem = {
        name: dishName,
        price: parseFloat(price),
      };
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

    onAddItem(newItem, isDrink, selectedCourse);

    // Clear form
    setDishName("");
    setDescription("");
    setSelectedCourse('');
    setPrice("");
    setImage(null);
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Add New Item</Text>
      <View style={styles.formSection}>
        <Text style={styles.label}>Dish/Drink Name</Text>
        <TextInput style={styles.input} placeholder="Enter Name" value={dishName} onChangeText={setDishName} />

        {!isDrink && (
          <>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.input} placeholder="Enter description" value={description} onChangeText={setDescription} multiline />
          </>
        )}

        <Text style={styles.label}>Select Course/Category</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedCourse} onValueChange={(itemValue) => setSelectedCourse(itemValue)} style={styles.picker}>
            <Picker.Item label="Select a course/category" value="" />
            {addCourseOptions.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        <Text style={styles.label}>Price</Text>
        <TextInput style={styles.input} placeholder="Enter Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
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
        <TouchableOpacity style={styles.saveButton} onPress={handlePressAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

// Using styles from ManageMenuScreen - you can copy them here or import them
const styles = StyleSheet.create({
    sectionTitle: { fontSize: 20, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 15, marginTop: 20, textAlign: 'center' },
    formSection: { width: '100%', marginBottom: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
    label: { fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 5, fontSize: 16 },
    input: { backgroundColor: '#f0f0f0', borderRadius: 20, padding: 15, marginBottom: 15, fontSize: 16 },
    pickerContainer: { backgroundColor: '#f0f0f0', borderRadius: 20, marginBottom: 15, justifyContent: 'center' },
    picker: { height: 50, width: '100%' },
    middleSection: { alignItems: 'center', marginBottom: 30 },
    uploadButton: { backgroundColor: '#577c7cff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 20, marginBottom: 15 },
    saveButton: { backgroundColor: '#c98b2fff', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
    buttonText: { fontWeight: 'bold', color: '#fff' },
    imagePreview: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 2, borderColor: '#ccc' },
});