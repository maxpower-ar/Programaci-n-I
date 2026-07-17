let arrangement: number [] = [1, 3, 5, 7];

console.log(esta_ordenado(arrangement));

function esta_ordenado(arrnum: number []): boolean {
    for (let index = 0; index < arrangement.length; index++) {
        if(arrnum[index] > arrnum[index+1]) {
            return false
        }            
    }
    return true
}