import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PokemonDetails, fetchData } from '../utilities/FetchDataWithCache';

export interface PokemonDetailState {
  pokemonDetails: PokemonDetails;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonDetailState = {
  pokemonDetails: {} as PokemonDetails,
  status: 'idle',
  error: null,
};

export const fetchPokemonDetails = createAsyncThunk('pokemon/fetchPokemonDetails', async (detailsUrl: string) => {
  const data = await fetchData(detailsUrl);
  return data as PokemonDetails;
});

const pokemonDetailsSlice = createSlice({
  name: 'pokemonDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemonDetails.fulfilled, (state, action: PayloadAction<PokemonDetails>) => {
        state.status = 'succeeded';
        state.pokemonDetails = action.payload;
      })
      .addCase(fetchPokemonDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      })
  },
});

export default pokemonDetailsSlice.reducer;
