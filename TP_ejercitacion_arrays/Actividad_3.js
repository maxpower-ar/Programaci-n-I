var arreglo = [1, 2, 3.14];
mostrar_contenido(arreglo);
mostrar_contenido(arreglo);
mostrar_contenido(arreglo);
var arreglo2 = ["4", "g"];
mostrar_contenido(arreglo2);
function mostrar_contenido(arr) {
    var index = 0;
    while (index < arr.length) {
        console.log(arr[index]);
        index++;
    }
}
