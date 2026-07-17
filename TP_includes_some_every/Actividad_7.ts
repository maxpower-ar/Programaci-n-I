let precios: number[] = [120, 340, 489, 210, 560];
let presupuesto: number = 500;

let supera_presupuesto: boolean = precios.some(
    (precio:number): boolean => precio > presupuesto
)