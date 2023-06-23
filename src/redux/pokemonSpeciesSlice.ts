import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PokemonDetails, fetchData } from '../utilities/FetchDataWithCache';

type SpeciesType = { name: string; genera: string }

export interface PokemonsSpeciesState {
  species: SpeciesType;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PokemonsSpeciesState = {
  species: { name: '', genera: '' },
  status: 'idle',
  error: null,
};


export const fetchPokemonSpecies = createAsyncThunk('pokemon/fetchPokemonSpecies', async (pokemon: PokemonDetails) => {
  const speciesUrl = pokemon.species.url;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speciesData = await fetchData(speciesUrl) as any;

  const genera = speciesData?.genera.filter((genus: { language: { name: string; }; }) => genus.language.name === 'en')[0].genus;
  return { name: speciesData.name, genera };
})

const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonSpecies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemonSpecies.fulfilled, (state, action: PayloadAction<SpeciesType>) => {
        state.status = 'succeeded';
        state.species = action.payload;
      })
      .addCase(fetchPokemonSpecies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default pokemonsSlice.reducer;