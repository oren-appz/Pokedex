import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import FetchPokemon from '../components/MainPokemonPage';

test('renders loading state initially', () => {
  render(
    <Provider store={store}>
      <FetchPokemon />
    </Provider>
  );
  const loadingElement = screen.getByRole('progressbar');
  expect(loadingElement).toBeInTheDocument();
});
