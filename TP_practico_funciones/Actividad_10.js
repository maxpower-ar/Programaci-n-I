function contar_consonantes(texto) {
    var cantidad = 0;
    for (var _i = 0, _a = texto.toLowerCase(); _i < _a.length; _i++) {
        var letra = _a[_i];
        if (letra >= "a" &&
            letra <= "z" &&
            letra !== "a" &&
            letra !== "e" &&
            letra !== "i" &&
            letra !== "o" &&
            letra !== "u") {
            cantidad++;
        }
    }
    return cantidad;
}
