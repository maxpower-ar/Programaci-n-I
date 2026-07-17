let palabras: string[] = ["hola", "MUNDO", "TypeScript", "CÓDIGO", "función"];
let alguna_mayuscula: boolean = palabras.some(
    (palabra: string): boolean => palabra === palabra.toUpperCase() 
)   