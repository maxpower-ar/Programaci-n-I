let arreglo: number[] = [1, 2, 3.14];

mostrar_contenido(arreglo);
mostrar_contenido(arreglo);
mostrar_contenido(arreglo);

let arreglo2: number[] = [1,6,7,4,6,9.14];
mostrar_contenido(arreglo2);



function mostrar_contenido(arr: number[]) {
    let index: number = 0;

    while (index < arr.length) {
        console.log(arr[index]);
        index++
    }
}
