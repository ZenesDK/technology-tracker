// AppMUI.jsx
import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lightTheme, darkTheme } from './styles/theme';
import { NotificationProvider } from './components/NotificationProvider';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ThemeToggle from './components/ThemeToggle';

function AppMUI() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => 
    darkMode ? darkTheme : lightTheme,
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            backgroundColor: 'background.default'
          }}>
            {/* Навигация с переключателем темы */}
            <Box sx={{ position: 'relative' }}>
              <Navigation />
              <ThemeToggle 
                darkMode={darkMode} 
                onToggle={toggleTheme} 
              />
            </Box>
            
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Container maxWidth="xl">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/technologies" element={<TechnologyList />} />
                  <Route path="/technology/:techId" element={<TechnologyDetail />} />
                  <Route path="/add-technology" element={<AddTechnology />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Резервный маршрут для 404 */}
                  <Route path="*" element={
                    <Box 
                      display="flex" 
                      flexDirection="column" 
                      alignItems="center" 
                      justifyContent="center" 
                      minHeight="60vh"
                      textAlign="center"
                    >
                      <Box sx={{ fontSize: '4rem', mb: 2 }}>🔍</Box>
                      <h1 style={{ margin: '0 0 16px 0', color: theme.palette.text.primary }}>
                        Страница не найдена
                      </h1>
                      <p style={{ margin: '0 0 24px 0', color: theme.palette.text.secondary }}>
                        Запрошенная страница не существует.
                      </p>
                      <a href="/" style={{ 
                        textDecoration: 'none',
                        padding: '12px 24px',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '8px',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        На главную
                      </a>
                    </Box>
                  } />
                </Routes>
              </Container>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default AppMUI;