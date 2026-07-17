function inverso(texto: string): string {
    let resultado = "";

    for (let i = texto.length - 1; i >= 0; i--) {
        resultado += texto[i];
    }

    return resultado;
}