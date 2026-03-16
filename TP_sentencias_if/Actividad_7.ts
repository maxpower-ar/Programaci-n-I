let lado_1: number = 5;
let lado_2: number = 5;
let lado_3: number = 4;

if (lado_1 === lado_2 && lado_2 === lado_3) {
    console.log("El triángulo es equilátero.");
} else if (lado_1 === lado_2 || lado_2 === lado_3 || lado_1 === lado_3) {
    console.log("El triángulo es isósceles.");
} else {
    console.log("El triángulo es escaleno.");
}

