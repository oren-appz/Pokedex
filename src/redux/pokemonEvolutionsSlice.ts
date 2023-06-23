import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchData } from '../utilities/FetchDataWithCache';

const POKEMON_EVOLUTIONS_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
export type EvolutionSepeciesType = { name: string; url: string }

export type EvolutionInfo = {
  evolvesFrom: EvolutionSepeciesType | null,
  evolvesTo: EvolutionSepeciesType[],
};

export interface EvolutionStates {
  evolution: EvolutionInfo;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EvolutionStates = {
  evolution: { evolvesFrom: { name: '', url: '' }, evolvesTo: [] } as EvolutionInfo,
  status: 'idle',
  error: null,
};

export const fetchPokemonEvolutions = createAsyncThunk('pokemon/fetchPokemonEvolutions', async (pokemonName: string) => {

  const speciesData = await fetchData(`${POKEMON_EVOLUTIONS_URL}${pokemonName}`) as any;// eslint-disable-line @typescript-eslint/no-explicit-any
  const evolutionChainData = await fetchData(speciesData.evolution_chain.url) as any;// eslint-disable-line @typescript-eslint/no-explicit-any

  let evolvesFrom: EvolutionInfo | null = null;
  const evolvesTo: EvolutionSepeciesType[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseEvolutions = (evolutionData: any) => {
    if (evolutionData.species.name === pokemonName) {
      if (evolutionData.evolves_to.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        evolutionData.evolves_to.forEach((nextEvolution: any) => evolvesTo.push(nextEvolution.species));
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (evolutionData.evolves_to.some((evo: any) => evo.species.name === pokemonName)) {
        evolvesFrom = evolutionData.species;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      evolutionData.evolves_to.forEach((nextEvolution: any) => parseEvolutions(nextEvolution));
    }
  };

  parseEvolutions(evolutionChainData.chain);
  return {
    evolvesFrom,
    evolvesTo
  } as EvolutionInfo;

});

const pokemonsSlice = createSlice({
  name: 'pokemonEvolutions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonEvolutions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemonEvolutions.fulfilled, (state, action: PayloadAction<EvolutionInfo>) => {
        state.status = 'succeeded';
        state.evolution = action.payload;
      })
      .addCase(fetchPokemonEvolutions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default pokemonsSlice.reducer;