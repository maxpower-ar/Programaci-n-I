let arrangement: number[] = [10, 30, 20, 30, 40];
let aBuscar: number = 30;
let noEsta: number = 60;

let resultado = posicion(arrangement, aBuscar);
console.log(resultado);

resultado = posicion(arrangement, noEsta);
console.log(resultado);

resultado = posicion(arrangement, 40);
console.log(resultado);


///////////////////////////////////////////////////////////////
function posicion (arrnum: number[], buscado: number): number {
    for (let index = 0; index < arrnum.length; index++) {
        if (arrnum[index] === buscado) {
            return index;
        }
    } 
    
    return -1;
}