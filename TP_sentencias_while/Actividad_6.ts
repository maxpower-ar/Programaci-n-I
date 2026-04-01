let potencia = 1;
let limite = 21;
let multiplicador = 2;
let index = 0;

console.log ("Iniciar While");

while (potencia <= limite) {
    index = index + 1;
    potencia = potencia * multiplicador;
    console.log (potencia);
}

console.log ("El resultado final es " + potencia);
console.log ("While Finalizado");