let numeros: number[] = [4, 7, 2, 9, 1];
let maximo: number = numeros[0];

for (let index = 0; index < numeros.length; index++) {
    if (numeros[index] > maximo) {
        maximo = numeros[index];
    }
}

console.log(maximo);