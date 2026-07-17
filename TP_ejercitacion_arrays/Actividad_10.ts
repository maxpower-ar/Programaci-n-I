let nombres: string[] = ["Ana", "Bruno", "Carla"];
let encontrado: boolean = false

for (let index = 0; index < nombres.length-1; index++) {
    if(nombres[index] === "Pablo"){
        encontrado = true
    break
    }
}
if (encontrado === true){
    console.log("Encontrado");
} else {
    console.log("No encontrado");
}