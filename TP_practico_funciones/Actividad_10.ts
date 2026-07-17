function contar_consonantes(texto: string): number {
    let cantidad = 0;

    for (let letra of texto.toLowerCase()) {
        if (
            letra >= "a" &&
            letra <= "z" &&
            letra !== "a" &&
            letra !== "e" &&
            letra !== "i" &&
            letra !== "o" &&
            letra !== "u"
        ) {
            cantidad++;
        }
    }

    return cantidad;
}