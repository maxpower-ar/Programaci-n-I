function repetir(texto: string, n: number): string {
    let resultado = "";

    for (let i = 0; i < n; i++) {
        resultado += texto;
    }

    return resultado;
}