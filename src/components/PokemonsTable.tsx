import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '../redux/store';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams, GridToolbar } from '@mui/x-data-grid';
import { ThemeProvider } from '@emotion/react';
import { createTheme, Paper } from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { Pokemon } from '../utilities/FetchDataWithCache';
import { fetchPokemonDetails } from '../redux/pokemonDetailsSlice';

const PokemonsTable = () => {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const dispatch = useAppDispatch();
  const [pokemonSelectedUrl, setPokemonSelectionUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonSelectedUrl !== null) {
      dispatch(fetchPokemonDetails(pokemonSelectedUrl));
      setPokemonSelectionUrl(null);
    }
  }, [pokemonSelectedUrl]);

  const pokemons = useSelector((state: RootState) => state.pokemons.pokemons);

  const columns: GridColDef[] = [
    {
      field: 'name', headerName: 'Name', flex: 1,
      width: 50,
      type: 'name',
      renderHeader: () => (<strong>{'Pokemon Name'}<span role="img" aria-label="enjoy">🐱</span></strong>),
    },
  ];

  const rows = pokemons.map((pokemons: Pokemon, index: number) => ({ ...pokemons, id: index + 1 })).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const handleRowClick = (params: GridRowParams) => {
    if (params?.row?.url) {
      setPokemonSelectionUrl(params.row.url);
    }
  };

  return (
    <div style={{ height: '80vh', "minWidth": '35%', margin: "0 5rem" }}>
      <Box sx={{ height: '90%', width: '100%' }}>
        <ThemeProvider theme={theme}>
          <Paper elevation={8} style={{ width: "100%", height: "100%" }}>
            <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} slots={{
              toolbar: GridToolbar,
            }} />
          </Paper>
        </ThemeProvider>
      </Box>
    </div>
  );
};

export default PokemonsTable;

