var num = 65;
if (num < 10)
    console.log("El numero es muy chico");
else if (num > 99)
    console.log("El numero es muy grande");
//Unidades
console.log(num % 10);
//Decenas
console.log(Math.floor(num / 10));
//Resultado
console.log(num % 10 + Math.floor(num / 10));
