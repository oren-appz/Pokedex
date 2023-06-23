import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import PokemonDetails from '../../components/PokemonDetails';
import thunk from 'redux-thunk';

// Create a mockStore for your tests
const mockStore = configureMockStore([thunk]);

describe('PokemonDetails', () => {
    it('should display loading spinner when status is "loading"', () => {
        const store = mockStore({
            pokemonDetails: {
                status: 'loading',
                pokemonDetails: {
                    sprites:
                    {
                        front_default: 'https://nothing.here',
                        other: {
                            "official-artwork": {
                                "front_default": 'https://nothing.here'
                            },
                        }
                    },
                }
            }
        });

        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );

        const spinner = screen.getByRole('progressbar');
        expect(spinner).toBeInTheDocument();
    });

    it('should display content when status is "succeeded"', async () => {
        const store = mockStore({
            pokemonDetails: {
                status: 'succeeded',
                pokemonDetails: {
                    name: 'pikachu',
                    weight: '60',
                    height: '4',
                    abilities: [],
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

    it('should display choose message when no pokemon selected', () => {
        const store = mockStore({
            pokemonDetails: {
                status: 'succeeded',
                pokemonDetails: null,
            },
        });

        render(
            <Provider store={store}>
                <PokemonDetails />
            </Provider>
        );

        const chooseMessage = screen.getByText("Choose a pokemon on the left to see its details");
        expect(chooseMessage).toBeInTheDocument();
    });
});