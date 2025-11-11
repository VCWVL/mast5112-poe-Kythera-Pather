# Christoffel’s Menu – React Native Application

---

# Overview

Christoffel’s Menu is a full-featured mobile application built using React Native and TypeScript.
The app provides an interactive digital menu experience for restaurant customers, alongside a dedicated administrative dashboard for chefs to manage menu content dynamically.

The system is designed with a dual-role architecture, ensuring a smooth experience for both regular diners and administrative users:

- Chef (Admin View): Manage the restaurant’s menu — add, edit, filter, or remove food and drink items.

- Customer View: Browse categorized menu items, filter by course, add items to a checkout list, and review an order summary.

This project forms part of a practical mobile application development module, showcasing applied knowledge of UI design, navigation, component management, and state handling in React Native.

- The first part of the POE part 1 was designning the wireframe for each screen and have a draft layout on what the App would look like with reasearched information on code that used and fit for the App.
- Part 2 was to code the whole App with the different screens for the customer and user to use, here was used to design the layout, code and make sure the app was running.

--- 

# Key Features

#### User Authentication System
- Simple role-based login flow distinguishing between the “Chef” (admin) and  customers.

#### Dynamic Menu Display
- Menu items are grouped by course (Specials, Starter, Main Course, Dessert, Drinks) using the efficient React Native SectionList component.

#### Dedicated Drinks Section
- Drinks are neatly divided into Hot and Cold subcategories for clarity.

#### Filter by Course
- Allows users to view only specific categories (e.g., only Desserts or Mains).

#### Interactive Checkout System
-Users can add items to their “checkout cart” and view the total cost before confirming.

#### Chef Management Tools

- Add Menu Items: Add new dishes or beverages, including name, description, price, and optional image upload.

- Remove Menu Items: Select one or multiple items for deletion.

- View Menu Statistics: Automatically calculates the average price per course and total item count.

#### Centralized State Management
- All menu data and navigation states are controlled via the main App.tsx, ensuring consistency across screens.

#### Adaptive UI Design
-Layouts are optimized for both Android and iOS, using modern React Native components and Flexbox styling.

---

# Screen-by-Screen Breakdown
### LoginScreen.tsx
- The entry point for all users.

- Accepts a username and password.

- If the username is "chef", the app navigates to the Admin Welcome Screen; otherwise, if not then the customer screen will load the Menu Screen.

- Simple yet effective authentication logic handled via navigation props.

### AdminWelcomeScreen.tsx

- A central dashboard designed for the Chef.

 Provides navigation to:

- The main Menu

- Filter by Course screen

- Edit Menu Items screen, whihc then also goes to the remove item screen

- Features a clean layout with quick-access buttons styled for clarity and usability.

### MenuScreen.tsx

- Acts as the core hub of the entire application.

- Displays all menu items grouped by category.

- Uses SectionList to ensure efficient rendering of large menus.

- The chef and customer gets to used this screen but the chef screen has a small difference
  The chef screen has a Filter by course, checkout, remove item and back button for the chef to use
  while the customer has only Filter by course, checkout and back button  

Includes:

- Menu statistics (total count, average prices)

- Drink sections (hot and cold)

- Buttons for filtering, checkout, back and remove 

- Fully scrollable view with headers, footers, and interactive navigation links.

### FilterByCourseScreen.tsx

- Allows users or chefs to view only one course at a time.

- Implements a dynamic filter with a horizontal course selector.

- Includes navigation back to the main Menu and an “Add to Checkout” option.

### EditMenuItemScreen.tsx

- Enables the Chef to add new dishes or drinks.

- Dynamically adjusts inputs based on the selected category (e.g., drinks vs. food).

- Utilizes expo-image-picker for optional photo uploads.

- Includes validation and visual feedback before saving.

### RemoveItemScreen.tsx

- Displays all current menu items in a selectable list.

- Allows multi-select functionality for item removal.

- Includes “Save” and “Cancel” actions at the bottom of the screen.

### CheckoutScreen.tsx

- Shows all items the user has added to their cart.

- Calculates total cost dynamically.

- Provides buttons to return to the Menu or finalize the checkout.

---

# Technology Stack
- Category -	Technology Used
- Framework -	React Native (with Expo SDK)
- Language -	TypeScript
- Navigation - 	React Navigation (@react-navigation/native, @react-navigation/stack)
- UI Components	- Core React Native components (View, Text, Image, SectionList, TouchableOpacity, etc.)
- Image Upload	- expo-image-picker
- Dropdowns & Pickers- 	@react-native-picker/picker
- Styling -	StyleSheet + Flexbox for responsive layouts

---

# Default Login Credentials
- Role	Username	Password
- Chef - username - chef,	(any password)
- Customer	- (any name other than “chef”), 	(any password)

---

# Future Enhancements

- Integration with a backend API for persistent storage.

- Customer feedback and rating system.

- Secure payment processing at checkout.

- Dark mode for improved accessibility and comfort.

---

## Youtube link to the video of the app working.
https://youtu.be/-S0EirDpphQ 

 ---

 # Referencing 
- AllRecipes, 2025. Lobster Thermidor. [online] 30 January.  Available at: <https://www.allrecipes.com/recipe/87386/lobster-thermidor/ >[Accessed 17 October 2025]
- Beeyot, n.d. Roasted Tomato Soup. [online] Available at: <https://beeyot.com/roasted-tomato-soup/ > [Accessed 17 October 2025]
- Cooper Butchers, n.d. Fillet Steak. [online] Available at: <https://www.cooperbutchers.com/product/fillet-steak/> [Accessed 17 October 2025]
- Craving Home Cooked, n.d. Lemon Dill Pan-Fried Salmon. [online] Available at: <https://cravinghomecooked.com/lemon-dill-pan-fried-salmon/ > [Accessed 17 October 2025]
- Expo Documentation, 2024. ImagePicker API – Expo SDK. [online] 7 January. Available at: <https://docs.expo.dev/versions/latest/sdk/imagepicker/>  [Accessed 19 October 2025]
- Pinterest, n.d. Pinterest Image – App Wireframe Inspiration. [online] Available at: <https://za.pinterest.com/pin/31806741113536806/> [Accessed 17 October 2025]
- Pinterest, n.d. Pinterest Image – Dessert Course Layout. [online] Available at: <https://za.pinterest.com/pin/3166662232418452/> [Accessed 17 October 2025]
- Pinterest, n.d. Pinterest Image – Seared Scallops with Herb Sauce. [online] Available at: <https://za.pinterest.com/pin/seared-scallops-with-herbinfused-sauce--962644489096624206/> [Accessed 17 October 2025]
- Pinterest, n.d. Pinterest Image – Menu Design Reference. [online] Available at: <https://ca.pinterest.com/pin/772015561107563426/> [Accessed 17 October 2025]
- Pinterest, n.d. Pinterest Image – UI Layout Example. [online] Available at: <https://za.pinterest.com/pin/138485757601566024/> [Accessed 17 October 2025]
- React Native, n.d. Colors – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/colors>  [Accessed 19 October 2025]
- React Native, n.d. Flexbox – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/flexbox>  [Accessed 19 October 2025]
- React Native, n.d. Handling Touches – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/handling-touches> [Accessed 19 October 2025]
- React Native, n.d. Images – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/images> [Accessed 17 October 2025]
- React Native, n.d. Navigation – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/navigation> [Accessed 17 October 2025]
- React Native, n.d. Strict TypeScript API – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/strict-typescript-api > [Accessed 20 October 2025]
- React Native, n.d. Style – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/style> [Accessed 17 October 2025]
- React Native, n.d. TypeScript – React Native Documentation. [online] Available at: <https://reactnative.dev/docs/typescript> [Accessed 21 October 2025]
- The Hungry Bites, 2023. Crème Brûlée. [online] 6 May. Available at: <https://www.thehungrybites.com/creme-brulee/> [Accessed 17 October 2025]
