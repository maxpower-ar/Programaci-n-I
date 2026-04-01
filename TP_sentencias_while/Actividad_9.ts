let numero_1 = 6;
let numero_2 = 8;
let numero_1_b = numero_1
let numero_2_b = numero_2

while (true) {
    if (numero_1 < numero_2) {
        numero_2_b = numero_2_b + numero_2
        let resto = numero_2_b%numero_1;
        if (resto == 0) {
            console.log("El numero MCM es " + numero_2_b);
            break
        }
    }
    else {
        numero_1_b = numero_1_b + numero_1
        let resto = numero_1_b%numero_2;
        if (resto == 0) {
            console.log("El numero MCM es " + numero_1_b);
            break
        }
    }
}