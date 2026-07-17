let numero = 0;
let moneda = '';

while (numero < 3) {
    if (Math.random() < 0.5) {
        moneda = 'Cara';
    } else {
        moneda = 'Cruz'
    }
    console.log(moneda)
    if (moneda == 'Cara') {
        numero++;
    } else {
        numero = 0;
    }
}

// 1- El programa simula lanzar una moneda hasta obtener 3 "Cara" seguidas y termina cuando numero llega a 3
// 2- Mínimo: 3 veces. 
// Máximo: indefinido (puede tardar mucho dependiendo del azar)
// 3- numero cuenta cuántas "Cara" consecutivas salieron. Nombre sugerido: carasConsecutivas
// 4- Modificación:
// Agregar un contador de "Cruz" y mostrarlo al final.