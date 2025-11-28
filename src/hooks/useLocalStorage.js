// hooks/useLocalStorage.js
import { useState } from 'react'; // Убрал useEffect, так как он не используется

function useLocalStorage(key, initialValue) {
  // Получаем сохраненное значение из localStorage при инициализации
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  // Обновляем localStorage при изменении значения
  const setValue = (value) => {
    try {
      // Разрешаем значение быть функцией, как useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Ошибка при записи в localStorage ключа "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;