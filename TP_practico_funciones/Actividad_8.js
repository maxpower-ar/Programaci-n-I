function intercalar(a, b) {
    var resultado = "";
    for (var i = 0; i < a.length; i++) {
        resultado += a[i] + b[i];
    }
    return resultado;
}
