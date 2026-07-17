function es_triangular(n: number): boolean {
    let suma = 0;
    let i = 1;

    while (suma < n) {
        suma += i;
        i++;
    }

    return suma === n;
}