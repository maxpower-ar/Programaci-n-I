var dividendo = 10;
var divisor = 2;
var cantidad_de_restas = 0;
while (dividendo >= divisor) {
    cantidad_de_restas = cantidad_de_restas + 1;
    dividendo = dividendo - divisor;
}
console.log(dividendo);
console.log("Las veces necesarias de restar para llegar a el ultimo numero fueron " + cantidad_de_restas);
