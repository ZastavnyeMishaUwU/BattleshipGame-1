// Модальне вікно завершення гри
import GameOverModal from '@/components/widgets/game-over-modal';

// Хук для доступу до контексту гри
import { useAppContext } from '@/context/app-context';

// Перелічення режимів гри: null, setting, play
import { Mode } from '@/types';

// React-хуки
import { useState } from 'react';

// Різні етапи інтерфейсу
import GameView from './views/game-view';
import MenuView from './views/menu-view';
import SetupView from './views/setup-view';

// Провайдер для drag-and-drop кораблів
import ShipDndProvider from './components/providers/ship-dnd-provider';

function App() {
  // Поточний режим гри: меню → налаштування → гра
  const [mode, setMode] = useState<Mode>(Mode.null);

  // Функції з контексту: генерація поля комп’ютера та скидання гри
  const { generateRandomComputerField, resetGame } = useAppContext();

  // Завершення гри: скидання гри + повернення до меню
  const handleEndGame = () => {
    resetGame();
    setMode(Mode.null);
  };

  return (
      <main className="flex justify-center flex-col items-center w-full max-w-7xl mx-auto min-h-screen">
        {/* Режим: меню (початок гри) */}
        {mode === Mode.null && (
            <MenuView
                onStartSetup={() => {
                  setMode(Mode.setting); // Переходимо до налаштування
                }}
            />
        )}

        {/* Режим: розстановка кораблів */}
        {mode === Mode.setting && (
            <ShipDndProvider>
              <SetupView
                  onStartGame={() => {
                    generateRandomComputerField(); // Генеруємо поле для комп’ютера
                    setMode(Mode.play); // Переходимо до гри
                  }}
              />
            </ShipDndProvider>
        )}

        {/* Режим: активна гра */}
        {mode === Mode.play && <GameView onEndGame={handleEndGame} />}

        {/* Модалка завершення гри (показується автоматично при перемозі/поразці) */}
        <GameOverModal onClose={handleEndGame} />
      </main>
  );
}

export default App;
