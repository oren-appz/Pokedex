import memoize from 'memoizee';

export type PokemonDetails = {
    moves: unknown;
    abilities: unknown;
    weight: string;
    height: string;
    name: string;
    sprites: unknown;
    results: unknown;
};

export type Pokemon = {
    id: number;
    name: string;
    url: string;
};

export interface PokemonList {
    results: Pokemon[];
    count: number;
    next: string | null;
    previous: string | null;
}

type CacheItem = {
    data: PokemonList | null;
    timestamp: number;
};

// Memoize the fetchData function
const fetchDataMemoized = memoize(
    async (url) => {
        const response = await fetch(url);
        console.log(' the response', response)
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json()
    },
    { promise: true, maxAge: 60 * 60 * 1000 }); // Cache for 60 minutes

const fetchData = async (url: string): Promise<PokemonList | PokemonDetails | null> => {
    const cachedData = localStorage.getItem(url);
    const currentTime = new Date().getTime();

    if (cachedData) {
        const { data, timestamp }: CacheItem = JSON.parse(cachedData);

        // 24 hours cache
        if (currentTime - timestamp < 24 * 60 * 60 * 1000) {
            return data;
        }
    }

    try {
        const data = await fetchDataMemoized(url);
        console.log("data", data)



        try {
            // Store data in localStorage with a timestamp
            localStorage.setItem(
                url,
                JSON.stringify({ data, timestamp: currentTime } as CacheItem)
            );
        } catch (error) { // incase we storage quota exceeded. Will need to use memoization instead
            console.warn("Storage error ", error)
            return data;
        }


        return data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    }
};

export { fetchData };
