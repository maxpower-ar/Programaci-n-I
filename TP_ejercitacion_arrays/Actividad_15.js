var arrangement = [3, 7, 1, 9, 4, 6];
var arrangement2 = [7, 9, 4, 6];
var n = 5;
var resultado = mayores_que(arrangement, n);
console.log(resultado);
resultado = mayores_que(arrangement2, 6);
console.log(resultado);
////////////////////////////////////////////////////////////
function mayores_que(arrnum, n) {
    var mayores = [];
    for (var index = 0; index < arrnum.length; index++) {
        if (arrnum[index] > n) {
            mayores.push(arrnum[index]);
        }
    }
    return mayores;
}
