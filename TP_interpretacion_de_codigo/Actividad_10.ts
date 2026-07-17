let num = Math.floor(Math.random() * 100) + 1;

if (num % 2 === 0 && num % 3 === 0){
    console.log("Se cumple la condición 1");
} else if (num % 4 === 0){
    console.log("Se cumple la condición 2");
} else if (num < 50 && num === 65){
    console.log("Se cumple la condición 3")
}

// 1- num puede tomar valores entre 1 y 100.
// 2- Ejemplos condición 1: 
// 6, 12, 18
// 3- Ejemplos condición 2:
// 4, 8, 1
// 4- No necesariamente, si también cumple la condición 1, se ejecuta esa primero
// 5- Ninguno, la condición es imposible (num no puede ser menor que 50 y a la vez 65).
// Sí, se puede eliminar sin afectar el programa
// 6- Sí, ejemplos: 5, 7, 11 (No cumplen ninguna condición, por lo tanto no se imprime nada)
// 7- Reemplazo:
// num % 6 == 0