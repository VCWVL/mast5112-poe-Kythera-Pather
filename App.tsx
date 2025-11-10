import React, { useState } from "react";
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Import only the screens you want to work on
import LoginScreen from "./screens/LoginScreen";
import WelcomeChefScreen from "./screens/AdminWelcomeScreen";
import MenuScreen from "./screens/MenuScreen"; // Make sure this is imported
import EditMenuScreen from "./screens/EditMenuScreen";
import RemoveItemsScreen from "./screens/RemoveItemsScreen";
import FilterByCourseScreen from "./screens/FilterByCourseScreen";
import CheckoutScreen from "./screens/CheckoutScreen";

// Define a shared Course type
export type Course = 'Specials' | 'Starter' | 'Main Course' | 'Dessert' | 'Drinks';

// Define a shared DrinksData type
export type DrinksData = {
  'Cold drinks': string[];
  'Hot drinks': string[];
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

// Define the root stack parameter list for navigation 
export type RootStackParamList = {
  Login: undefined;
  WelcomeChef: undefined;
  Menu: { isAdmin?: boolean; openEdit?: boolean; openFilter?: boolean; };
  EditMenu: { currentMenuItems: MenuItem[] };
  RemoveItems: { currentMenuItems: MenuItem[]; currentDrinksData: DrinksData };
  FilterByCourse: { currentMenuItems: MenuItem[]; currentDrinksData: DrinksData };
  Checkout: { orderedItems: MenuItem[] };
};

// Create the stack navigator 
const Stack = createStackNavigator<RootStackParamList>();

// Helper type for screen components
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  drinksData: DrinksData;
  setDrinksData: React.Dispatch<React.SetStateAction<DrinksData>>;
};

export default function App() {
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
    'Cold drinks': ['Any frizzy drink', "Fruit juice's", 'Ice water'],
    'Hot drinks': ['Tea', 'Coffee', 'Hot chocolate'],
  });

  return (
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        <Stack.Screen
          name="WelcomeChef"
          component={WelcomeChefScreen}
          options={{ title: "Welcome Chef" }}
        />

        <Stack.Screen
          name="Menu"
          options={{ title: "Menu" }}
        >
          {(props) => <MenuScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} />}
        </Stack.Screen>

        <Stack.Screen
          name="EditMenu"
          options={{ title: "Edit Menu" }}
        >
          {(props) => <EditMenuScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} />}
        </Stack.Screen>

        <Stack.Screen
          name="RemoveItems"
          options={{ title: "Remove Items" }}
        >
          {(props) => <RemoveItemsScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} />}
        </Stack.Screen>

        <Stack.Screen
          name="FilterByCourse"
          options={{ title: "Filter By Course" }}
        >
          {(props) => <FilterByCourseScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} />}
        </Stack.Screen>

        <Stack.Screen
          name="Checkout"
          options={{ title: "Checkout" }}
        >
          {(props) => <CheckoutScreen {...props} menuItems={menuItems} setMenuItems={setMenuItems} drinksData={drinksData} setDrinksData={setDrinksData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
