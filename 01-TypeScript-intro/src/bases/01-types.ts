// si no se exporta algo, da error.
export const name = 'Joan';
export const age: number = 35;
export const isValid: boolean = true;

//si ponemos código ejecutable, cuando se importa desde otro archivo se ejecuta el código
console.log(name, age)


export const template = ` Esto es un string
multilinea
que puede inyectar valores
${name}`