var potencia = 1;
var limite = 21;
var multiplicador = 2;
var index = 0;
console.log("Iniciar While");
while (potencia <= limite) {
    index = index + 1;
    potencia = potencia * multiplicador;
    console.log(potencia);
}
console.log("El resultado final es " + potencia);
console.log("While Finalizado");
