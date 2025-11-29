// styles/theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#764ba2',
      light: '#9f7aea',
      dark: '#6b46c1',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f3f4',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#667eea',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
    // Заменил прежние обширные глобальные правила на более точечные
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#1f2937',
          backgroundColor: '#f8fafc',
          scrollbarColor: "#6b6b6b #f1f5f9",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#f8fafc",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#cbd5e1",
            minHeight: 24,
          },
        },
        /* Поверхности: карточки, панели, элементы списка — явно приводим к paper цвета темы */
        ".card, .detail-card, .tech-card, .technology-card, .stat-card, .category-card, .resource-item, .controls-card, .tips-card, .data-action, .quick-action": {
          backgroundColor: '#ffffff',
          color: '#1f2937',
          borderColor: '#f1f3f4'
        },
        /* Хедеры/панели */
        ".page-header, .app-header, .header-content": {
          backgroundColor: '#ffffff',
          color: '#1f2937'
        },
        /* Навигация и AppBar — текст должен быть светлым поверх градиента */
        ".MuiAppBar-root, .MuiAppBar-root *": {
          color: '#ffffff'
        },
        /* Кнопки с акцентом — гарантируем читаемый белый текст */
        ".btn-primary, .btn-success, .btn-warning, .btn-danger, .btn-large": {
          color: '#ffffff'
        }
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a5b4fc',
      light: '#c7d2fe',
      dark: '#818cf8',
    },
    secondary: {
      main: '#c4b5fd',
      light: '#ddd6fe',
      dark: '#a78bfa',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    success: {
      main: '#34d399',
    },
    warning: {
      main: '#fbbf24',
    },
    error: {
      main: '#f87171',
    },
    info: {
      main: '#60a5fa',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 4px 15px rgba(165, 180, 252, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(165, 180, 252, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: '#e6eef8',
          backgroundColor: '#0f172a',
          scrollbarColor: "#94a3b8 #0b1220",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#0f172a",
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#334155",
            minHeight: 24,
          },
        },
        /* Поверхности в тёмной теме — использовать paper из darkTheme */
        ".card, .detail-card, .tech-card, .technology-card, .stat-card, .category-card, .resource-item, .controls-card, .tips-card, .data-action, .quick-action": {
          backgroundColor: '#1e293b',
          color: '#e6eef8',
          borderColor: '#334155'
        },
        /* Хедеры/панели в тёмной теме */
        ".page-header, .app-header, .header-content": {
          backgroundColor: 'transparent',
          color: '#e6eef8'
        },
        /* Навигация и AppBar — текст светлый */
        ".MuiAppBar-root, .MuiAppBar-root *": {
          color: '#ffffff'
        },
        /* Кнопки с акцентом — оставить белый текст поверх ярких градиентов */
        ".btn-primary, .btn-success, .btn-warning, .btn-danger, .btn-large": {
          color: '#ffffff'
        }
      },
    },
  },
});