var lado_1 = 5;
var lado_2 = 5;
var lado_3 = 5;
if (lado_1 === lado_2 && lado_2 === lado_3) {
    console.log("El triángulo es equilátero.");
}
else if (lado_1 === lado_2 || lado_2 === lado_3 || lado_1 === lado_3) {
    console.log("El triángulo es isósceles.");
}
else {
    console.log("El triángulo es escaleno.");
}
