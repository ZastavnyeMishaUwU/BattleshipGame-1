// Імпортуємо useContext з React — хук для роботи з контекстами
import { useContext } from 'react';

// Імпортуємо наш контекст гри, створений раніше
import AppContext from './app-context';

// Створюємо кастомний хук, який просто обгортає useContext для зручного виклику
export const useAppContext = () => useContext(AppContext);



