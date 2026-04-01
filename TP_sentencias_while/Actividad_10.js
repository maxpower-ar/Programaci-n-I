var num = 852;
var numero_inverso = "";
while (num > 1) {
    console.log(Math.floor(num));
    var digito = Math.floor(num % 10);
    numero_inverso = numero_inverso + digito.toString();
    num = num / 10;
}
console.log(numero_inverso);
