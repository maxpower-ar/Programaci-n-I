var arrangement = [10, 30, 20, 30, 40];
var aBuscar = 30;
var noEsta = 60;
var resultado = posicion(arrangement, aBuscar);
console.log(resultado);
resultado = posicion(arrangement, noEsta);
console.log(resultado);
resultado = posicion(arrangement, 40);
console.log(resultado);
///////////////////////////////////////////////////////////////
function posicion(arrnum, buscado) {
    for (var index = 0; index < arrnum.length; index++) {
        if (arrnum[index] === buscado) {
            return index;
        }
    }
    return -1;
}
