import React, { Fragment, useEffect } from 'react';
import { Box, Card, CardMedia, CircularProgress, Divider, List, ListItem, ListItemText, Paper, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { PokemonDetails as PokemonDetailsType } from '../utilities/FetchDataWithCache';
import { styled } from '@mui/system';
import { useAppDispatch } from '../redux/hooks';
import { fetchPokemonDetails } from '../redux/pokemonDetailsSlice';
import { fetchPokemonEvolutions } from '../redux/pokemonEvolutionsSlice';
import { fetchPokemonSpecies } from '../redux/pokemonSpeciesSlice';

const TextItem = styled('div')({
    width: '5rem'
});


const convertHectogramsToPounds = (hectograms: number): string => {
    const conversionFactor = 0.2204623; // Conversion factor from hectograms to pounds
    const pounds = Math.round(hectograms * conversionFactor);
    return `${pounds} lbs`;
}

const convertDecimetersToFeetInches = (decimeters: number): string => {
    const inchesPerDecimeter = 3.93701;
    const inchesPerFoot = 12;
    const totalInches = decimeters * inchesPerDecimeter;
    const feet = Math.floor(totalInches / inchesPerFoot);
    const inches = Math.round(totalInches % inchesPerFoot);
    return `${feet}' ${inches}"`;
}

const PokemonDetails: React.FC = () => {
    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });
    const status = useSelector((state: { pokemonDetails: { status: string } }) => state.pokemonDetails?.status)
    const pokemonEvolutions = useSelector((state: RootState) => state.pokemonEvolution)
    const pokemonSpecies = useSelector((state: RootState) => state.pokemonSpecies?.species)
    const pokemonDetails: PokemonDetailsType = useSelector((state: RootState) => state.pokemonDetails?.pokemonDetails);
    const pokemons = useSelector((state: RootState) => state.pokemons?.pokemons);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (pokemonDetails?.species?.url) {
            dispatch(fetchPokemonSpecies(pokemonDetails));
        }
        if (pokemonDetails?.name) {
            dispatch(fetchPokemonEvolutions(pokemonDetails?.name));
        }
    }, [pokemonDetails]);

    const textRow = (key: string, value: string) => (<Stack direction="row" spacing={4} ><TextItem>{key}</TextItem>:<div>{value}</div></Stack>)
    const list = (key: string, values: string[]) => (
        <Stack direction="column" spacing={2} >
            <Typography variant="h6">{key}</Typography>
            <List dense sx={{ height: '20rem', overflow: 'auto' }}>
                {values.map(move =>
                    <ListItem key={move}>
                        <ListItemText
                            primary={move}
                        />
                    </ListItem>,
                )}
            </List>
        </Stack >)

    const selectNewPokemon = (name: string) => {
        const pokemon = pokemons.find((pokemon) => pokemon.name === name)
        if (pokemon) {
            dispatch(fetchPokemonDetails(pokemon.url));
        } else {
            console.error("Could not show evolution")
        }
    }

    const imageLink = (direction: string, name: string, id: string) => (
        <Fragment>
            <Stack direction="column" spacing={2}>
                <Typography >{direction}{name}</Typography>
                {id !== "" ?
                    <img width="50" style={{ cursor: "pointer" }} onClick={() => selectNewPokemon(name)}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        alt={name} />
                    : ""
                }
            </Stack>
        </Fragment>
    )

    const extractNumberFromUrl = (url: string | undefined | null) => {
        if (!url) return ""
        const segments = url.split('/');
        const numberSegment = segments.filter(segment => segment).pop();
        return numberSegment;
    }
    const evolutionsSection = () => {
        if (pokemonEvolutions?.status == "succeeded") {
            const from = pokemonEvolutions?.evolution.evolvesFrom;
            const to = pokemonEvolutions?.evolution.evolvesTo[0];
            return (
                <Fragment>
                    <Typography variant="h5"> -- Evolution --</Typography>
                    <Stack direction="row" spacing={3}>
                        {from?.name && from?.url ? imageLink("From :", from?.name || "", extractNumberFromUrl(from?.url) || "") : null}
                        {to?.name && to?.url ? imageLink("To :", to?.name || "", extractNumberFromUrl(to?.url) || "") : null}
                    </Stack>
                </Fragment>
            )
        }
    }


    const textDetails = () => (<Stack direction="column" spacing={1} >
        {textRow("Name", pokemonDetails?.name || "")}
        {textRow("Weight", convertHectogramsToPounds(Number(pokemonDetails?.weight)) || "")}
        {textRow("Height", convertDecimetersToFeetInches(Number(pokemonDetails?.height)) || "")}
        {textRow("Abiliites", pokemonDetails?.abilities?.filter((ability: { is_hidden: boolean; }) => !ability.is_hidden).map((ability: { ability: { name: string; }; }) => ability.ability.name).join(", ") || "")}
        {textRow("Species", pokemonSpecies?.name || "")}
        {textRow("Genera", pokemonSpecies?.genera || "")}
        {evolutionsSection()}
    </Stack>)
    const details = () => (<Stack direction="row" spacing={4} >
        <Card sx={{ maxWidth: 250, width: 250 }}>
            <Box position="relative" sx={{ height: "100%" }}>
                {status === "loading" ? < CircularProgress sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '45%',
                    transform: 'translate(-50%, -50%)',
                }} /> : null}
                <CardMedia
                    component="img"
                    image={pokemonDetails?.sprites?.other["official-artwork"]["front_default"]}
                    alt='loading...'
                    sx={{ height: 250, display: status === "loading" ? "none" : "block" }}
                /></Box>
        </Card>{textDetails()}<Divider orientation="vertical" flexItem /> {list("Moves", pokemonDetails?.moves?.map((move: { move: { name: string; }; }) => move.move.name) || [])}</Stack>)
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={24} sx={{ padding: '5rem', maxWidth: '100vw', width: "100%", height: "100%" }}>
                {pokemonDetails?.sprites?.front_default ? details() : <Typography variant="h6"> Choose a pokemon on the left to see its details</Typography>}
            </Paper>
        </ThemeProvider>
    );
};

export default PokemonDetails;
