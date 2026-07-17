let nombres: string[] = ["Ana", "Bruno", "carla", "Diego"];

let verificar: boolean = nombres.every(
    (nombre: string): boolean => nombre.length >= 3
)

console.log(verificar);

let palabras: string[] = ["hola", "MUNDO", "TypeScript", "CÓDIGO", "función"];
let alguna_mayuscula: boolean = palabras.some(
    (palabra: string): boolean => palabra === palabra.toUpperCase() 
)   