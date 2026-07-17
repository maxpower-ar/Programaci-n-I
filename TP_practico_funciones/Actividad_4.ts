function restar_naturales(a: number, b: number): number {
    let resultado = a - b;

    if (resultado < 0) {
        return 0;
    }

    return resultado;
}