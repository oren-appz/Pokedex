import React, { } from 'react';
import { Box, Card, CardMedia, CircularProgress, Divider, List, ListItem, ListItemText, Paper, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { PokemonDetails as PokemonDetailsType } from '../utilities/FetchDataWithCache';


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
    const status = useSelector((state: { pokemonDetails: { status: string } }) => state.pokemonDetails.status)
    const pokemonDetails: PokemonDetailsType = useSelector((state: RootState) => state.pokemonDetails.pokemonDetails);

    const textRow = (key: string, value: string) => (<Stack direction="row" spacing={4} ><div style={{ width: '5rem' }}>{key}</div>:<div>{value}</div></Stack>)
    const list = (key: string, values: string[]) => (
        <Stack direction="column" spacing={2} >
            <Typography variant="h6">{key}</Typography>
            <List dense style={{ height: '20rem', overflow: 'auto' }}>
                {values.map(move =>
                    <ListItem key={move}>
                        <ListItemText
                            primary={move}
                        />
                    </ListItem>,
                )}
            </List>
        </Stack >)

    const textDetails = () => (<Stack direction="column" spacing={1} >
        {textRow("Name", pokemonDetails?.name || "")}
        {textRow("Weight", convertHectogramsToPounds(Number(pokemonDetails?.weight)) || "")}
        {textRow("Height", convertDecimetersToFeetInches(Number(pokemonDetails?.height)) || "")}
        {textRow("Abiliites", pokemonDetails?.abilities?.filter((ability: { is_hidden: any; }) => !ability.is_hidden).map((ability: { ability: { name: any; }; }) => ability.ability.name).join(", ") || "")}

    </Stack>)
    const details = () => (<Stack direction="row" spacing={4} >
        <Card sx={{ maxWidth: 250, width: 250 }}>
            <Box position="relative" style={{ height: "100%" }}>
                {status === "loading" ? < CircularProgress style={{
                    position: 'absolute',
                    top: '45%',
                    left: '45%',
                    transform: 'translate(-50%, -50%)',
                }} /> : null}
                <CardMedia
                    sx={{ height: 250 }}
                    component="img"
                    image={pokemonDetails?.sprites?.other["official-artwork"]["front_default"]}
                    alt='loading...'
                    style={{ display: status === "loading" ? "none" : "block" }}
                /></Box>
        </Card>{textDetails()}<Divider orientation="vertical" flexItem /> {list("Moves", pokemonDetails?.moves?.map((move: { move: { name: any; }; }) => move.move.name) || [])}</Stack>)
    return (
        <ThemeProvider theme={theme}>
            <Paper elevation={24} style={{ padding: '5rem', maxWidth: '100vw', width: "100%", height: "100%" }}>
                {pokemonDetails?.sprites?.front_default ? details() : <Typography variant="h6"> Choose a pokemon on the left to see its details</Typography>}
            </Paper>
        </ThemeProvider>
    );
};

export default PokemonDetails;
