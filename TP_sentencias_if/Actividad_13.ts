let a: number = 5;
let b: number = 7;
let c: number = 9;

if (a + b > c && a + c > b && b + c > a) {
    console.log("Los números pueden formar un triángulo.");
} else {
    console.log("Los números NO pueden formar un triángulo.");
}