import axios from 'axios';


export class Pokemon {
    // public id: number;
    // public name: string;

    // constructor( id: number, name: string ) {
    //     console.log('Constructor llamado')
    //     this.id = id;
    //     this.name = name;
    // }

    //opción más eficiente:
    constructor(
        public readonly id: number,
        public name: string
    ){}

    get imageUrl(): string{
        return `https://pokemon.com/${ this.id }.jpg`;
    }

    // las clases pueden tener métodos, por defecto son métodos públicos a no ser que se indique "private".
    scream() {
        console.log(`${this.name.toUpperCase()}!!!`);
    }
    speak() {
        console.log(`${this.name}, ${this.name}`);
    }

    async getMoves() {
        //const moves = 10;
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon/4');
        console.log(data.moves);
        return data.moves;
    }

}


export const charmander = new Pokemon( 4, 'Charmander')
console.log(charmander.getMoves())