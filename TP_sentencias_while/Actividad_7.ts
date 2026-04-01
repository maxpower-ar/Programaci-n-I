let num = 65;
let suma = 0;

while (num > 1) {

    let digito = Math.floor(num%10)
    suma = suma + digito;
    
    num = num/10;
}

console.log(suma);