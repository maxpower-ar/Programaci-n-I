let a = 5;
let b = 10;
let temp = 0;

console.log(a, b)

temp = a;
a = b;
b = temp;

console.log(a, b)

// 1- 5 10
//    10 5
// 2- Intercambia los valores de a y b
// 3- temp sirve como variable auxiliar para no perder un valor durante el intercambio