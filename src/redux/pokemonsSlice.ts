import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pokemon, fetchData } from '../utilities/FetchDataWithCache';

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon?limit=30000';

export interface PokemonsState {
  pokemons: Pokemon[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonsState = {
  pokemons: [],
  status: 'idle',
  error: null,
};

export const fetchPokemons = createAsyncThunk('pokemon/fetchPokemon', async () => {
  const data = await fetchData(POKEMON_URL);
  return data?.results as Pokemon[];
});

const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemons.fulfilled, (state, action: PayloadAction<Pokemon[]>) => {
        state.status = 'succeeded';
        state.pokemons = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default pokemonsSlice.reducer;