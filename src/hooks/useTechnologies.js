// hooks/useTechnologies.js
import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение функциональных компонентов, JSX и пропсов', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript и работа с файловой системой', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 3, 
    title: 'HTML & CSS', 
    description: 'Семантическая верстка, Flexbox, Grid и адаптивный дизайн', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'Express.js', 
    description: 'Создание REST API и middleware в Node.js', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  { 
    id: 5, 
    title: 'React Hooks', 
    description: 'useState, useEffect, useContext и создание кастомных хуков', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 6, 
    title: 'MongoDB', 
    description: 'Работа с NoSQL базой данных и Mongoose ODM', 
    status: 'not-started',
    notes: '',
    category: 'backend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  }, [setTechnologies]);

  // Функция для обновления заметок
  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  }, [setTechnologies]);

  // Функция для отметки всех технологий как выполненных
  const markAllCompleted = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  }, [setTechnologies]);

  // Функция для сброса всех статусов
  const resetAllStatuses = useCallback(() => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  }, [setTechnologies]);

  // Функция для добавления новой технологии
  const addTechnology = useCallback((newTech) => {
    const techWithId = {
      ...newTech,
      id: Date.now(), // Простой способ генерации ID
      status: 'not-started',
      notes: ''
    };
    setTechnologies(prev => [...prev, techWithId]);
  }, [setTechnologies]);

  // Функция для удаления технологии
  const removeTechnology = useCallback((techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  }, [setTechnologies]);

  // Функция для расчета общего прогресса
  const calculateProgress = useCallback(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  // Функция для получения статистики по категориям
  const getCategoryStats = useCallback(() => {
    const categories = {};
    technologies.forEach(tech => {
      if (!categories[tech.category]) {
        categories[tech.category] = { 
          total: 0, 
          completed: 0,
          inProgress: 0,
          notStarted: 0
        };
      }
      categories[tech.category].total++;
      if (tech.status === 'completed') {
        categories[tech.category].completed++;
      } else if (tech.status === 'in-progress') {
        categories[tech.category].inProgress++;
      } else {
        categories[tech.category].notStarted++;
      }
    });
    return categories;
  }, [technologies]);

  // Мемоизированные значения
  const progress = useMemo(() => calculateProgress(), [calculateProgress]);
  const categoryStats = useMemo(() => getCategoryStats(), [getCategoryStats]);
  const completedCount = useMemo(() => 
    technologies.filter(tech => tech.status === 'completed').length, 
    [technologies]
  );
  const inProgressCount = useMemo(() => 
    technologies.filter(tech => tech.status === 'in-progress').length, 
    [technologies]
  );

  return {
    technologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    addTechnology,
    removeTechnology,
    progress,
    categoryStats,
    completedCount,
    inProgressCount,
    totalCount: technologies.length
  };
}

export default useTechnologies;