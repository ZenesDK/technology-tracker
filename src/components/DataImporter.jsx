// components/DataImporter.jsx
import { useState, useRef } from 'react';
import './DataImporter.css';

function DataImporter({ onImport, existingTechnologies = [] }) {
  const [importError, setImportError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Валидация импортируемых данных
  const validateImportData = (data) => {
    if (!data.technologies || !Array.isArray(data.technologies)) {
      throw new Error('Неверный формат файла: отсутствует массив technologies');
    }

    if (data.technologies.length === 0) {
      throw new Error('Файл не содержит технологий для импорта');
    }

    data.technologies.forEach((tech, index) => {
      if (!tech.title || typeof tech.title !== 'string') {
        throw new Error(`Технология #${index + 1}: отсутствует название`);
      }

      if (!tech.description || typeof tech.description !== 'string') {
        throw new Error(`Технология "${tech.title}": отсутствует описание`);
      }

      if (tech.title.length > 50) {
        throw new Error(`Технология "${tech.title}": название слишком длинное (макс. 50 символов)`);
      }
    });

    return true;
  };

  // Проверка на дубликаты
  const checkForDuplicates = (importedTechs) => {
    const existingTitles = new Set(existingTechnologies.map(tech => tech.title.toLowerCase()));
    const duplicates = importedTechs.filter(tech => 
      existingTitles.has(tech.title.toLowerCase())
    );
    return duplicates;
  };

  // Обработка загруженного файла
  const handleFileUpload = (file) => {
    setImportError('');
    setImportSuccess(false);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const importedData = JSON.parse(fileContent);
        
        validateImportData(importedData);
        
        // Проверяем дубликаты
        const duplicates = checkForDuplicates(importedData.technologies);
        if (duplicates.length > 0) {
          const shouldProceed = window.confirm(
            `Найдено ${duplicates.length} технологий, которые уже есть в вашем трекере. Продолжить импорт?`
          );
          if (!shouldProceed) return;
        }

        // Добавляем импортированные технологии
        const newTechnologies = importedData.technologies.map(tech => ({
          ...tech,
          id: Date.now() + Math.random(), // Новый ID для избежания конфликтов
          status: tech.status || 'not-started',
          notes: tech.notes || '',
          importedAt: new Date().toISOString()
        }));

        onImport(newTechnologies);
        setImportSuccess(true);
        
        // Сбрасываем инпут файла
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } catch (error) {
        setImportError(`Ошибка импорта: ${error.message}`);
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка чтения файла. Убедитесь, что файл не поврежден.');
    };

    reader.readAsText(file);
  };

  // Обработчик выбора файла
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
      } else {
        setImportError('Поддерживаются только JSON файлы');
      }
    }
  };

  // Обработчики drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="data-importer">
      <div className="importer-header">
        <h3>📥 Импорт данных</h3>
        <p>Загрузите технологии из файла</p>
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${importError ? 'error' : ''} ${importSuccess ? 'success' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelectFile}
      >
        <div className="drop-zone-content">
          <div className="drop-icon">📁</div>
          <p className="drop-text">
            {isDragging ? 'Отпустите файл здесь' : 'Перетащите JSON файл сюда или нажмите для выбора'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>
      </div>

      {importError && (
        <div className="import-error">
          <span className="error-icon">❌</span>
          <div className="error-content">
            <strong>Ошибка импорта</strong>
            <p>{importError}</p>
          </div>
        </div>
      )}

      {importSuccess && (
        <div className="import-success">
          <span className="success-icon">✅</span>
          <div className="success-content">
            <strong>Импорт завершен успешно!</strong>
            <p>Технологии были добавлены в ваш трекер</p>
          </div>
        </div>
      )}

      <div className="import-help">
        <h4>Требования к файлу:</h4>
        <ul>
          <li>📄 Формат: JSON</li>
          <li>🏷️ Обязательные поля: title, description</li>
          <li>📏 Максимальная длина названия: 50 символов</li>
          <li>🔄 Поддерживается структура экспорта этого приложения</li>
        </ul>
      </div>
    </div>
  );
}

export default DataImporter;