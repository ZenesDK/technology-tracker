// components/ProgressBar.jsx
import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  progress = 0, 
  label = 'Прогресс', 
  color = '#4CAF50', 
  animated = false,
  height = 20,
  showPercentage = true,
  showInnerText = false,
  className = '',
  size
}) => {
  // Ограничиваем прогресс между 0 и 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Определяем класс размера
  const sizeClass = size || (
    height <= 8 ? 'sm' : 
    height <= 12 ? 'md' : 
    height <= 20 ? 'lg' : 'xl'
  );

  const progressStyle = {
    width: `${normalizedProgress}%`,
    backgroundColor: color,
  };

  return (
    <div className={`progress-bar-container progress-bar-${sizeClass} ${className}`.trim()}>
      {/* Заголовок с меткой и процентом - ВНЕ прогресс-бара */}
      <div className="progress-bar-header">
        {label && <span className="progress-bar-label">{label}</span>}
        {showPercentage && (
          <span className="progress-bar-percentage">{normalizedProgress}%</span>
        )}
      </div>
      
      {/* Сам прогресс-бар - только визуальная полоса */}
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-track"
          style={{ height: `${height}px` }}
        >
          <div 
            className={`progress-bar-fill ${animated ? 'animated' : ''}`}
            style={progressStyle}
          >
            {showInnerText && normalizedProgress > 25 && (
              <span className="progress-bar-inner-text">{normalizedProgress}%</span>
            )}
            {animated && <div className="progress-bar-shimmer"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;