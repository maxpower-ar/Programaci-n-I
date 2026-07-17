let par: number = 40;
let lista: number[] = [2, 4, 6, 8];
let lista2: number[] = [2, 4, 6, 8, 9];


let resultado = (es_par(par));
console.log(resultado);

resultado = es_par(57);
console.log(resultado);

let resultado2 = (todos_pares(lista));
console.log(resultado2);

let resultado3 = (todos_pares(lista2));
console.log(resultado3);


function es_par(num: number): boolean {
    if (num % 2 === 0) {
        return true;
    } else {
        return false;
    }
}

function todos_pares(arrnum: number[]): boolean {
    let pares: number[] = []
    for(let index = 0; index < arrnum.length; index++) {
        if(es_par(arrnum[index])) {
            pares.push(arrnum[index]);
        return true;
        } else {
        return false;
        }
    }
    
}