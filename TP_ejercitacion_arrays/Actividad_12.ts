let numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("El promedio entre los numeros es " + promedio(numeros));

function promedio(numsprom: number[]): number {
    let sumador = 0;
    for (let index = 0; index < numsprom.length; index++) {
       sumador = sumador + numsprom[index];
    }
    let prom: number = sumador / numsprom.length
    return prom;
}