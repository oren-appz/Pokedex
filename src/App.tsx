import React from 'react';
import './App.css';
import MainPokemonPage from './components/MainPokemonPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#616161', // Custom grey color
    },
    background: {
      default: '#424242', // Custom grey color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MainPokemonPage />
    </ThemeProvider>
  );
}

export default App;
