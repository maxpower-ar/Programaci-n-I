let a = 0;
let b = 1;
let temp = 0;

while (b < 25) {
    console.log(b);
    temp = a + b;
    a = b;
    b = temp;
}

// 1- Salidas:
// 1
// 1
// 2
// 3
// 5
// 8
// 13
// 21