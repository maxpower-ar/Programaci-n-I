let temperaturas: number[] = [22, 15, 30, 18, 25];
let verificar: boolean = temperaturas.every(
    (temperature: number): boolean => temperature > 0
)

console.log(verificar);