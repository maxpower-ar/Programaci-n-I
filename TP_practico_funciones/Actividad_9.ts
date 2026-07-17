function contar_vocales(texto: string): number {
    let cantidad = 0;

    for (let letra of texto.toLowerCase()) {
        if (
            letra === "a" ||
            letra === "e" ||
            letra === "i" ||
            letra === "o" ||
            letra === "u"
        ) {
            cantidad++;
        }
    }

    return cantidad;
}