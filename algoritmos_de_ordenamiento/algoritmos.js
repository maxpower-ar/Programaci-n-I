"use strict";
// ============================================================
//  Algoritmos de ordenación — Quick Sort y Random Sort
//  Programación I · ITR
//
//  Cada algoritmo es una función generadora (function*). En vez
//  de ordenar todo de golpe, "pausa" (yield) en cada paso
//  importante y avisa qué hizo: comparar, intercambiar, elegir
//  pivote... Así el visualizador puede dibujar cada paso a la
//  velocidad que elijamos.
//
//  Además cada evento trae `linea`: la línea del código que se
//  está ejecutando (para resaltarla en pantalla).
// ============================================================
function intercambiar(arr, i, j) {
    const aux = arr[i];
    arr[i] = arr[j];
    arr[j] = aux;
}
// ------------------------------------------------------------
//  QUICK SORT
//  1. Elegir un pivote: el ÚLTIMO elemento del subarreglo.
//  2. Separar (partición de Lomuto): los menores que el pivote
//     van a la izquierda; al final el pivote queda en su lugar.
//  3. Repetir lo mismo con la parte izquierda y la derecha.
//  Peor caso O(n²): cuando el pivote siempre es el máximo o el
//  mínimo (por ejemplo, si el arreglo ya viene ordenado).
//
//  (En pantalla se muestra la versión recursiva. Acá la recursión
//  se simula con una pila para que el generador no se vuelva lento
//  cuando hay miles de llamadas anidadas; el orden es el mismo.)
// ------------------------------------------------------------
function* quickSort(arr) {
    const pila = [[0, arr.length - 1]];
    while (pila.length > 0) {
        const [lo, hi] = pila.pop();
        if (lo >= hi) {
            if (lo === hi)
                yield { tipo: "ordenado", desde: lo, hasta: lo, linea: 2 };
            continue;
        }
        yield { tipo: "rango", lo, hi, linea: 4 };
        const p = yield* particion(arr, lo, hi);
        yield { tipo: "ordenado", desde: p, hasta: p, linea: 19 };
        pila.push([p + 1, hi]); // se apila primero la derecha...
        pila.push([lo, p - 1]); // ...para resolver antes la izquierda
    }
}
function* particion(arr, lo, hi) {
    const pivote = arr[hi];
    yield { tipo: "pivote", i: hi, linea: 10 };
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
        yield { tipo: "comparar", i: j, j: hi, linea: 13 };
        if (arr[j] < pivote) {
            i++;
            intercambiar(arr, i, j);
            yield { tipo: "swap", i, j, linea: 15 };
        }
    }
    intercambiar(arr, i + 1, hi);
    yield { tipo: "swap", i: i + 1, j: hi, linea: 18 };
    return i + 1;
}
// ------------------------------------------------------------
//  RANDOM SORT (ordenamiento aleatorio, o Bogosort)
//  1. Se comprueba si la lista ya está ordenada.
//  2. Si no, se mezclan TODOS los elementos al azar.
//  3. Se vuelve a comprobar, y así hasta que quede ordenada.
//  Hay n! órdenes posibles y sólo uno es el correcto: con 10
//  elementos ya son 3.628.800. Con 100 no termina nunca.
// ------------------------------------------------------------
function* randomSort(arr) {
    while (true) {
        // ¿está ordenado?
        let ordenado = true;
        for (let i = 0; i < arr.length - 1; i++) {
            yield { tipo: "comparar", i, j: i + 1, linea: 9 };
            if (arr[i] > arr[i + 1]) {
                ordenado = false;
                break;
            }
        }
        if (ordenado) {
            yield { tipo: "ordenado", desde: 0, hasta: arr.length - 1, linea: 11 };
            return;
        }
        // no: mezclar todo (Fisher-Yates)
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            intercambiar(arr, i, j);
            yield { tipo: "swap", i, j, linea: 18 };
        }
        yield { tipo: "mezcla", linea: 3 };
    }
}
// ------------------------------------------------------------
//  Código que se muestra en pantalla (versión limpia, sin yields).
//  Los números de `linea` de arriba apuntan a estas líneas (1 = primera).
// ------------------------------------------------------------
const CODIGO = {
    quick: `function quickSort(arr: number[], lo: number, hi: number): void {
  if (lo >= hi) return;
  // dividir: el pivote queda en su lugar
  const p: number = particion(arr, lo, hi);
  quickSort(arr, lo, p - 1);  // izquierda
  quickSort(arr, p + 1, hi);  // derecha
}

function particion(arr: number[], lo: number, hi: number): number {
  const pivote: number = arr[hi];  // el último
  let i: number = lo - 1;
  for (let j: number = lo; j < hi; j++) {
    if (arr[j] < pivote) {
      i++;
      intercambiar(arr, i, j);
    }
  }
  intercambiar(arr, i + 1, hi);
  return i + 1;
}`,
    random: `function randomSort(arr: number[]): void {
  while (!estaOrdenado(arr)) {
    mezclar(arr);  // desordenar todo al azar
  }
}

function estaOrdenado(arr: number[]): boolean {
  for (let i: number = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function mezclar(arr: number[]): void {
  // Fisher-Yates: todos los órdenes son igual de probables
  for (let i: number = arr.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    intercambiar(arr, i, j);
  }
}`,
};
const ALGORITMOS = {
    quick: {
        nombre: "Quick",
        generador: (arr) => quickSort(arr),
        resumen: "Elige como pivote el último elemento, manda los menores a la izquierda y lo deja en su lugar definitivo. Después repite lo mismo, recursivamente, a cada lado.",
        datos: [["Mejor caso", "O(n log n)"], ["Promedio", "O(n log n)"], ["Peor caso", "O(n²)"], ["Memoria", "O(log n)"]],
    },
    random: {
        nombre: "Random",
        generador: (arr) => randomSort(arr),
        resumen: "Comprueba si la lista está ordenada. Si no lo está, mezcla todos los elementos al azar y vuelve a comprobar. Así hasta que, por pura suerte, quede ordenada.",
        datos: [["Mejor caso", "O(n)"], ["Promedio", "O(n · n!)"], ["Peor caso", "No acotado (∞)"], ["Memoria", "O(1)"]],
    },
};
