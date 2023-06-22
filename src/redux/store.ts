import { configureStore } from '@reduxjs/toolkit';
import pokemonsReducer from './pokemonsSlice';
import pokemonDetailsReducer from './pokemonDetailsSlice';

export const store = configureStore({
  reducer: {
    pokemons: pokemonsReducer,
    pokemonDetails: pokemonDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
