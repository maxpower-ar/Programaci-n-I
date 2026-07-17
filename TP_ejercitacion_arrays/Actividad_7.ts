let numeros: number[] = [3, 7, 2, 8, 5, 9]
let contador: number = 0;

for (let index = 0; index < numeros.length ; index++) {
    if (numeros[index] > 5) {
        contador++
    }
}
console.log("Cantidad de números mayores a 5: " + contador);