// hooks/useTechnologiesApi.js
import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// Mock API сервис для имитации реального API
const mockApiService = {
  // Имитация загрузки технологий из API
  async fetchTechnologies() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 1001, // Используем большие ID чтобы избежать конфликтов
        title: 'React',
        description: 'Библиотека для создания пользовательских интерфейсов',
        category: 'frontend',
        status: 'not-started',
        notes: '',
        difficulty: 'beginner',
        resources: ['https://react.dev', 'https://ru.reactjs.org'],
        estimatedHours: 40
      },
      {
        id: 1002,
        title: 'Node.js',
        description: 'Среда выполнения JavaScript на сервере',
        category: 'backend', 
        status: 'not-started',
        notes: '',
        difficulty: 'intermediate',
        resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/'],
        estimatedHours: 60
      },
      {
        id: 1003,
        title: 'TypeScript',
        description: 'Типизированное надмножество JavaScript',
        category: 'language',
        status: 'not-started',
        notes: '',
        difficulty: 'intermediate',
        resources: ['https://www.typescriptlang.org'],
        estimatedHours: 35
      },
      {
        id: 1004,
        title: 'MongoDB',
        description: 'Документоориентированная NoSQL база данных',
        category: 'database',
        status: 'not-started',
        notes: '',
        difficulty: 'intermediate',
        resources: ['https://www.mongodb.com'],
        estimatedHours: 45
      },
      {
        id: 1005,
        title: 'Docker',
        description: 'Платформа для контейнеризации приложений',
        category: 'devops',
        status: 'not-started',
        notes: '',
        difficulty: 'advanced',
        resources: ['https://www.docker.com'],
        estimatedHours: 30
      }
    ];
  },

  // Имитация поиска технологий
  async searchTechnologies(query) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const allTechs = await this.fetchTechnologies();
    return allTechs.filter(tech => 
      tech.title.toLowerCase().includes(query.toLowerCase()) ||
      tech.description.toLowerCase().includes(query.toLowerCase()) ||
      tech.category.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Имитация загрузки дополнительных ресурсов
  async fetchAdditionalResources(techId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const resourcesMap = {
      1001: [
        'https://reactpatterns.com/',
        'https://github.com/enaqx/awesome-react'
      ],
      1002: [
        'https://nodejs.org/en/docs/guides/',
        'https://github.com/sindresorhus/awesome-nodejs'
      ],
      1003: [
        'https://www.typescriptlang.org/docs/',
        'https://github.com/dzharii/awesome-typescript'
      ]
    };
    
    return resourcesMap[techId] || [];
  }
};

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Загрузка технологий из API
  const fetchTechnologiesFromApi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiTechnologies = await mockApiService.fetchTechnologies();
      
      // Объединяем с существующими технологиями, избегая дубликатов по названию
      setTechnologies(prev => {
        const existingTitles = new Set(prev.map(tech => tech.title.toLowerCase()));
        const newTechnologies = apiTechnologies.filter(tech => 
          !existingTitles.has(tech.title.toLowerCase())
        );
        return [...prev, ...newTechnologies];
      });
      
    } catch (err) {
      setError('Не удалось загрузить технологии из API');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  }, [setTechnologies]);

  // Поиск технологий с debounce
  const searchTechnologies = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await mockApiService.searchTechnologies(query);
      setSearchResults(results);
    } catch (err) {
      setError('Ошибка поиска технологий');
      console.error('Ошибка поиска:', err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Загрузка дополнительных ресурсов
  const fetchAdditionalResources = useCallback(async (techId) => {
    try {
      const resources = await mockApiService.fetchAdditionalResources(techId);
      
      // Обновляем технологию с новыми ресурсами
      setTechnologies(prev => 
        prev.map(tech => 
          tech.id === techId 
            ? { 
                ...tech, 
                resources: [...(tech.resources || []), ...resources] 
              }
            : tech
        )
      );
      
      return resources;
    } catch (err) {
      setError('Не удалось загрузить дополнительные ресурсы');
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    }
  }, [setTechnologies]);

  // Импорт технологии из поиска
  const importTechnology = useCallback((tech) => {
    setTechnologies(prev => {
      const exists = prev.find(t => t.title.toLowerCase() === tech.title.toLowerCase());
      if (exists) {
        alert(`Технология "${tech.title}" уже есть в вашем трекере!`);
        return prev;
      }
      
      const importedTech = { 
        ...tech, 
        id: Date.now(), // Генерируем новый ID для импортированной технологии
        status: 'not-started',
        notes: '',
        importedAt: new Date().toISOString()
      };
      
      alert(`Технология "${tech.title}" успешно добавлена в трекер!`);
      return [...prev, importedTech];
    });
  }, [setTechnologies]);

  // Существующие функции из useTechnologies
  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  }, [setTechnologies]);

  const updateNotes = useCallback((techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  }, [setTechnologies]);

  const addTechnology = useCallback((newTech) => {
    const techWithId = {
      ...newTech,
      id: Date.now(),
      status: 'not-started',
      notes: '',
      resources: newTech.resources || []
    };
    setTechnologies(prev => [...prev, techWithId]);
    return techWithId;
  }, [setTechnologies]);

  const removeTechnology = useCallback((techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  }, [setTechnologies]);

  // Расчет прогресса
  const calculateProgress = useCallback(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  const progress = calculateProgress();

  return {
    // Данные
    technologies,
    loading,
    error,
    searchResults,
    searchLoading,
    
    // API функции
    fetchTechnologiesFromApi,
    searchTechnologies,
    fetchAdditionalResources,
    importTechnology,
    
    // Локальные функции
    updateStatus,
    updateNotes,
    addTechnology,
    removeTechnology,
    
    // Статистика
    progress,
    completedCount: technologies.filter(tech => tech.status === 'completed').length,
    inProgressCount: technologies.filter(tech => tech.status === 'in-progress').length,
    totalCount: technologies.length
  };
}

export default useTechnologiesApi;