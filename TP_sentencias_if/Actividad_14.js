var año = 2026;
if ((año % 4 === 0 && año % 100 !== 0) || año % 400 === 0) {
    console.log("El año es bisiesto.");
}
else {
    console.log("El año no es bisiesto.");
}
