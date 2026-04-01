let num = 1423;
let digito_mayor = 0;
let index = 0
let num_original = num

while (num > 1) {
    index = index + 1;
    console.log(Math.floor(num));
    let digito = num%10;
    if (digito > digito_mayor) {
        digito_mayor = digito;
    }
        else
    num = num/10;
    console.log("El digito mayor hasta ahora es " + Math.floor(digito_mayor));

}
console.log("******************************************");
console.log("** El digito mayor del numero " + num_original + " es " + Math.floor(digito_mayor) + " **");
console.log("******************************************");