let arrangement: number[] = [1, 2, 3, 4, 5];

// Con push
console.log(invertirconPush(arrangement))
function invertirconPush(arrnum: number[]): number[] {
    let inverso: number [] = [];
    for (let index = arrangement.length-1; index >= 0; index--) {
        inverso.push(arrnum[index]);
    }
    return inverso
}


//Sin push

function invertir(arrnum: number[]): number[] {
    
    let index2: number = 0;
    let inverso: number[] = [];
    for (let index = arrnum.length-1; index >= 0; index--) {
        inverso[index2] = arrnum[index];
        index2++;
    }
return inverso
}

