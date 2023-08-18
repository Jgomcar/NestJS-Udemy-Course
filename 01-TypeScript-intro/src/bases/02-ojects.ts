export const pokemonIds = [1,2,3,4,5];

// export const pokemon = {
//     id: 1,
//     name: 'Bulbasaur'
// }

interface Pokemon {
    id: number;
    name: string;
    age?: number; //valor opcional
}

export const bulbasaur:Pokemon = {
    id: 1,
    name: 'Bulbasaur'
}

export const pokemons: Pokemon[] = [];

pokemons.push(bulbasaur)