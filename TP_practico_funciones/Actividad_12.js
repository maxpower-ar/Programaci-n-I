function inverso(texto) {
    var resultado = "";
    for (var i = texto.length - 1; i >= 0; i--) {
        resultado += texto[i];
    }
    return resultado;
}
function es_palindromo(texto) {
    return texto === inverso(texto);
}
