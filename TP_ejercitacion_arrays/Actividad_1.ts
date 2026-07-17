let numeros: number[] = [10, 20, 30, 40, 50];

// Uno por uno
console.log(numeros[0]);
console.log(numeros[1]);
console.log(numeros[2]);
console.log(numeros[3]);
console.log(numeros[4]);

// O el Array completo
console.log(numeros);

let index: number = 0;
while(index <= numeros.length-1) {
    console.log(numeros[index]);
    index++;
}