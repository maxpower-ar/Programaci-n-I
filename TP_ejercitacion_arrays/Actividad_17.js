var arrangement = [1, 2, 3, 2, 1, 4];
var y = 5;
var resultado = incluye(arrangement, 4);
console.log(resultado);
resultado = incluye(arrangement, y);
console.log(resultado);
function incluye(arrnum, y) {
    for (var index = 0; index < arrnum.length; index++) {
        if (arrnum[index] === y) {
            return true;
        }
    }
    return false;
}
