let x = 20;

while (x > 0) {
    console.log(x);
    if (x % 2 === 0) {
        x -= 3;
    } else {
        x -= 2;
    }
}
console.log("Terminado");

// 1- 20
// 17
// 15
// 13
// 11
// 9
// 7
// 5
// 3
// 1
// Terminado
// 2- 15