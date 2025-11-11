import React, { useState } from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Import only the screens you want to work on
import LoginScreen from "./screens/LoginScreen"; // The first screen the user sees
import WelcomeChefScreen from "./screens/AdminWelcomeScreen";
import MenuScreen from "./screens/MenuScreen"; // Make sure this is imported
import ManageMenuScreen from "./screens/ManageMenuScreen"; // New combined screen
import FilterByCourseScreen from "./screens/FilterByCourseScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

// Define a shared Course type
export type Course = 'Specials' | 'Starter' | 'Main Course' | 'Dessert' | 'Drinks';

// Define a shared DrinkItem type
export type DrinkItem = {
  name: string;
  price: number;
};

// Define a shared DrinksData type
export type DrinksData = {
  'Cold drinks': DrinkItem[];
  'Hot drinks': DrinkItem[];
};

// Define a shared MenuItem type to be used across screens
export type MenuItem = { 
  id: string; 
  name: string; 
  description: string; 
  course: Course; 
  price: number; 
  image?: any; // Allow both string URI and require() result
};

// Defines all the possible screens and what parameters (if any) they can receive
export type RootStackParamList = {
  Login: undefined;
  WelcomeChef: undefined;
  Menu: { isAdmin?: boolean; openEdit?: boolean; openFilter?: boolean; };
  ManageMenu: { currentMenuItems: MenuItem[]; currentDrinksData: DrinksData }; // Updated for combined screen
  FilterByCourse: { currentMenuItems: MenuItem[]; currentDrinksData: DrinksData };
  Checkout: undefined; // Checkout screen gets orderedItems from global state, no route params needed
};

// Create the stack navigator 
const Stack = createStackNavigator<RootStackParamList>();

// A helper type to make it easier to define props for each screen component
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  drinksData: DrinksData;
  setDrinksData: React.Dispatch<React.SetStateAction<DrinksData>>;
  orderedItems: MenuItem[];
  setOrderedItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

// This is the main component that runs the entire application
export default function App() {
  // These 'useState' hooks create the central state for the app.
  // All screens will share this data, so changes in one screen are seen everywhere.
  // Initialize state for menu items and drinks data used across screens
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Lobster Thermidor', 
      description: 'Grilled lobster tail in a creamy mustard and brandy sauce.', 
      course: 'Specials', 
      price: 300, 
      image: require("./assets/Lobster Thermidor.jpg") 
    },
    { id: '2', 
      name: "Chef's Tasting Platter", 
      description: "A curated selection of the chef's favorite seasonal bites (serves two).", 
      course: 'Specials', 
      price: 350, 
      image: require("./assets/Chef's Tasting Platter.jpg") 
    },
    { id: '3', 
      name: 'Seared Scallops with Herb Sauce', 
      description: 'Pan-fried scallops served with herb and lemon dressing.', 
      course: 'Starter', 
      price: 95, 
      image: require('./assets/Seared Scallops with Herb Sauce.jpg') 
    },
    { id: '4',
       name: 'Roasted Tomato Soup', 
       description: 'Rich roasted tomato soup topped with basil oil and croutons.', 
       course: 'Starter', 
       price: 70, 
       image: require('./assets/Roasted Tomato Soup.jpg') 
      },
    { id: '5', 
      name: 'Fillet Steak',
      description: 'Tender beef fillet with creamy peppercorn sauce and potatoes.', 
      course: 'Main Course', 
      price: 220, 
      image: require('./assets/fillet-steak.jpg') 
    },
    { id: '6', 
      name: 'Pan-Fried Salmon', 
      description: 'Salmon fillet served with creamy dill and mustard sauce.', 
      course: 'Main Course', 
      price: 155, 
      image: require('./assets/Pan-Fried Salmon.jpg') 
    },
    { id: '7', 
      name: 'Classic Crème Brûlée', 
      description: 'Smooth vanilla custard topped with a caramelised sugar crust.', 
      course: 'Dessert', 
      price: 125, 
      image: require('./assets/Classic Crème Brûlée.jpg') 
    },
    { id: '8', 
      name: 'Chocolate Lava Pudding', 
      description: 'Rich chocolate sponge with a gooey molten centre.', 
      course: 'Dessert', 
      price: 95, 
      image: require('./assets/Chocolate Lava Pudding.jpg') 
    },
  ]);

  const [drinksData, setDrinksData] = useState<DrinksData>({
    'Cold drinks': [
      { name: 'Any frizzy drink', price: 25 },
      { name: "Fruit juice's", price: 30 },
      { name: 'Ice water', price: 15 }
    ],
    'Hot drinks': [
      { name: 'Tea', price: 20 },
      { name: 'Coffee', price: 28 },
      { name: 'Hot chocolate', price: 35 }
    ],
  });

  // Central state for the customer's order
  const [orderedItems, setOrderedItems] = useState<MenuItem[]>([]);

  return (
    // NavigationContainer is the root of all navigation in the app
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#e8eaf6" },
          headerTintColor: "#000",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Each Stack.Screen defines a single screen in the navigation stack */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="WelcomeChef"
          options={{ title: "Welcome Chef" }}
        >
          {/* We pass down the central state to the screens that need it */}
          {(props) => <WelcomeChefScreen {...props} menuItems={menuItems} drinksData={drinksData} />}
        </Stack.Screen>

        <Stack.Screen
          name="Menu"
          options={{ title: "Menu" }}
        >
          {/* The props include navigation, route, and our custom state props */}
          {(props) => <MenuScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} orderedItems={orderedItems} setOrderedItems={setOrderedItems} />}
        </Stack.Screen>

        <Stack.Screen
          name="ManageMenu" // New screen name
          options={{ title: "Manage Menu" }} // New title
        >
          {(props) => <ManageMenuScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} orderedItems={orderedItems} setOrderedItems={setOrderedItems} />}
        </Stack.Screen>

        <Stack.Screen
          name="FilterByCourse"
          options={{ title: "Filter By Course" }}
        >
          {(props) => <FilterByCourseScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} orderedItems={orderedItems} setOrderedItems={setOrderedItems} />}
        </Stack.Screen>

        <Stack.Screen
          name="Checkout"
          options={{ title: "Checkout" }}
        >
          {(props) => <CheckoutScreen {...props} orderedItems={orderedItems} setOrderedItems={setOrderedItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
