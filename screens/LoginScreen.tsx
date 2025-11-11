import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type LoginNavProp = StackNavigationProp<RootStackParamList, "Login">;

type Props = { navigation: LoginNavProp };

// The login screen component 
export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // This hook runs whenever the user navigates to this screen.
  // It's used here to automatically clear the form fields.
  useFocusEffect(
    useCallback(() => {
      // Clear the input fields
      setUsername("");
      setPassword("");
    }, [])
  );
  // Checks the username and navigates to the correct screen (Admin or Customer)
  const handleLogin = () => {
    if (username.toLowerCase() === "chef") {
      navigation.navigate("WelcomeChef");
    } else {
      navigation.navigate("Menu", {});
    }
  };

  return (
    // Give the background image a stretch resize mode to cover the entire screen
    <ImageBackground source={require("../assets/Background.jpg")} style={styles.container} resizeMode="stretch">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome to Christoffel's Menu</Text>
          <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
          <Text style={styles.subtitle}>We hope you have an amazing experience with us</Text>
          
          {/* The main form for username and password input */}
          <Image source={require("../assets/Menu Banner.jpg")} style={styles.banner} />

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          {/* The login button that triggers the handleLogin function */}
          <TouchableOpacity style={styles.saveButton} onPress={handleLogin}>
            <Text style={styles.saveText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    // Adding height: '100%' helps ensure the container fills the screen on web
    height: '100%',
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",
  },
  scrollContent: {
    // This is for centering content vertically
    flexGrow: 1, 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#fff", 
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 16, 
    fontStyle: "italic", 
    marginBottom: 15, 
    color: "#fff", 
    textAlign: "center" 
  },
  logo: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 10 
  },
  banner: { 
    resizeMode: "cover", 
    width: 220, 
    height: 120, 
    borderRadius: 10, 
    marginBottom: 20 
  },
  label: { 
    alignSelf: "flex-start",
     marginLeft: "10%", 
     fontWeight: "bold", 
     marginTop: 10, 
     color: "#fff" 
    },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
  },
  saveText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});
