let arrangement: number[] = [1, 2, 3, 2, 1, 4];

let resultado = (sin_repetidos(arrangement));
console.log(resultado);

resultado = (sin_repetidos([1, 1, 1, 1, 1, 1]));
console.log(resultado);


function sin_repetidos(arrnum: number[]): number[] {
    let noRepetidos: number[] = [];
    for (let index = 0; index < arrnum.length; index++) {
                
        let yaEsta: boolean = false;
        for (let index2 = 0; index2 < noRepetidos.length; index2++) {
            if(arrnum[index] === noRepetidos[index2]) {
                yaEsta = true;
            }
        }

        if(yaEsta === false) {
            noRepetidos.push(arrnum[index]);
        }
    }

    return noRepetidos;

}