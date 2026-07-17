var arrangement = [1, 2, 3, 2, 1, 4];
var resultado = (sin_repetidos(arrangement));
console.log(resultado);
resultado = (sin_repetidos([1, 1, 1, 1, 1, 1]));
console.log(resultado);
function sin_repetidos(arrnum) {
    var noRepetidos = [];
    for (var index = 0; index < arrnum.length; index++) {
        var yaEsta = false;
        for (var index2 = 0; index2 < noRepetidos.length; index2++) {
            if (arrnum[index] === noRepetidos[index2]) {
                yaEsta = true;
            }
        }
        if (yaEsta === false) {
            noRepetidos.push(arrnum[index]);
        }
    }
    return noRepetidos;
}
