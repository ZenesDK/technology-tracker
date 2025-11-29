// hooks/useTechnologiesApi.js
import React, { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

// Real API service
const realApiService = {
  // Получение случайной цитаты о программировании
  async fetchProgrammingQuote() {
    try {
      const response = await fetch('https://programming-quotes-api.herokuapp.com/quotes/random');
      if (!response.ok) throw new Error('Failed to fetch quote');
      const quoteData = await response.json();
      
      return {
        text: quoteData.en,
        author: quoteData.author
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quotes in case API is down
      const fallbackQuotes = [
        { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
        { text: "Sometimes it's better to leave something alone, to pause, and that's very true of programming.", author: "Joyce Wheeler" },
        { text: "Programming is not about what you know; it's about what you can figure out.", author: "Chris Pine" }
      ];
      return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
  },

  // Поиск технологий через публичные API
  async searchTechnologies(query) {
    if (!query.trim()) return [];

    try {
      // Пробуем разные API для поиска
      const results = await Promise.race([
        this.searchWithPublicAPI(query),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);

      return results.length > 0 ? results : this.createFallbackResults(query);

    } catch (error) {
      console.error('Error searching technologies:', error);
      // Fallback на локальные данные если API недоступно
      return this.createFallbackResults(query);
    }
  },

  // Поиск через публичные API (без CORS проблем)
  async searchWithPublicAPI(query) {
    try {
      // Используем API GitHub для поиска репозиториев
      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+topic:javascript&sort=stars&order=desc&per_page=10`);
      
      if (!response.ok) {
        throw new Error('GitHub API failed');
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return [];
      }

      // Преобразуем GitHub репозитории в формат технологий
      return data.items.map((repo, index) => {
        const category = this.determineCategoryFromRepo(repo);
        
        return {
          id: `github-${repo.id}`,
          title: this.formatTechName(repo.name, query),
          description: repo.description || `Open source project related to ${query}`,
          category: category,
          status: 'not-started',
          notes: '',
          difficulty: this.determineDifficulty(repo.stargazers_count),
          resources: [
            repo.html_url,
            repo.homepage
          ].filter(Boolean),
          estimatedHours: this.estimateHoursFromStars(repo.stargazers_count),
          isFromSearch: true,
          source: 'github',
          stars: repo.stargazers_count
        };
      });

    } catch (error) {
      console.error('GitHub search failed:', error);
      return [];
    }
  },

  // Определяем категорию на основе репозитория
  determineCategoryFromRepo(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = repo.topics || [];
    const language = (repo.language || '').toLowerCase();

    // Определяем по языку программирования
    if (['javascript', 'typescript', 'coffeescript'].includes(language)) {
      if (name.includes('react') || name.includes('vue') || name.includes('angular') || 
          description.includes('frontend') || description.includes('ui') || 
          topics.includes('frontend') || topics.includes('react')) {
        return 'frontend';
      }
      return 'backend';
    }

    if (['python', 'java', 'go', 'rust', 'c++', 'c#'].includes(language)) {
      return 'backend';
    }

    if (['html', 'css', 'sass', 'less'].includes(language)) {
      return 'frontend';
    }

    // Определяем по ключевым словам
    const backendKeywords = ['server', 'api', 'framework', 'database', 'backend'];
    const frontendKeywords = ['ui', 'component', 'frontend', 'browser', 'client'];
    const devopsKeywords = ['docker', 'kubernetes', 'deploy', 'ci/cd', 'infrastructure'];
    const databaseKeywords = ['database', 'db', 'mongodb', 'mysql', 'postgres'];

    const allText = `${name} ${description} ${topics.join(' ')}`.toLowerCase();

    if (backendKeywords.some(keyword => allText.includes(keyword))) return 'backend';
    if (frontendKeywords.some(keyword => allText.includes(keyword))) return 'frontend';
    if (devopsKeywords.some(keyword => allText.includes(keyword))) return 'devops';
    if (databaseKeywords.some(keyword => allText.includes(keyword))) return 'database';

    return 'tools';
  },

  // Форматируем название технологии
  formatTechName(repoName, query) {
    // Убираем префиксы и суффиксы
    let name = repoName
      .replace(/^awesome-/, '')
      .replace(/-/g, ' ')
      .replace(/\bjs\b/g, 'JavaScript')
      .replace(/\bts\b/g, 'TypeScript');

    // Делаем первую букву заглавной
    name = name.charAt(0).toUpperCase() + name.slice(1);

    // Если имя слишком общее, используем запрос
    if (name.length < 3 || ['api', 'lib', 'library', 'utils'].includes(name.toLowerCase())) {
      return query.charAt(0).toUpperCase() + query.slice(1);
    }

    return name;
  },

  // Определяем сложность на основе звезд
  determineDifficulty(stars) {
    if (stars > 10000) return 'advanced';
    if (stars > 1000) return 'intermediate';
    return 'beginner';
  },

  // Оцениваем время изучения на основе популярности
  estimateHoursFromStars(stars) {
    if (stars > 50000) return 60;   // Очень популярные - сложные
    if (stars > 10000) return 40;   // Популярные - средние
    if (stars > 1000) return 25;    // Средние - проще
    return 15;                      // Малопопулярные - простые
  },

  // Создаем fallback результаты если API не работают
  createFallbackResults(query) {
    const commonTechs = [
      {
        id: `fallback-${Date.now()}-1`,
        title: query.charAt(0).toUpperCase() + query.slice(1),
        description: `Технология для работы с ${query}`,
        category: 'tools',
        status: 'not-started',
        notes: '',
        difficulty: 'beginner',
        resources: [`https://www.npmjs.com/search?q=${query}`, `https://github.com/topics/${query}`],
        estimatedHours: 20,
        isFromSearch: true,
        source: 'fallback'
      }
    ];

    return commonTechs;
  },

  // Получение популярных репозиториев с GitHub по технологии
  async fetchGitHubRepos(techName) {
    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(techName)}&sort=stars&order=desc&per_page=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub repos');
      }
      
      const data = await response.json();
      
      return data.items.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language
      }));
    } catch (error) {
      console.error(`Error fetching GitHub repos for ${techName}:`, error);
      return this.getFallbackRepos(techName);
    }
  },

  // Fallback репозитории
  getFallbackRepos(techName) {
    return [
      {
        name: `${techName}-official`,
        full_name: `official/${techName}`,
        description: `Official ${techName} repository`,
        html_url: `https://github.com/search?q=${techName}`,
        stars: 1000,
        forks: 100,
        language: 'JavaScript'
      }
    ];
  }
};

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // Загрузка ежедневной цитаты
  const fetchDailyQuote = useCallback(async () => {
    try {
      setQuoteLoading(true);
      const quote = await realApiService.fetchProgrammingQuote();
      setDailyQuote(quote);
      
      // Сохраняем цитату в localStorage на сегодня
      const today = new Date().toDateString();
      localStorage.setItem('dailyQuote', JSON.stringify({
        quote,
        date: today
      }));
      
    } catch (error) {
      console.error('Error fetching daily quote:', error);
      // Используем сохраненную цитату если есть
      const savedQuote = localStorage.getItem('dailyQuote');
      if (savedQuote) {
        const { quote, date } = JSON.parse(savedQuote);
        if (date === new Date().toDateString()) {
          setDailyQuote(quote);
        }
      }
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  // Инициализация ежедневной цитаты
  React.useEffect(() => {
    const savedQuote = localStorage.getItem('dailyQuote');
    if (savedQuote) {
      const { quote, date } = JSON.parse(savedQuote);
      if (date === new Date().toDateString()) {
        setDailyQuote(quote);
      } else {
        fetchDailyQuote();
      }
    } else {
      fetchDailyQuote();
    }
  }, [fetchDailyQuote]);

  // Поиск технологий с использованием реального API
  const searchTechnologies = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      
      // Используем реальный API для поиска
      const results = await realApiService.searchTechnologies(query);
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
      const tech = technologies.find(t => t.id === techId);
      if (!tech) return [];

      // Получаем GitHub репозитории для технологии
      const githubRepos = await realApiService.fetchGitHubRepos(tech.title);
      
      const additionalResources = githubRepos.map(repo => repo.html_url);
      
      // Обновляем технологию с новыми ресурсами
      setTechnologies(prev => 
        prev.map(tech => 
          tech.id === techId 
            ? { 
                ...tech, 
                resources: [...(tech.resources || []), ...additionalResources],
                githubRepos: githubRepos
              }
            : tech
        )
      );
      
      return additionalResources;
    } catch (err) {
      setError('Не удалось загрузить дополнительные ресурсы');
      console.error('Ошибка загрузки ресурсов:', err);
      return [];
    }
  }, [technologies, setTechnologies]);

  // Импорт технологии из поиска
  const importTechnology = useCallback((tech) => {
    setTechnologies(prev => {
      const exists = prev.find(t => t.title.toLowerCase() === tech.title.toLowerCase());
      if (exists) {
        // Используем alert как fallback, если уведомления не подключены
        if (typeof window.showNotification === 'function') {
          window.showNotification(`Технология "${tech.title}" уже есть в вашем трекере!`, 'warning');
        } else {
          alert(`Технология "${tech.title}" уже есть в вашем трекере!`);
        }
        return prev;
      }
      
      const importedTech = { 
        ...tech, 
        id: Date.now(), // Генерируем новый ID
        status: 'not-started',
        notes: '',
        importedAt: new Date().toISOString()
      };
      
      // Используем alert как fallback, если уведомления не подключены
      if (typeof window.showNotification === 'function') {
        window.showNotification(`Технология "${tech.title}" успешно добавлена в трекер!`, 'success');
      } else {
        alert(`Технология "${tech.title}" успешно добавлена в трекер!`);
      }
      
      return [...prev, importedTech];
    });
  }, [setTechnologies]);

  // Массовое добавление технологий (для импорта)
  const addMultipleTechnologies = useCallback((newTechnologies) => {
    setTechnologies(prev => {
      const existingTitles = new Set(prev.map(tech => tech.title.toLowerCase()));
      const technologiesToAdd = newTechnologies.filter(tech => 
        !existingTitles.has(tech.title.toLowerCase())
      );
      
      if (technologiesToAdd.length > 0 && typeof window.showNotification === 'function') {
        window.showNotification(`Успешно импортировано ${technologiesToAdd.length} технологий!`, 'success');
      }
      
      return [...prev, ...technologiesToAdd];
    });
  }, [setTechnologies]);

  // Загрузка стандартных технологий
  const fetchTechnologiesFromApi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Используем alert как fallback, если уведомления не подключены
      if (typeof window.showNotification === 'function') {
        window.showNotification('Нет предустановленных технологий. Используйте поиск для добавления технологий из GitHub!', 'info');
      } else {
        alert('Нет предустановленных технологий. Используйте поиск для добавления технологий из GitHub!');
      }
      
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Существующие функции из useTechnologies
  const updateStatus = useCallback((techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
    
    // Показываем уведомление об изменении статуса
    const tech = technologies.find(t => t.id === techId);
    if (tech && typeof window.showNotification === 'function') {
      const statusText = {
        'not-started': 'Не начато',
        'in-progress': 'В процессе',
        'completed': 'Изучено'
      }[newStatus];
      
      window.showNotification(`Статус "${tech.title}" изменен на "${statusText}"`, 'info');
    }
  }, [technologies, setTechnologies]);

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
      status: newTech.status || 'not-started',
      notes: newTech.notes || '',
      resources: newTech.resources || []
    };
    setTechnologies(prev => [...prev, techWithId]);
    
    // Показываем уведомление о добавлении
    if (typeof window.showNotification === 'function') {
      window.showNotification(`Технология "${newTech.title}" успешно добавлена!`, 'success');
    }
    
    return techWithId;
  }, [setTechnologies]);

  // Функция для удаления одной технологии
  const removeTechnology = useCallback((techId) => {
    const tech = technologies.find(t => t.id === techId);
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
    
    // Показываем уведомление об удалении
    if (tech && typeof window.showNotification === 'function') {
      window.showNotification(`Технология "${tech.title}" удалена`, 'info');
    }
  }, [technologies, setTechnologies]);

  // Функция для удаления всех технологий
  const removeAllTechnologies = useCallback(() => {
    const count = technologies.length;
    setTechnologies([]);
    
    // Показываем уведомление об удалении всех технологий
    if (count > 0 && typeof window.showNotification === 'function') {
      window.showNotification(`Все технологии (${count}) удалены`, 'warning');
    }
  }, [technologies, setTechnologies]);

  // Функция для отметки всех технологий как выполненных
  const markAllCompleted = useCallback(() => {
    const count = technologies.length;
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
    
    // Показываем уведомление
    if (count > 0 && typeof window.showNotification === 'function') {
      window.showNotification(`Все технологии (${count}) отмечены как изученные`, 'success');
    }
  }, [technologies, setTechnologies]);

  // Функция для сброса всех статусов
  const resetAllStatuses = useCallback(() => {
    const count = technologies.length;
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
    
    // Показываем уведомление
    if (count > 0 && typeof window.showNotification === 'function') {
      window.showNotification(`Статусы всех технологий (${count}) сброшены`, 'info');
    }
  }, [technologies, setTechnologies]);

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
    dailyQuote,
    quoteLoading,
    
    // API функции
    fetchTechnologiesFromApi,
    searchTechnologies,
    fetchAdditionalResources,
    fetchDailyQuote,
    importTechnology,
    addMultipleTechnologies,
    
    // Локальные функции
    updateStatus,
    updateNotes,
    addTechnology,
    removeTechnology,
    removeAllTechnologies,
    markAllCompleted,
    resetAllStatuses,
    
    // Статистика
    progress,
    completedCount: technologies.filter(tech => tech.status === 'completed').length,
    inProgressCount: technologies.filter(tech => tech.status === 'in-progress').length,
    totalCount: technologies.length
  };
}

export default useTechnologiesApi;