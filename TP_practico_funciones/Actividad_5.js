function cantidad_divisores(n) {
    var cantidad = 0;
    for (var i = 1; i <= n; i++) {
        if (n % i === 0) {
            cantidad++;
        }
    }
    return cantidad;
}
