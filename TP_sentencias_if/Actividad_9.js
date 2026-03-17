var totalcompra = 1100;
if (totalcompra > 1000) {
    totalcompra = totalcompra * 0.9; // Aplica un descuento del 10%
    console.log("Se aplicó un descuento del 10%. Total a pagar: $" + totalcompra);
}
else if (totalcompra < 1000) {
    console.log("Total a pagar: $" + totalcompra);
}
