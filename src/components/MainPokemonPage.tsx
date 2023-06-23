import React, { useEffect } from 'react';
import PokemonsTable from './PokemonsTable';
import { fetchPokemons } from '../redux/pokemonsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { CircularProgress, Divider, Snackbar, Stack, Typography } from '@mui/material';
import { Alert } from '@mui/material';
import PokemonDetails from './PokemonDetails';
import { styled } from '@mui/system';

const MainPokemonSection = styled('div')({
  margin: '2rem'
});

const MainPokemonPage = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state: { pokemons: { status: unknown; }; }) => state.pokemons.status);
  const error = useAppSelector((state) => state.pokemons.error);
  let content;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPokemons());
    }
  }, [status]);

  if (status === 'loading') {
    content = <CircularProgress />;
  } else if (status === 'succeeded') {
    content = (<Stack direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2} ><PokemonsTable /><PokemonDetails /></Stack>);
  }

  return (
    <MainPokemonSection>
      <Stack spacing={4} >
        <Stack direction="column"
          justifyContent="center"
          alignItems="center">
          <Typography variant="h3">Welcome to Pokedex</Typography>
        </Stack>
        {content}
      </Stack>
      <Snackbar open={status === 'failed'} autoHideDuration={6000}>
        <Alert severity="error">{error || 'Unknown error occured'}</Alert>
      </Snackbar>
    </MainPokemonSection>
  );
};

export default MainPokemonPage;
