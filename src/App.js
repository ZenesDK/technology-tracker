// App.js
import React from 'react';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import './App.css';

const App = () => {
  const technologies = [
    { 
      id: 1, 
      title: 'HTML & CSS', 
      description: 'Изучение базовой разметки и стилей для создания веб-страниц. Основы семантической верстки, Flexbox, Grid и адаптивного дизайна.', 
      status: 'изучено' 
    },
    { 
      id: 2, 
      title: 'JavaScript Basics', 
      description: 'Освоение основ JavaScript: переменные, функции, циклы, условия. Работа с DOM, событиями и основными структурами данных.', 
      status: 'изучено' 
    },
    { 
      id: 3, 
      title: 'React Components', 
      description: 'Изучение функциональных компонентов, JSX и пропсов. Создание переиспользуемых компонентов и композиция.', 
      status: 'в процессе' 
    },
    { 
      id: 4, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов через useState hook. Подъем состояния и управление данными между компонентами.', 
      status: 'не изучено' 
    },
    { 
      id: 5, 
      title: 'React Hooks', 
      description: 'Изучение основных хуков: useEffect, useContext, useReducer. Создание собственных хуков для переиспользования логики.', 
      status: 'не изучено' 
    },
    { 
      id: 6, 
      title: 'React Router', 
      description: 'Навигация между компонентами в React приложении. Динамические маршруты, защищенные роуты и программная навигация.', 
      status: 'не изучено' 
    }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚀 Дорожная карта Frontend разработчика</h1>
          <p>Отслеживайте свой прогресс в изучении технологий</p>
        </div>
      </header>

      <main className="app-main">
        {/* Добавляем ProgressHeader */}
        <ProgressHeader technologies={technologies} />

        {/* Группировка технологий по статусам */}
        <div className="technology-section">
          <h2 className="section-title in-progress">
            📚 В процессе изучения
          </h2>
          <div className="technologies-grid">
            {technologies
              .filter(tech => tech.status === 'в процессе')
              .map(tech => (
                <TechnologyCard
                  key={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                />
              ))}
          </div>
        </div>

        <div className="technology-section">
          <h2 className="section-title learned">
            ✅ Изученные технологии
          </h2>
          <div className="technologies-grid">
            {technologies
              .filter(tech => tech.status === 'изучено')
              .map(tech => (
                <TechnologyCard
                  key={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                />
              ))}
          </div>
        </div>

        <div className="technology-section">
          <h2 className="section-title upcoming">
            🗓️ Предстоящие технологии
          </h2>
          <div className="technologies-grid">
            {technologies
              .filter(tech => tech.status === 'не изучено')
              .map(tech => (
                <TechnologyCard
                  key={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                />
              ))}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Дорожная карта разработчика • Обновлено: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;