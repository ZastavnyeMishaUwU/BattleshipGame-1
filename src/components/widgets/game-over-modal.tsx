// Імпортуємо утиліту styled для створення стилізованих компонентів із Material-UI
import { styled } from '@mui/system';
// Імпортуємо компоненти Modal і Typography із Material-UI
import { Modal, Typography } from '@mui/material';
// Імпортуємо кастомний компонент Button
import Button from '@/components/ui/button';
// Імпортуємо хук для доступу до контексту додатку
import { useAppContext } from '@/context/app-context';

// Стилізуємо контейнер для модального вікна
const ModalContainer = styled('div')({
  display: 'flex', // Використовуємо Flex для центрування
  justifyContent: 'center', // Горизонтальне центрування
  alignItems: 'center', // Вертикальне центрування
  position: 'fixed', // Фіксована позиція
  top: '50%', // Розташування по центру екрана (вертикально)
  left: '50%', // Розташування по центру екрана (горизонтально)
  transform: 'translate(-50%, -50%)', // Зміщення для точного центрування
  width: '80%', // Ширина 80% від екрана
  height: 'fit-content', // Висота адаптується до вмісту
});

// Стилізуємо внутрішній контейнер для вмісту модального вікна
const PaperContainer = styled('div')({
  display: 'flex', // Використовуємо Flex для розташування елементів
  justifyContent: 'center', // Горизонтальне центрування
  alignItems: 'center', // Вертикальне центрування
  flexDirection: 'column', // Вертикальне розташування елементів
  backgroundColor: '#ffffff', // Білий фон
  border: '2px solid #000', // Чорна межа
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', // Тінь для глибини
  padding: '16px', // Внутрішні відступи
});

// Визначаємо інтерфейс для пропсів компонента GameOverModal
interface GameOverModalProps {
  onClose: () => void; // Функція для закриття модального вікна
}

// Визначаємо компонент GameOverModal для відображення результату гри
const GameOverModal = ({ onClose }: GameOverModalProps) => {
  // Отримуємо переможця та функцію скидання гри з контексту
  const { winner, resetGame } = useAppContext();

  // Обробник закриття модального вікна
  const handleClose = () => {
    resetGame(); // Скидаємо гру до початкового стану
    onClose(); // Викликаємо функцію закриття
  };

  // Повертаємо розмітку модального вікна
  return (
      // Компонент Modal із Material-UI
      <Modal
          open={winner !== null} // Відкриваємо, якщо є переможець
          onClose={handleClose} // Обробник закриття
          aria-labelledby="game-over-modal-title" // ID для заголовка (доступність)
          aria-describedby="game-over-modal-description" // ID для опису (доступність)
      >
        {/* Контейнер для модального вікна */}
        <ModalContainer>
          {/* Внутрішній контейнер із вмістом */}
          <PaperContainer className="rounded-xl max-w-xl w-full aspect-video h-auto p-5">
            {/* Текст із результатом гри */}
            <Typography
                color="primary" // Основний колір (зазвичай синій)
                variant="h2" // Великий розмір тексту
                id="game-over-modal-description" // ID для доступності
                gutterBottom // Додаємо відступ знизу
            >
              {/* Відображаємо повідомлення залежно від переможця */}
              {winner === 'user' ? 'Ви перемогли!' : 'Ви програли!'}
            </Typography>
            {/* Кнопка для закриття модального вікна */}
            <Button onClick={handleClose}>Закрити</Button>
          </PaperContainer>
        </ModalContainer>
      </Modal>
  );
};

// Експортуємо компонент за замовчуванням
export default GameOverModal;