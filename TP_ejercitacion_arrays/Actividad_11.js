var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Hay " + contar_pares(numeros) + " numeros pares");
function contar_pares(arrnum) {
    var contador = 0;
    for (var index = 0; index < arrnum.length; index++) {
        if (arrnum[index] % 2 === 0) {
            contador++;
        }
    }
    return contador;
}
// let contador: number = 0;
// console.log("Hay " + contador + " numeros pares");
// function esPar(num:number): boolean {
//     if(num % 2 === 0) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }
