let arrangement: number[] = [1, 2, 3, 2, 1, 4];
let y: number = 5;

let resultado = incluye(arrangement, 4);
console.log(resultado);

resultado = incluye(arrangement, y);
console.log(resultado);

function incluye(arrnum: number[], y: number): boolean {
    for(let index = 0; index < arrnum.length; index++) {
        if(arrnum[index] === y) {
            return true;
        }
    }
    return false;
}