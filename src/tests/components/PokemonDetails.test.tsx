import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PokemonDetails from '../../components/PokemonDetails';
import '@testing-library/jest-dom';
import { Store, AnyAction } from '@reduxjs/toolkit';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('PokemonDetails Component', () => {
    let store: Store<unknown, AnyAction>;

    beforeEach(() => {
        store = mockStore({
            pokemonDetails: {
                status: 'succeeded',
                pokemonDetails: {
                    name: 'pikachu',
                    weight: 60,
                    height: 4,
                    abilities: [],
                    species: { url: 'some_url' },
                    sprites: {
                        front_default: 'https://nothing.here',
                        other: {
                            'official-artwork': {
                                'front_default': 'some_image_url'
                            }
                        }
                    },
                    moves: [{ move: { name: 'thunder-shock' } }],
                }
            },
            pokemonEvolution: {
                status: 'succeeded',
                evolution: {
                    evolvesFrom: { name: 'pichu', url: 'evolves_from_url' },
                    evolvesTo: [{ name: 'raichu', url: 'evolves_to_url' }],
                },
            },
            pokemonSpecies: {
                status: 'succeeded',
                species: {
                    name: 'pikachu',
                    genera: 'mouse pokemon',
                },
            },
            pokemons: {
                status: 'succeeded',
                pokemons: [],
            },
        });

        // Mock dispatch
        store.dispatch = jest.fn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({}),
            })
        );
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );
    });

    it('displays Pokemon name', async () => {
        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );

        await waitFor(() => screen.getByText('Name'));
        expect(screen.getAllByText('pikachu')[0]).toBeInTheDocument();
    });

    it('displays evolution section', async () => {
        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );

        await waitFor(() => screen.findByText('-- Evolution --'));
        expect(screen.getByText(/From :/i)).toBeInTheDocument();
        expect(screen.getByText(/pichu/i)).toBeInTheDocument();
        expect(screen.getByText(/To :/i)).toBeInTheDocument();
        expect(screen.getByText(/raichu/i)).toBeInTheDocument();
    });

    it('should display content when status is "succeeded"', async () => {
        const store = mockStore({
            pokemonDetails: {
                species: { url: 'some_url' },
                status: 'succeeded',
                pokemonDetails: {
                    name: 'pikachu',
                    weight: '60',
                    height: '4',
                    abilities: [],
                    species: { name: '', genera: '' },
                    sprites: {
                        front_default: 'https://nothing.here',
                        other: {
                            "official-artwork": {
                                "front_default": "https://none.here/pikachu.png"
                            }
                        }
                    },
                    moves: []
                },
            },
        });

        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );

        const name = screen.getByText(/Name/i);
        expect(name).toBeInTheDocument();

        const pikachu = screen.getByText(/pikachu/i);
        expect(pikachu).toBeInTheDocument();

        const weight = screen.getByText(/Weight/i);
        expect(weight).toBeInTheDocument();

        const sixty = screen.getByText(/13 lbs/i);
        expect(sixty).toBeInTheDocument();

        const height = screen.getByText(/Height/i);
        expect(height).toBeInTheDocument();

        const four = screen.getByText(/1' 4"/i);
        expect(four).toBeInTheDocument();
    });

});
