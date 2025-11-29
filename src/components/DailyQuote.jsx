// components/DailyQuote.jsx
import React from 'react';
import './DailyQuote.css';

function DailyQuote({ quote, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="daily-quote loading">
        <div className="quote-icon">💭</div>
        <div className="quote-content">
          <div className="quote-text-skeleton"></div>
          <div className="quote-author-skeleton"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div className="daily-quote">
      <div className="quote-icon">💡</div>
      <div className="quote-content">
        <blockquote className="quote-text">
          "{quote.text}"
        </blockquote>
        <cite className="quote-author">— {quote.author}</cite>
      </div>
      <button 
        onClick={onRefresh}
        className="refresh-quote-btn"
        title="Обновить цитату"
      >
        🔄
      </button>
    </div>
  );
}

export default DailyQuote;