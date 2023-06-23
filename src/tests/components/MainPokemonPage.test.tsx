import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MainPokemonPage from '../../components/MainPokemonPage';

jest.mock('../../redux/hooks', () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock('../../redux/pokemonsSlice', () => ({
    fetchPokemons: jest.fn()
}));

import { useAppSelector } from '../../redux/hooks';

// Mock store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('MainPokemonPage', () => {
    it('should display loading spinner when status is "loading"', () => {
        (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({ pokemons: { status: 'loading' } })
        );

        const store = mockStore({
            pokemons: { status: 'loading' }
        });

        const { getByRole } = render(
            <Provider store={store}>
                <MainPokemonPage />
            </Provider>
        );

        expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display content when status is "succeeded"', () => {
        (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({ pokemons: { status: 'succeeded' } })
        );

        const store = mockStore({
            pokemons: { pokemons: [], status: 'succeeded' },
            pokemonDetails: { pokemonsDetails: {}, status: 'succeeded' }
        });

        const { getByText } = render(
            <Provider store={store}>
                <MainPokemonPage />
            </Provider>
        );

        expect(getByText('Welcome to Pokedex')).toBeInTheDocument();
    });

    it('should display error when status is "failed"', () => {
        (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
            selectorFn({ pokemons: { status: 'failed', error: 'Error message' } })
        );

        const store = mockStore({
            pokemons: { status: 'failed', error: 'Error message' }
        });

        const { getByText } = render(
            <Provider store={store}>
                <MainPokemonPage />
            </Provider>
        );

        expect(getByText('Error message')).toBeInTheDocument();
    });
});
