var par = 40;
var lista = [2, 4, 6, 8];
var lista2 = [2, 4, 6, 8, 9];
var resultado = (es_par(par));
console.log(resultado);
resultado = es_par(57);
console.log(resultado);
var resultado2 = (todos_pares(lista));
console.log(resultado2);
var resultado3 = (todos_pares(lista2));
console.log(resultado3);
function es_par(num) {
    if (num % 2 === 0) {
        return true;
    }
    else {
        return false;
    }
}
function todos_pares(arrnum) {
    var pares = [];
    for (var index = 0; index < arrnum.length; index++) {
        if (es_par(arrnum[index])) {
            pares.push(arrnum[index]);
            return true;
        }
        else {
            return false;
        }
    }
}
