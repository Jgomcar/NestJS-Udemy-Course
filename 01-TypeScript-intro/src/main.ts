import { age, name } from './bases/01-types';
import { pokemonIds, bulbasaur, pokemons } from './bases/02-ojects';
// import { charmander } from './bases/03-calsses';


import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

import { charmander } from './bases/05-decorators';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript!!!</h1>
    <h2>${name} ${age} ${bulbasaur.name}</h2>
    <h2>${ pokemonIds.join(',') }</h2>
    <p>${ pokemons }</p>
    <p>${ charmander }</p>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
