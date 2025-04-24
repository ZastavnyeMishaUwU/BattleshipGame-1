// Імпортуємо React — необхідно для JSX
import React from 'react';

// Імпортуємо метод для створення кореневого вузла React
import ReactDOM from 'react-dom/client';

// Основний компонент додатку
import App from './App.tsx';

// Підключаємо глобальні стилі
import './index.css';

// Провайдер контексту гри — забезпечує доступ до стану гри у всіх компонентах
import AppProvider from './components/providers/app-provider';

// Створюємо React root та рендеримо додаток у <div id="root">
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* Обгортаємо App у AppProvider, щоб увесь додаток мав доступ до контексту */}
        <AppProvider>
            <App />
        </AppProvider>
    </React.StrictMode>
);
