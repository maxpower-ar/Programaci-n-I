    let nombres: string[] = ["Lucía", "Sebastián", "Ana", "Maximiliano", "Eva"];
    let is_mas8letras: boolean = nombres.some((nombre: string): boolean => nombre.length > 8);

    console.log(is_mas8letras);