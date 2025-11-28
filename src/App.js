// App.js
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import Statistics from './components/Statistics';
import QuickActions from './components/QuickActions';
import TechnologyNotes from './components/TechnologyNotes';
import './App.css';

// Выносим начальные данные за пределы компонента
const getInitialTechnologies = () => [
  { 
    id: 1, 
    title: 'HTML & CSS', 
    description: 'Изучение базовой разметки и стилей для создания веб-страниц.', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 2, 
    title: 'JavaScript Basics', 
    description: 'Освоение основ JavaScript: переменные, функции, циклы, условия.', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 3, 
    title: 'React Components', 
    description: 'Изучение функциональных компонентов, JSX и пропсов.', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 4, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов через useState hook.', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 5, 
    title: 'React Hooks', 
    description: 'Изучение основных хуков: useEffect, useContext, useReducer.', 
    status: 'not-started',
    notes: ''
  }
];

const App = () => {
  // Состояние для хранения массива технологий
  const [technologies, setTechnologies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для подсветки выбранной технологии
  const [highlightedTech, setHighlightedTech] = useState(null);
  
  // Ref для хранения таймера подсветки
  const highlightTimerRef = useRef(null);

  // Шаг 3: Загрузка из localStorage при запуске
  useEffect(() => {
    console.log('🔍 Загрузка данных из localStorage...');
    const savedData = localStorage.getItem('techTrackerData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Данные загружены из localStorage:', parsedData);
        
        // Проверяем, что данные корректны и содержат заметки
        const validatedData = parsedData.map(tech => ({
          ...tech,
          notes: tech.notes || '' // Гарантируем наличие поля notes
        }));
        
        setTechnologies(validatedData);
      } catch (error) {
        console.error('❌ Ошибка при загрузке данных из localStorage:', error);
        // Если данные повреждены, используем начальные данные
        console.log('🔄 Используем начальные данные из-за ошибки');
        setTechnologies(getInitialTechnologies());
      }
    } else {
      console.log('📝 localStorage пуст, используем начальные данные');
      setTechnologies(getInitialTechnologies());
    }
    
    setIsLoading(false);
  }, []);

  // Шаг 2: Автосохранение в localStorage
  useEffect(() => {
    if (technologies.length > 0 && !isLoading) {
      console.log('💾 Сохранение данных в localStorage:', technologies);
      localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    }
  }, [technologies, isLoading]);

  // Фильтрация технологий по поисковому запросу
  const searchFilteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) {
      return technologies;
    }
    
    const query = searchQuery.toLowerCase();
    return technologies.filter(tech =>
      tech.title.toLowerCase().includes(query) ||
      tech.description.toLowerCase().includes(query) ||
      (tech.notes && tech.notes.toLowerCase().includes(query))
    );
  }, [technologies, searchQuery]);

  // Комбинированная фильтрация: поиск + статус
  const filteredTechnologies = useMemo(() => {
    let result = searchFilteredTechnologies;
    
    switch (activeFilter) {
      case 'not-started':
        return result.filter(tech => tech.status === 'not-started');
      case 'in-progress':
        return result.filter(tech => tech.status === 'in-progress');
      case 'completed':
        return result.filter(tech => tech.status === 'completed');
      default:
        return result;
    }
  }, [searchFilteredTechnologies, activeFilter]);

  // Функция для обновления статуса конкретной технологии по id
  const updateTechnologyStatus = useCallback((technologyId, newStatus) => {
    console.log(`🔄 Обновление технологии ${technologyId} на статус: ${newStatus}`);
    
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => 
        technology.id === technologyId 
          ? { 
              ...technology, 
              status: newStatus,
              lastUpdated: new Date().toISOString()
            }
          : technology
      )
    );
  }, []);

  // Шаг 5: Функция обновления заметок
  const updateTechnologyNotes = useCallback((techId, newNotes) => {
    console.log(`📝 Обновление заметок для технологии ${techId}:`, newNotes.substring(0, 50) + '...');
    
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  }, []);

  // Функция для получения следующего статуса в цикле
  const getNextStatus = useCallback((currentStatus) => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  }, []);

  // Функция для обработки клика по карточке
  const handleCardClick = useCallback((technologyId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    updateTechnologyStatus(technologyId, nextStatus);
  }, [getNextStatus, updateTechnologyStatus]);

  // Функции для быстрых действий
  const handleMarkAllCompleted = useCallback(() => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'completed'
      }))
    );
  }, []);

  const handleResetAllStatuses = useCallback(() => {
    setTechnologies(prevTechnologies => 
      prevTechnologies.map(technology => ({
        ...technology,
        status: 'not-started'
      }))
    );
  }, []);

  // Функция для случайного выбора технологии
  const handleRandomSelect = useCallback((technologyId) => {
    console.log(`🎲 Обработка случайного выбора: ${technologyId}`);
    
    // Сбрасываем предыдущую подсветку
    setHighlightedTech(null);
    
    // Очищаем предыдущий таймер
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    
    // Устанавливаем новую подсветку
    setHighlightedTech(technologyId);
    
    // Прокручиваем к выбранной технологии
    const element = document.querySelector(`[data-tech-id="${technologyId}"]`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Добавляем класс анимации
      element.classList.add('highlight-pulse');
      
      // Убираем класс анимации через 2 секунды
      setTimeout(() => {
        element.classList.remove('highlight-pulse');
      }, 2000);
    }
    
    // Автоматически меняем статус на "в процессе", если он "не начат"
    const tech = technologies.find(t => t.id === technologyId);
    if (tech && tech.status === 'not-started') {
      setTimeout(() => {
        updateTechnologyStatus(technologyId, 'in-progress');
      }, 1000);
    }
    
    // Сбрасываем подсветку через 3 секунды
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedTech(null);
    }, 3000);
  }, [technologies, updateTechnologyStatus]);

  // Функция для очистки localStorage (для отладки)
  const clearLocalStorage = useCallback(() => {
    console.log('🗑️ Очистка localStorage...');
    localStorage.removeItem('techTrackerData');
    setTechnologies(getInitialTechnologies());
    console.log('✅ localStorage очищен, загружены начальные данные');
  }, []);

  // Функция для экспорта данных
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(technologies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tech-tracker-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('📤 Данные экспортированы');
  }, [technologies]);

  // Функция для импорта данных
  const importData = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setTechnologies(importedData);
          console.log('📥 Данные импортированы:', importedData);
        } catch (error) {
          console.error('❌ Ошибка при импорте данных:', error);
          alert('Ошибка при импорте файла. Убедитесь, что файл корректный.');
        }
      };
      reader.readAsText(file);
    }
    // Сбрасываем input чтобы можно было выбрать тот же файл снова
    event.target.value = '';
  }, []);

  // Функция для очистки поиска
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Статистика для фильтров (на основе всех технологий)
  const filterStats = {
    all: technologies.length,
    'not-started': technologies.filter(t => t.status === 'not-started').length,
    'in-progress': technologies.filter(t => t.status === 'in-progress').length,
    'completed': technologies.filter(t => t.status === 'completed').length
  };

  // Статистика заметок
  const notesStats = {
    totalNotes: technologies.filter(t => t.notes && t.notes.length > 0).length,
    totalCharacters: technologies.reduce((sum, tech) => sum + (tech.notes?.length || 0), 0),
    techWithNotes: technologies.filter(t => t.notes && t.notes.length > 0).length
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Интерактивная дорожная карта разработчика</h1>
          <p>Управляйте прогрессом изучения технологий. Заметки сохраняются автоматически!</p>
        </div>
      </header>

      <main className="app-main">
        {/* ProgressHeader с актуальными данными */}
        <ProgressHeader technologies={technologies} />

        {/* Статистика */}
        <Statistics technologies={technologies} />

        {/* Поиск технологий */}
        <div className="search-panel">
          <h3 className="search-title">🔍 Поиск технологий</h3>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Поиск по названию, описанию или заметкам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={clearSearch}
                  title="Очистить поиск"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="search-results-info">
              <span className="search-results-count">
                Найдено: <strong>{filteredTechnologies.length}</strong> из <strong>{technologies.length}</strong>
              </span>
              {searchQuery && (
                <span className="search-query">
                  По запросу: "<em>{searchQuery}</em>"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <QuickActions 
          technologies={technologies}
          onMarkAllCompleted={handleMarkAllCompleted}
          onResetAllStatuses={handleResetAllStatuses}
          onRandomSelect={handleRandomSelect}
        />

        {/* Панель управления данными */}
        <div className="data-management-panel">
          <h3>💾 Управление данными</h3>
          <div className="data-actions">
            <button className="btn btn-export" onClick={exportData}>
              📤 Экспорт данных
            </button>
            <label className="btn btn-import">
              📥 Импорт данных
              <input 
                type="file" 
                accept=".json" 
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn btn-clear" onClick={clearLocalStorage}>
              🗑️ Очистить данные
            </button>
          </div>
        </div>

        {/* Панель статистики заметок */}
        <div className="notes-stats-panel">
          <h3>📝 Статистика заметок</h3>
          <div className="notes-stats-grid">
            <div className="notes-stat">
              <span className="notes-stat-number">{notesStats.techWithNotes}</span>
              <span className="notes-stat-label">Технологий с заметками</span>
            </div>
            <div className="notes-stat">
              <span className="notes-stat-number">{notesStats.totalCharacters}</span>
              <span className="notes-stat-label">Всего символов</span>
            </div>
            <div className="notes-stat">
              <span className="notes-stat-number">
                {technologies.length > 0 ? Math.round((notesStats.techWithNotes / technologies.length) * 100) : 0}%
              </span>
              <span className="notes-stat-label">Покрытие заметками</span>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="filters-panel">
          <h3 className="filters-title">🎛️ Фильтры по статусу</h3>
          <div className="filters-grid">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span className="filter-icon">📋</span>
              <span className="filter-text">Все технологии</span>
              <span className="filter-count">{filterStats.all}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'not-started' ? 'active' : ''}`}
              onClick={() => setActiveFilter('not-started')}
            >
              <span className="filter-icon">⏳</span>
              <span className="filter-text">Не начатые</span>
              <span className="filter-count">{filterStats['not-started']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              <span className="filter-icon">🔄</span>
              <span className="filter-text">В процессе</span>
              <span className="filter-count">{filterStats['in-progress']}</span>
            </button>

            <button 
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              <span className="filter-icon">✅</span>
              <span className="filter-text">Выполненные</span>
              <span className="filter-count">{filterStats.completed}</span>
            </button>
          </div>
        </div>

        {/* Отфильтрованные технологии */}
        <div className="technologies-section">
          <h2 className="main-section-title">
            {activeFilter === 'all' && '📋 Все технологии'}
            {activeFilter === 'not-started' && '⏳ Технологии к изучению'}
            {activeFilter === 'in-progress' && '🔄 Технологии в процессе'}
            {activeFilter === 'completed' && '✅ Изученные технологии'}
            {searchQuery && ' 🔍 с поиском'}
            <span className="filtered-count"> ({filteredTechnologies.length})</span>
          </h2>

          {filteredTechnologies.length > 0 ? (
            <div className="technologies-grid">
              {filteredTechnologies.map(tech => (
                <div key={tech.id} className="tech-card-with-notes">
                  <TechnologyCard
                    id={tech.id}
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onStatusChange={handleCardClick}
                    isHighlighted={highlightedTech === tech.id}
                    hasNotes={!!tech.notes && tech.notes.length > 0}
                    searchQuery={searchQuery}
                  />
                  <TechnologyNotes
                    notes={tech.notes}
                    onNotesChange={updateTechnologyNotes}
                    techId={tech.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-filter-message">
              <div className="empty-icon">
                {searchQuery ? '🔍' : '📋'}
              </div>
              <h3>
                {searchQuery ? 'Технологии не найдены' : 'Технологии не найдены'}
              </h3>
              <p>
                {searchQuery && activeFilter === 'all' && `По запросу "${searchQuery}" ничего не найдено`}
                {searchQuery && activeFilter !== 'all' && `По запросу "${searchQuery}" в категории "${activeFilter}" ничего не найдено`}
                {!searchQuery && activeFilter === 'not-started' && 'Все технологии начаты или уже изучены!'}
                {!searchQuery && activeFilter === 'in-progress' && 'Нет технологий в процессе изучения.'}
                {!searchQuery && activeFilter === 'completed' && 'Пока нет изученных технологий.'}
                {!searchQuery && activeFilter === 'all' && 'Дорожная карта пуста. Добавьте технологии!'}
              </p>
              <div className="empty-actions">
                {searchQuery && (
                  <button 
                    className="btn btn-secondary"
                    onClick={clearSearch}
                  >
                    Очистить поиск
                  </button>
                )}
                <button 
                  className="btn btn-primary"
                  onClick={() => setActiveFilter('all')}
                >
                  Показать все технологии
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Отладочная информация */}
        <details className="debug-info">
          <summary>🔍 Отладочная информация</summary>
          <div>
            <h4>Активный фильтр: {activeFilter}</h4>
            <h4>Поисковый запрос: "{searchQuery}"</h4>
            <h4>Отфильтровано: {filteredTechnologies.length} из {technologies.length}</h4>
            <h4>Подсвеченная технология: {highlightedTech || 'нет'}</h4>
            <h4>Заметки: {notesStats.techWithNotes} технологий с заметками</h4>
            <div className="debug-actions">
              <button className="btn btn-secondary" onClick={clearLocalStorage}>
                Очистить localStorage
              </button>
              <button className="btn btn-secondary" onClick={exportData}>
                Экспорт данных
              </button>
              <button className="btn btn-secondary" onClick={clearSearch}>
                Очистить поиск
              </button>
            </div>
            <pre>{JSON.stringify(technologies, null, 2)}</pre>
          </div>
        </details>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Интерактивная дорожная карта • 
            Технологий: {technologies.length} • 
            Заметок: {notesStats.techWithNotes} •
            {searchQuery && ` Поиск: "${searchQuery}" •`}
            Обновлено: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;