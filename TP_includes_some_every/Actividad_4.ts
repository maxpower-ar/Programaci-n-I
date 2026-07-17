let notas: number[] = [7, 9, 6, 5, 8, 10];
let desaprobados: boolean = notas.some((nota: number): boolean => nota < 7);

console.log(desaprobados);