// components/Navigation.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Логотип и бренд */}
        <div className="nav-brand">
          <Link to="/" className="brand-link" onClick={closeMobileMenu}>
            <span className="brand-icon">🚀</span>
            <span className="brand-text">TechTracker</span>
          </Link>
        </div>

        {/* Мобильное меню кнопка */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Переключить меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Навигационные ссылки */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Главная</span>
          </Link>

          <Link 
            to="/technologies" 
            className={`nav-link ${isActiveLink('/technologies') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">💻</span>
            <span className="nav-text">Технологии</span>
          </Link>

          <Link 
            to="/add-technology" 
            className={`nav-link ${isActiveLink('/add-technology') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Добавить</span>
          </Link>

          <Link 
            to="/statistics" 
            className={`nav-link ${isActiveLink('/statistics') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Статистика</span>
          </Link>

          <Link 
            to="/settings" 
            className={`nav-link ${isActiveLink('/settings') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Настройки</span>
          </Link>
        </div>

        {/* Индикатор текущей страницы для мобильных устройств */}
        <div className="current-page-mobile">
          {isActiveLink('/') && 'Главная'}
          {isActiveLink('/technologies') && 'Технологии'}
          {isActiveLink('/add-technology') && 'Добавить технологию'}
          {isActiveLink('/statistics') && 'Статистика'}
          {isActiveLink('/settings') && 'Настройки'}
        </div>
      </div>

      {/* Overlay для мобильного меню */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  );
}

export default Navigation;