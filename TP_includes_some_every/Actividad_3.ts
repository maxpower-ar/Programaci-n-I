let notasAprobacion: number[] = [6, 7, 8, 9, 10];
let is_aprobado: boolean = notasAprobacion.includes(5);

if (is_aprobado === true) {
    console.log("Aprobó");
} else {
    console.log("No aprobó");
}