let numeros: number[] = [4, 7, 2, 9, 1];
let minimo: number = numeros[0];

for (let index = 0; index < numeros.length; index++) {
    if (numeros[index] < minimo) {
        minimo = numeros[index];
    }
}

console.log(minimo);