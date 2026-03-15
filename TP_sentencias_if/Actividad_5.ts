let num: number = 6;
let num2: number = 6;

console.log("Número 1: " + num);
console.log("Número 2: " + num2);
if (num > num2) {
    console.log("El número 1 (" + num + ") es mayor que el número 2 (" + num2 + ").");
} else if (num < num2) {
    console.log("El número 2 (" + num2 + ") es mayor que el número 1 (" + num + ").");
} 
// Posible error: Si ambos números son iguales, no se que pasa
// Mentira, no aparece ningun mensaje, al ser iguales no hay uno mayor que otro y no muestra nada

// "else if" es correcto frente a "else", ya que al ser ambos numeros iguales, la respuesta es no 
// ya que 6 no es mayor que 6, pero tampoco es menor, entonces no se cumple ninguna de las condiciones
// y no se muestra nada. Si fuera "else" se mostraría el mensaje de que el número 2 es mayor que el 
// número 1, lo cual es incorrecto. En cambio, "else if" permite evaluar la condición de igualdad 
// y no mostrar ningún mensaje, lo cual es correcto.