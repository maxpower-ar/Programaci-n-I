let dividendo = 10;
let divisor = 2;
let cantidad_de_restas = 0;

console.log("Iniciar While")

while (dividendo >= divisor) {
    cantidad_de_restas = cantidad_de_restas + 1
    dividendo = dividendo - divisor;
}
console.log(dividendo);
console.log("Las veces necesarias de restar para llegar a el ultimo numero fueron " + cantidad_de_restas);

console.log ("While finalizado");