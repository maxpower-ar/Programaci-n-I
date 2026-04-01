var num = 65;
var suma = 0;
while (num > 1) {
    var digito = Math.floor(num % 10);
    suma = suma + digito;
    num = num / 10;
}
console.log(suma);
