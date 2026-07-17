let palabras: string[] = ["educación", "doctor", "trabajo", "ordenador",
"abuela"];
let verificar: boolean = palabras.some(
    (palabra: string): boolean => palabra.includes("a") && palabra.includes("i")
)

console.log(verificar);