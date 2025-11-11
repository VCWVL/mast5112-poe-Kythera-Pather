import { useMemo } from 'react';
import { MenuItem, DrinksData, Course } from '../App';

export const useMenuStats = (menuItems: MenuItem[], drinksData: DrinksData) => {

  const getAveragePrice = (course: Course): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) {
      return 0;
    }
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  };

  const getAverageDrinkPrice = (drinkType: 'Hot drinks' | 'Cold drinks'): number => {
    const drinkItems = drinksData[drinkType];
    if (drinkItems.length === 0) return 0;
    const total = drinkItems.reduce((sum, item) => sum + item.price, 0);
    return total / drinkItems.length;
  };

  const totalItemCount = useMemo(() => {
    const totalDrinkCount = drinksData['Cold drinks'].length + drinksData['Hot drinks'].length;
    return menuItems.length + totalDrinkCount;
  }, [menuItems, drinksData]);

  return { totalItemCount, getAveragePrice, getAverageDrinkPrice };
};