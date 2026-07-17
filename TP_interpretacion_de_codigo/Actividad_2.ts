let x = 15;
let y = 10;
let z = 20;
if (x > y) {
    if (x > z) {
        console.log("x es el mayor");
} else {
    console.log("z es el mayor");
}
} else {
    console.log("y no es el menor");
}

// 1- "z es el mayor"
// 2- No, no compara todos, porque al comparar con uno deja de lado el otro por el hecho de que es mas grande, por lo tanto entra al if y deja de lado el otro que puede o no ser mas grande
// 3- x = 5, y = 10, z = 20
// 4- x = 15, y = 10, z = 20