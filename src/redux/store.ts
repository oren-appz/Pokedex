import { configureStore } from '@reduxjs/toolkit';
import pokemonsReducer from './pokemonsSlice';
import pokemonDetailsReducer from './pokemonDetailsSlice';
import pokemonEvolutionReducer from './pokemonEvolutionsSlice';
import pokemonSpeciesReducer from './pokemonSpeciesSlice';

export const store = configureStore({
  reducer: {
    pokemons: pokemonsReducer,
    pokemonDetails: pokemonDetailsReducer,
    pokemonEvolution: pokemonEvolutionReducer,
    pokemonSpecies: pokemonSpeciesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
