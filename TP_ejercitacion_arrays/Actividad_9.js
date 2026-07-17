var numeros = [4, 7, 2, 9, 1];
var minimo = numeros[0];
for (var index = 0; index < numeros.length; index++) {
    if (numeros[index] < minimo) {
        minimo = numeros[index];
    }
}
console.log(minimo);
