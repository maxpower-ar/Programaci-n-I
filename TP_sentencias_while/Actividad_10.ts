let num = 852;
let numero_inverso = "";

while (num > 1) {
    console.log(Math.floor(num));
    let digito = Math.floor(num%10)
    numero_inverso = numero_inverso + digito.toString();
    
    num = num/10;
}

console.log(numero_inverso);