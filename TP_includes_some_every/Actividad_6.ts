let numeros: number[] = [4, -6, 7, -2, 3, 10];
let neg_par: boolean = numeros.some((condicion: number): boolean => condicion < 0 && condicion % 2 === 0);

console.log(neg_par);