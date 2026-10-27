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
//  Partición de Lomuto (la usan los dos algoritmos)
//  - El pivote es el ÚLTIMO elemento del subarreglo.
//  - Recorre con j y va juntando a la izquierda los menores.
//  - Al final coloca el pivote en su lugar definitivo.
//  `desfase` corre los números de línea, porque en pantalla la
//  función particion() aparece más abajo en Random Sort.
// ------------------------------------------------------------
function* particionLomuto(arr, lo, hi, desfase) {
    const pivote = arr[hi];
    yield { tipo: "pivote", i: hi, linea: 10 + desfase };
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
        yield { tipo: "comparar", i: j, j: hi, linea: 13 + desfase };
        if (arr[j] < pivote) {
            i++;
            intercambiar(arr, i, j);
            yield { tipo: "swap", i, j, linea: 15 + desfase };
        }
    }
    intercambiar(arr, i + 1, hi);
    yield { tipo: "swap", i: i + 1, j: hi, linea: 18 + desfase };
    return i + 1;
}
// ------------------------------------------------------------
//  QUICK SORT (clásico)
//  Pivote: siempre el último. Peor caso O(n²) si el arreglo ya
//  viene ordenado o invertido: el pivote siempre es el máximo o
//  el mínimo y cada partición sólo saca un elemento.
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
        const p = yield* particionLomuto(arr, lo, hi, 0);
        yield { tipo: "ordenado", desde: p, hasta: p, linea: 19 };
        pila.push([p + 1, hi]); // se apila primero la derecha...
        pila.push([lo, p - 1]); // ...para resolver antes la izquierda
    }
}
// ------------------------------------------------------------
//  RANDOM SORT (Quick Sort aleatorizado)
//  Exactamente igual a Quick Sort, con una sola diferencia: el
//  pivote se elige AL AZAR dentro del subarreglo (y se lo manda al
//  final para usar la misma partición). Así ningún orden de
//  entrada lo hace caer siempre en el peor caso: en promedio
//  tarda O(n log n) sin importar cómo vengan los datos.
// ------------------------------------------------------------
function* randomSort(arr) {
    const pila = [[0, arr.length - 1]];
    while (pila.length > 0) {
        const [lo, hi] = pila.pop();
        if (lo >= hi) {
            if (lo === hi)
                yield { tipo: "ordenado", desde: lo, hasta: lo, linea: 2 };
            continue;
        }
        yield { tipo: "rango", lo, hi, linea: 4 };
        const k = lo + Math.floor(Math.random() * (hi - lo + 1));
        yield { tipo: "pivote", i: k, linea: 4 };
        if (k !== hi) {
            intercambiar(arr, k, hi);
            yield { tipo: "swap", i: k, j: hi, linea: 5 };
        }
        const p = yield* particionLomuto(arr, lo, hi, 2);
        yield { tipo: "ordenado", desde: p, hasta: p, linea: 21 };
        pila.push([p + 1, hi]);
        pila.push([lo, p - 1]);
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
    random: `function randomSort(arr: number[], lo: number, hi: number): void {
  if (lo >= hi) return;
  // pivote al azar, y se lo manda al final
  const k: number = lo + Math.floor(Math.random() * (hi - lo + 1));
  intercambiar(arr, k, hi);
  const p: number = particion(arr, lo, hi);
  randomSort(arr, lo, p - 1);  // izquierda
  randomSort(arr, p + 1, hi);  // derecha
}

function particion(arr: number[], lo: number, hi: number): number {
  const pivote: number = arr[hi];
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
};
const ALGORITMOS = {
    quick: {
        nombre: "Quick",
        generador: (arr) => quickSort(arr),
        resumen: "Elige como pivote el último elemento, manda los menores a la izquierda y lo deja en su lugar definitivo. Después repite lo mismo, recursivamente, a cada lado.",
        datos: [["Promedio", "O(n log n)"], ["Peor caso", "O(n²)"], ["Memoria", "O(log n)"], ["Estable", "No"]],
    },
    random: {
        nombre: "Random",
        generador: (arr) => randomSort(arr),
        resumen: "Igual que Quick Sort, pero el pivote se elige al azar. Así ningún orden de entrada lo hace caer siempre en el peor caso: ni siquiera un arreglo ya ordenado o invertido.",
        datos: [["Promedio", "O(n log n)"], ["Peor caso", "O(n²) · improbable"], ["Memoria", "O(log n)"], ["Estable", "No"]],
    },
};
