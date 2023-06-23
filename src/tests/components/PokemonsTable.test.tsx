import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PokemonsTable from '../../components/PokemonsTable';
const mockStore = configureMockStore([thunk]);

describe('PokemonsTable', () => {
    it('renders the table with pokemons', () => {
        const store = mockStore({
            pokemons: {
                pokemons: [
                    { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                    { id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
                ],
                status: 'succeeded',
            },
            pokemonDetails: {
                pokemonDetails: null,
                status: 'idle',
            },
        });

        render(
            <Provider store={store}>
                <PokemonsTable />
            </Provider>
        );

        const header = screen.getByText(/Pokemon Name/i);
        expect(header).toBeInTheDocument();

        const firstPokemon = screen.getByText(/bulbasaur/i);
        expect(firstPokemon).toBeInTheDocument();

        const secondPokemon = screen.getByText(/ivysaur/i);
        expect(secondPokemon).toBeInTheDocument();
    });
});
