function es_triangular(n) {
    var suma = 0;
    var i = 1;
    while (suma < n) {
        suma += i;
        i++;
    }
    return suma === n;
}
