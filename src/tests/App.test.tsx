import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import { render } from '@testing-library/react';
import MainPokemonPage from "../components/MainPokemonPage";
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);
const store = mockStore({
  pokemons: {
    pokemons: [],
    status: 'idle',
    error: null,
  }, pokemonDetails: {
    pokemonDetails: {},
    status: 'idle',
    error: null
  }
}
);

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


test('renders without crashing', () => {
  const { getByText } = render(
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <MainPokemonPage />
      </ThemeProvider>
    </Provider>
  );
  expect(getByText('Welcome to Pokedex')).toBeInTheDocument();
});



export { };