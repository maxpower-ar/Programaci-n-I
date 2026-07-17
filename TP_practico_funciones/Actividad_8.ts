function intercalar(a: string, b: string): string {
    let resultado = "";

    for (let i = 0; i < a.length; i++) {
        resultado += a[i] + b[i];
    }

    return resultado;
}