var num = 1;
console.log("Iniciar while");
while (num <= 100) {
    if (num % 3 == 0) {
        console.log("Fizz");
    }
    else if (num % 5 == 0) {
        console.log("Buzz");
    }
    else {
        console.log(num);
    }
    num = num + 1;
}
console.log("While finalizado");
