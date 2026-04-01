var num = 1423;
var digito_mayor = 0;
var index = 0;
var num_original = num;
while (num > 1) {
    index = index + 1;
    console.log(Math.floor(num));
    var digito = num % 10;
    if (digito > digito_mayor) {
        digito_mayor = digito;
    }
    else
        num = num / 10;
    console.log("El digito mayor hasta ahora es " + Math.floor(digito_mayor));
}
console.log("******************************************");
console.log("** El digito mayor del numero " + num_original + " es " + Math.floor(digito_mayor) + " **");
console.log("******************************************");
