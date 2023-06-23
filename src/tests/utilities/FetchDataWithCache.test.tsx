/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchData } from "../../utilities/FetchDataWithCache";

jest.mock('memoizee', () => jest.fn((fn: any) => fn));

describe('fetchData', () => {
    let mockFetch: jest.Mock;
    let mockLocalStorage: Storage;

    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch as any;

        mockLocalStorage = (() => {
            let store: { [key: string]: string } = {};
            return {
                getItem(key: string) {
                    return store[key] || null;
                },
                setItem(key: string, value: string) {
                    store[key] = value.toString();
                },
                removeItem(key: string) {
                    delete store[key];
                },
                clear() {
                    store = {};
                },
                get length() {
                    return Object.keys(store).length;
                },
                key(index: number) {
                    const keys = Object.keys(store);
                    return keys[index] || null;
                }
            };
        })();
        global.localStorage = mockLocalStorage as any;
    });

    it('fetches data successfully and caches it', async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ data: 'mock data' })
        };
        mockFetch.mockResolvedValue(mockResponse);

        const data = await fetchData('https://example.com/api');

        expect(data).toEqual({ data: 'mock data' });
        expect(localStorage.getItem('https://example.com/api')).not.toBeNull();
    });

    it('uses cached data when available', async () => {
        const cachedData = { data: 'cached data', timestamp: new Date().getTime() };
        localStorage.setItem('https://example.com/api', JSON.stringify(cachedData));

        const data = await fetchData('https://example.com/api');

        expect(mockFetch).not.toHaveBeenCalled();
        expect(data).toEqual('cached data');
    });

    it('handles fetch errors gracefully', async () => {
        mockFetch.mockRejectedValue(new Error('mock error'));

        const data = await fetchData('https://example.com/api2');
        expect(data).toBeNull();
    });

    it('handles non-ok responses gracefully', async () => {
        const mockResponse = {
            ok: false
        };
        mockFetch.mockResolvedValue(mockResponse);

        const data = await fetchData('https://example.com/api3');

        expect(data).toBeNull();
    });
});
