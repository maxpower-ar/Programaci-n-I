var nombres = ["Ana", "Bruno", "Carla"];
var encontrado = false;
for (var index = 0; index < nombres.length - 1; index++) {
    if (nombres[index] === "Pablo") {
        encontrado = true;
        break;
    }
}
if (encontrado === true) {
    console.log("Encontrado");
}
else {
    console.log("No encontrado");
}
