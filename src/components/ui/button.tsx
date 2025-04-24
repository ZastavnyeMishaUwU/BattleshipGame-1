// Імпортуємо компонент Button із бібліотеки Material-UI
import MUIButton from '@mui/material/Button';
// Імпортуємо типи для функціонального компонента та пропсів із React
import { FC, PropsWithChildren } from 'react';

// Визначаємо інтерфейс для пропсів компонента Button
// Розширюємо PropsWithChildren для підтримки дочірніх елементів
interface ButtonProps extends PropsWithChildren {
  onClick: () => void; // Функція, яка викликається при кліку на кнопку
  disabled?: boolean; // Чи кнопка неактивна (опціонально)
  className?: string; // Додаткові CSS-класи для стилізації (опціонально)
}

// Визначаємо функціональний компонент Button, який обгортає MUI Button
// Параметри: пропси, визначені в ButtonProps
const Button: FC<ButtonProps> = ({
                                   children, // Дочірні елементи (наприклад, текст кнопки)
                                   onClick, // Обробник кліку
                                   disabled, // Стан неактивності
                                   className, // Кастомні CSS-класи
                                 }) => {
  // Повертаємо Material-UI кнопку з налаштованими пропсами
  return (
      <MUIButton
          variant="contained" // Стиль кнопки (заповнена)
          color="primary" // Колір кнопки (основний, зазвичай синій)
          className={className} // Передаємо кастомні CSS-класи
          onClick={onClick} // Передаємо обробник кліку
          disabled={disabled} // Передаємо стан неактивності
      >
        {children}
      </MUIButton>
  );
};

// Експортуємо компонент за замовчуванням
export default Button;