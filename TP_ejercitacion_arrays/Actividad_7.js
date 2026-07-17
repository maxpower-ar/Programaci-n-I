var numeros = [3, 7, 2, 8, 5, 9];
var contador = 0;
for (var index = 0; index < numeros.length; index++) {
    if (numeros[index] > 5) {
        contador++;
    }
}
console.log("Cantidad de números mayores a 5: " + contador);
