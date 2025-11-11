import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type AdminNavProp = StackNavigationProp<RootStackParamList, "WelcomeChef">;
type Props = { navigation: AdminNavProp };

export default function WelcomeChefScreen({ navigation }: Props) {
  return (
    <ImageBackground
    // Make sure you have a background.jpg in your assets folder
      source={require("../assets/Background.jpg")} 
      // Set the style to cover the entire screen
      style={styles.container} resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Image source={require("../assets/Logo.jpg")} style={styles.logo} />
            <Text style={styles.title}>Welcome Christoffel’s</Text>
          </View>
          <Image source={require("../assets/Menu Banner.jpg")} style={styles.image} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Menu", { isAdmin: true })}
          >
            <Text style={styles.buttonText}>Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FilterByCourse", {} as any)}
          >
            <Text style={styles.buttonText}>Filter by Course</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ManageMenu", {} as any)}
          >
            <Text style={styles.buttonText}>Manage Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    flex: 1,
    // Optional: adds a dark overlay for better text readability
    backgroundColor: "rgba(0,0,0,0.3)", 
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
   width: 70, 
   height: 70, 
   borderRadius: 35, 
   marginRight: 15 
  },
  image: { 
    width: 250, 
    height: 140, 
    borderRadius: 10, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#fff" 
  }, // Changed color for readability
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginVertical: 8,
  },
  buttonText: { 
    color: "#eeececff", 
    fontWeight: "bold" 
  },
});
