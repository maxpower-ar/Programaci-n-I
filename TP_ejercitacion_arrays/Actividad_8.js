var numeros = [4, 7, 2, 9, 1];
var maximo = numeros[0];
for (var index = 0; index < numeros.length; index++) {
    if (numeros[index] > maximo) {
        maximo = numeros[index];
    }
}
console.log(maximo);
