let palabras: string[] = ["tiempo", "luz", "anillo", "copa", "nivel"];
let mismo_prin_fin: boolean = palabras.some(
    (palabra: string): boolean => palabra[palabra.length - 1] === palabra[0]
)

console.log(mismo_prin_fin);