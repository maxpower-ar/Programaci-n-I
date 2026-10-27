# Algoritmos de Ordenación — Quick Sort y Random Sort

Demo visual para Programación I (ITR). Cada valor del arreglo es una barra; su altura es el valor.

**Verla online:** https://maxpower-ar.github.io/Programaci-n-I/algoritmos_de_ordenamiento/

## Qué se puede hacer

- Elegir **Quick Sort**, **Random Sort** o **Duelo** (los dos a la vez sobre el mismo arreglo).
- Cambiar la cantidad de elementos (2 a 500, recomendado 100): con el deslizador va de 2 en 2, o tocando el número se puede escribir a mano.
- Cambiar la velocidad (de 0,5 operaciones por segundo hasta ~150.000; recomendada ~190).
- Avanzar de a un paso y ver qué línea del código se está ejecutando.
- Activar sonido: cada operación suena según la altura de la barra.
- QR y link para abrirla desde el celu.

Atajos: `espacio` ordenar/pausa · `→` paso · `R` mezclar · `1` `2` `3` algoritmo · `↑` `↓` velocidad · `M` sonido · `T` tema · `F` pantalla completa.

## Los dos algoritmos

| | Quick Sort | Random Sort (Bogosort) |
|---|---|---|
| Idea | elegir un pivote (el último), separar menores y mayores, repetir en cada parte | ¿está ordenado? si no, mezclar todo al azar y volver a probar |
| Mejor caso | O(n log n) | O(n) |
| Promedio | O(n log n) | O(n · n!) |
| Peor caso | O(n²) | no acotado |
| Memoria | O(log n) | O(1) |

Random Sort con 100 elementos no termina nunca (hay 100! ≈ 9,3 × 10¹⁵⁷ órdenes posibles). Para verlo ordenar, escribí 5 o 6 en Elementos. En **Duelo**, Quick termina y Random se queda mezclando.

## Archivos

- `algoritmos.ts`: los dos algoritmos, escritos como generadores (`function*`) que avisan cada comparación e intercambio.
- `visualizador.ts`: dibuja las barras en un `<canvas>` y maneja los controles.
- `algoritmos.js`, `visualizador.js`: lo que genera `tsc` (es lo que carga la página).
- `estilos.css`, `index.html`: la página.

Si cambiás algún `.ts`, recompilá desde esta carpeta con:

```
tsc
```

Para abrirla, alcanza con abrir `index.html` en el navegador.

## Publicarla (GitHub Pages)

En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**. Al minuto queda en el link de arriba y el QR apunta ahí.
