// App.js
import React, { useState } from 'react';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import './App.css';

const App = () => {
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'HTML & CSS', 
      description: 'Изучение базовой разметки и стилей для создания веб-страниц.', 
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'JavaScript Basics', 
      description: 'Освоение основ JavaScript: переменные, функции, циклы, условия.', 
      status: 'completed' 
    },
    { 
      id: 3, 
      title: 'React Components', 
      description: 'Изучение функциональных компонентов, JSX и пропсов.', 
      status: 'in-progress' 
    },
    { 
      id: 4, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов через useState hook.', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'React Hooks', 
      description: 'Изучение основных хуков: useEffect, useContext, useReducer.', 
      status: 'not-started' 
    }
  ]);

  // Функция для обновления статуса технологии
  const handleStatusChange = (technologyId, newStatus) => {
    console.log(`Updating tech ${technologyId} to status: ${newStatus}`);
    setTechnologies(prevTechs => 
      prevTechs.map(tech => 
        tech.id === technologyId 
          ? { ...tech, status: newStatus }
          : tech
      )
    );
  };

  // Отладочный вывод
  console.log('Current technologies:', technologies);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Интерактивная дорожная карта</h1>
          <p>Кликайте на карточки для изменения статуса изучения</p>
        </div>
      </header>

      <main className="app-main">
        {/* ProgressHeader теперь получает актуальные данные */}
        <ProgressHeader technologies={technologies} />

        {/* Все технологии с возможностью изменения статуса */}
        <div className="technologies-grid">
          {technologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              title={tech.title}
              description={tech.description}
              initialStatus={tech.status}
              onStatusChange={(newStatus) => handleStatusChange(tech.id, newStatus)}
            />
          ))}
        </div>

        {/* Инструкция */}
        <div className="instruction-panel">
          <h3>📋 Как использовать:</h3>
          <p>Кликайте на любую карточку технологии для циклического переключения статусов:</p>
          <div className="status-cycle">
            <span className="status-demo not-started">не изучено</span>
            <span className="arrow">→</span>
            <span className="status-demo in-progress">в процессе</span>
            <span className="arrow">→</span>
            <span className="status-demo completed">изучено</span>
            <span className="arrow">→</span>
            <span className="status-demo not-started">не изучено</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;