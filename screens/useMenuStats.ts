import { useMemo } from 'react';
import { MenuItem, DrinksData, Course } from '../App';

// This is a custom hook. It's a reusable function that contains logic and state.
// This hook is used to calculate statistics about the menu.
export const useMenuStats = (menuItems: MenuItem[], drinksData: DrinksData) => {

  // Calculates the average price for a specific food course (e.g., 'Starter')
  const getAveragePrice = (course: Course): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) {
      return 0;
    }
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  };

  // Calculates the average price for a specific drink type (hot or cold)
  const getAverageDrinkPrice = (drinkType: 'Hot drinks' | 'Cold drinks'): number => {
    const drinkItems = drinksData[drinkType];
    if (drinkItems.length === 0) return 0;
    const total = drinkItems.reduce((sum, item) => sum + item.price, 0);
    return total / drinkItems.length;
  };

  // Calculates the total number of all items on the menu (food and drinks).
  // useMemo ensures this only recalculates when the menu or drinks data changes.
  const totalItemCount = useMemo(() => {
    const totalDrinkCount = drinksData['Cold drinks'].length + drinksData['Hot drinks'].length;
    return menuItems.length + totalDrinkCount;
  }, [menuItems, drinksData]);

  // The hook returns the functions and values that other components can use.
  return { totalItemCount, getAveragePrice, getAverageDrinkPrice };
};