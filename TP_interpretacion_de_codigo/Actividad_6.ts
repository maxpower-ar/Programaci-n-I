let palabra = "programacion";
let i = 0;
let contador = 0;

while (i < palabra.length) {
    if (palabra[i] === "o") {
        contador++;
    }
    i++;
}

console.log("El resultado final es:", contador);

// 1- Cuenta cuantas veces aparece la letra o en la palabra
// 2- Onomatopeico
// 3- Recorre la palabra letra por letra