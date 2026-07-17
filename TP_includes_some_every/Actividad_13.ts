let palabras: string[] = ["sol", "id", "mar", "luz", "río"];
let verificar: boolean = palabras.every(
    (palabra: string): boolean => palabra.length >= 3
)

console.log(verificar);