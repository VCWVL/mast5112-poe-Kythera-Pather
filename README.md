# Christoffel's Menu - React Native Application

## 1. Overview

Welcome to Christoffel's Menu, a dynamic mobile application built with React Native and TypeScript. This app provides a seamless and interactive menu experience for restaurant customers and includes a dedicated administrative panel for the chef to manage menu items.

The application features a dual-role system:
*   **Customer View:** Allows users to browse the full menu, filter items by course, add items to their order, and view the checkout total.
*   **Admin (Chef) View:** Unlocks powerful menu management tools, including the ability to add new food and drink items, upload images, and remove existing items from the menu.

## 2. Features

-   **User & Admin Authentication:** Simple login system to differentiate between a regular user and the "Chef".
-   **Dynamic Menu Display:** Menu items are elegantly displayed and grouped by course (`Specials`, `Starter`, `Main Course`, etc.) using a `SectionList`.
-   **Separate Drink Handling:** Drinks are categorized into "Hot" and "Cold" sections for clarity.
-   **Item Filtering:** Users can filter the menu to view only items from a specific course.
-   **Shopping Cart:** Customers can add items to their order and view the running total at checkout.
-   **Admin - Add Items:** A dedicated screen for the Chef to add new food or drink items. For food, the Chef can add a name, description, price, and upload an image.
-   **Admin - Remove Items:** An intuitive interface for the Chef to select and remove multiple items from the menu at once.
-   **Centralized State Management:** Menu and drink data is managed in the root `App.tsx` component and passed down to all screens, ensuring data consistency.

## 3. Screens

#### `LoginScreen.tsx`
-   The entry point of the application.
-   Users enter a username and password.
-   Logging in as "chef" navigates to the `AdminWelcomeScreen`; otherwise, it proceeds to the `MenuScreen`.

#### `AdminWelcomeScreen.tsx`
-   A dashboard exclusive to the Chef.
-   Provides quick navigation to the Menu, Filter, and Edit Menu screens.

#### `MenuScreen.tsx`
-   The central hub of the application.
-   Displays all menu items and drinks.
-   Shows statistics like the total number of items and the average price per course.
-   Provides navigation to Checkout, Filter, and (for admins) Remove Items.

#### `FilterByCourseScreen.tsx`
-   Allows users to view menu items belonging to a single course (e.g., only "Desserts").
-   Includes a horizontal scroll view for easy category selection.

#### `EditMenuScreen.tsx`
-   An admin-only form for adding new items.
-   Dynamically adjusts fields based on whether a food item or a drink is being added.
-   Features image uploading capabilities using `expo-image-picker`.

#### `RemoveItemsScreen.tsx`
-   An admin-only screen where items can be marked for deletion.
-   Users can select multiple food and drink items and confirm their removal with a single "Save" action.

#### `CheckoutScreen.tsx`
-   Displays a summary of all items the user has added to their order.
-   Calculates and shows the final total.

## 4. Technology Stack

-   **Framework:** React Native (with Expo)
-   **Language:** TypeScript
-   **Navigation:** React Navigation (`@react-navigation/stack`)
-   **UI Components:**
    -   `@react-native-picker/picker` for dropdowns.
    -   Core React Native components (`View`, `Text`, `SectionList`, `ImageBackground`, etc.).
-   **Utilities:** `expo-image-picker` for accessing the device's media library.

## 5. How to Run the Project

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npx expo start
    ```

4.  **Open the app:**
    -   Scan the QR code with the Expo Go app on your iOS or Android device.
    -   Press `a` to run on an Android Emulator.
    -   Press `w` to run in a web browser.

---
**Login Credentials:**
-   **Admin:** Username: `chef` (password can be anything)
-   **Customer:** Username: any name other than `chef`
