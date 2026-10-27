// ============================================================
//  Algoritmos de ordenación — Quick Sort y Rapid Sort
//  Programación I · ITR
//
//  Cada algoritmo es una función generadora (function*). En vez
//  de ordenar todo de golpe, "pausa" (yield) en cada paso
//  importante y avisa qué hizo: comparar, intercambiar, elegir
//  pivote... Así el visualizador puede dibujar cada paso a la
//  velocidad que elijamos.
//
//  Eventos que se emiten:
//    { tipo: "rango",     lo, hi }  → subarreglo en el que trabaja
//    { tipo: "pivote",    i }       → posición del pivote
//    { tipo: "comparar",  i, j }    → compara arr[i] con arr[j]
//    { tipo: "swap",      i, j }    → intercambió arr[i] y arr[j]
//    { tipo: "ordenado",  desde, hasta } → esas posiciones ya quedaron fijas
//  Además cada evento trae `linea`: la línea del código que se
//  está ejecutando (para resaltarla en pantalla).
// ============================================================

function intercambiar(arr, i, j) {
  const aux = arr[i];
  arr[i] = arr[j];
  arr[j] = aux;
}

// ------------------------------------------------------------
//  QUICK SORT (clásico, partición de Lomuto)
//  - Pivote: el ÚLTIMO elemento del subarreglo.
//  - Recorre con j y va juntando a la izquierda los menores.
//  - Al final coloca el pivote en su lugar definitivo.
//  - Es recursivo. Peor caso O(n²): arreglo ya ordenado o invertido.
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
      if (lo === hi) yield { tipo: "ordenado", desde: lo, hasta: lo, linea: 2 };
      continue;
    }
    yield { tipo: "rango", lo, hi, linea: 4 };
    const p = yield* particionLomuto(arr, lo, hi);
    yield { tipo: "ordenado", desde: p, hasta: p, linea: 19 };
    pila.push([p + 1, hi]); // se apila primero la derecha...
    pila.push([lo, p - 1]); // ...para resolver antes la izquierda
  }
}

function* particionLomuto(arr, lo, hi) {
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
//  RAPID SORT (Quick Sort optimizado)
//  Misma idea de "divide y vencerás", con tres mejoras:
//  1. Mediana de tres: el pivote es la mediana entre el primero,
//     el del medio y el último → casi nunca cae en el peor caso.
//  2. Partición de Hoare: dos punteros que avanzan desde los
//     extremos hacia el centro → menos intercambios y maneja bien
//     los valores repetidos.
//  3. Subarreglos chicos (≤ 12) se terminan con inserción, que en
//     tamaños pequeños es más rápida que seguir partiendo.
//  Usa una pila propia en vez de recursión.
// ------------------------------------------------------------
const UMBRAL_INSERCION = 12;

function* rapidSort(arr) {
  const pila = [[0, arr.length - 1]];
  while (pila.length > 0) {
    const [lo, hi] = pila.pop();
    if (lo > hi) continue;
    yield { tipo: "rango", lo, hi, linea: 4 };

    if (hi - lo < UMBRAL_INSERCION) {
      yield* insercion(arr, lo, hi);
      yield { tipo: "ordenado", desde: lo, hasta: hi, linea: 6 };
      continue;
    }

    // 1. Mediana de tres
    const medio = (lo + hi) >> 1;
    yield { tipo: "comparar", i: medio, j: lo, linea: 10 };
    if (arr[medio] < arr[lo]) { intercambiar(arr, lo, medio); yield { tipo: "swap", i: lo, j: medio, linea: 10 }; }
    yield { tipo: "comparar", i: hi, j: lo, linea: 11 };
    if (arr[hi] < arr[lo]) { intercambiar(arr, lo, hi); yield { tipo: "swap", i: lo, j: hi, linea: 11 }; }
    yield { tipo: "comparar", i: hi, j: medio, linea: 12 };
    if (arr[hi] < arr[medio]) { intercambiar(arr, medio, hi); yield { tipo: "swap", i: medio, j: hi, linea: 12 }; }
    const pivote = arr[medio];
    yield { tipo: "pivote", i: medio, linea: 13 };

    // 2. Partición de Hoare: i avanza, j retrocede
    let i = lo, j = hi;
    while (i <= j) {
      yield { tipo: "comparar", i, j: -1, linea: 17 };
      while (arr[i] < pivote) { i++; yield { tipo: "comparar", i, j: -1, linea: 17 }; }
      yield { tipo: "comparar", i: j, j: -1, linea: 18 };
      while (arr[j] > pivote) { j--; yield { tipo: "comparar", i: j, j: -1, linea: 18 }; }
      if (i <= j) {
        intercambiar(arr, i, j);
        yield { tipo: "swap", i, j, linea: 20 };
        i++; j--;
      }
    }
    // Entre j+1 e i-1 quedan valores iguales al pivote: ya están en su lugar
    if (j + 1 <= i - 1) yield { tipo: "ordenado", desde: j + 1, hasta: i - 1, linea: 24 };

    // 3. Primero se procesa la parte más chica (la pila no crece de más)
    if (j - lo > hi - i) { pila.push([lo, j]); pila.push([i, hi]); }
    else                 { pila.push([i, hi]); pila.push([lo, j]); }
  }
}

function* insercion(arr, lo, hi) {
  for (let k = lo + 1; k <= hi; k++) {
    let m = k;
    while (m > lo) {
      yield { tipo: "comparar", i: m - 1, j: m, linea: 31 };
      if (arr[m - 1] <= arr[m]) break;
      intercambiar(arr, m - 1, m);
      yield { tipo: "swap", i: m - 1, j: m, linea: 32 };
      m--;
    }
  }
}

// ------------------------------------------------------------
//  Código que se muestra en pantalla (versión limpia, sin yields).
//  Los números de `linea` de arriba apuntan a estas líneas (1 = primera).
// ------------------------------------------------------------
const CODIGO = {
  quick: `function quickSort(arr, lo, hi) {
  if (lo >= hi) return;
  // dividir: el pivote queda en su lugar
  const p = particion(arr, lo, hi);
  quickSort(arr, lo, p - 1);  // izquierda
  quickSort(arr, p + 1, hi);  // derecha
}

function particion(arr, lo, hi) {
  const pivote = arr[hi];     // el último
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivote) {
      i++;
      intercambiar(arr, i, j);
    }
  }
  intercambiar(arr, i + 1, hi);
  return i + 1;
}`,
  rapid: `function rapidSort(arr) {
  const pila = [[0, arr.length - 1]];
  while (pila.length > 0) {
    const [lo, hi] = pila.pop();
    if (hi - lo < 12) {         // chico: inserción
      insercion(arr, lo, hi); continue;
    }
    // mediana de tres → pivote
    const medio = (lo + hi) >> 1;
    if (arr[medio] < arr[lo]) intercambiar(arr, lo, medio);
    if (arr[hi] < arr[lo])    intercambiar(arr, lo, hi);
    if (arr[hi] < arr[medio]) intercambiar(arr, medio, hi);
    const pivote = arr[medio];
    // partición de Hoare
    let i = lo, j = hi;
    while (i <= j) {
      while (arr[i] < pivote) i++;
      while (arr[j] > pivote) j--;
      if (i <= j) {
        intercambiar(arr, i, j); i++; j--;
      }
    }
    // la parte más chica primero
    pila.push([lo, j], [i, hi]);  // (iguales al pivote: fijos)
  }
}

function insercion(arr, lo, hi) {
  for (let k = lo + 1; k <= hi; k++)
    for (let m = k; m > lo; m--) {
      if (arr[m - 1] <= arr[m]) break;
      intercambiar(arr, m - 1, m);
    }
}`,
};

const ALGORITMOS = {
  quick: {
    nombre: "Quick",
    generador: (arr) => quickSort(arr),
    resumen:
      "Elige como pivote el último elemento, manda los menores a la izquierda y lo deja en su lugar definitivo. Después repite lo mismo, recursivamente, a cada lado.",
    datos: [["Promedio", "O(n log n)"], ["Peor caso", "O(n²)"], ["Memoria", "O(log n)"], ["Estable", "No"]],
  },
  rapid: {
    nombre: "Rapid",
    generador: (arr) => rapidSort(arr),
    resumen:
      "Quick Sort con esteroides: pivote por mediana de tres, partición de Hoare con dos punteros que se cruzan, e inserción para los pedazos chicos.",
    datos: [["Promedio", "O(n log n)"], ["Peor caso", "O(n²) · rarísimo"], ["Memoria", "O(log n)"], ["Estable", "No"]],
  },
};
