var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("El promedio entre los numeros es " + promedio(numeros));
function promedio(numsprom) {
    var sumador = 0;
    for (var index = 0; index < numsprom.length; index++) {
        sumador = sumador + numsprom[index];
    }
    var prom = sumador / numsprom.length;
    return prom;
}
