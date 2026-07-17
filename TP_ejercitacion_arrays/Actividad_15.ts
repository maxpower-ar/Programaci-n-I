let arrangement: number[] = [3, 7, 1, 9, 4, 6];
let arrangement2: number[] = [7, 9, 4, 6];
let n: number = 5

let resultado = mayores_que(arrangement, n);
console.log(resultado);

resultado = mayores_que(arrangement2, 6);
console.log(resultado);




////////////////////////////////////////////////////////////
function mayores_que(arrnum: number[], n: number): number[] {
    let mayores: number[] = [];
    for (let index = 0; index < arrnum.length;   index++) {
        if(arrnum[index] > n) {
            mayores.push(arrnum[index]);
        }
    }
    return mayores;
}