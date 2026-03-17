var totalcompra = 1100;
if (totalcompra > 1000) {
    totalcompra = totalcompra - 100;
    console.log("Se aplicó un descuento de $100. Total a pagar: $" + totalcompra);
}
else if (totalcompra < 1000) {
    console.log("Total a pagar: $" + totalcompra);
}
