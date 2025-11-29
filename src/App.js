// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router basename="/technology-tracker">
      <div className="app">
        <Navigation />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/technology/:techId" element={<TechnologyDetail />} />
            <Route path="/add-technology" element={<AddTechnology />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Резервный маршрут для 404 */}
            <Route path="*" element={
              <div className="page">
                <div className="error-state">
                  <div className="error-icon">🔍</div>
                  <h1>Страница не найдена</h1>
                  <p>Запрошенная страница не существует.</p>
                  <a href="/technology-tracker/" className="btn btn-primary">
                    На главную
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;