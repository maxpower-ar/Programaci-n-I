# Algoritmos de Ordenación — Quick Sort y Random Sort

Demo visual para Programación I (ITR). Cada valor del arreglo es una barra; su altura es el valor.

**Verla online:** https://maxpower-ar.github.io/Programaci-n-I/algoritmos_de_ordenamiento/

## Qué se puede hacer

- Elegir **Quick Sort**, **Random Sort** o **Duelo** (los dos a la vez sobre el mismo arreglo).
- Cambiar la cantidad de elementos (10 a 1000) y la velocidad (de 0,5 operaciones por segundo hasta ~150.000).
- Elegir los datos de entrada: aleatorio, casi ordenado, invertido o con muchos repetidos.
- Avanzar de a un paso y ver qué línea del código se está ejecutando.
- Activar sonido: cada operación suena según la altura de la barra.
- QR y link para abrirla desde el celu.

Atajos: `espacio` ordenar/pausa · `→` paso · `R` mezclar · `1` `2` `3` algoritmo · `↑` `↓` velocidad · `M` sonido · `T` tema · `F` pantalla completa.

## Los dos algoritmos

Son el mismo algoritmo (divide y vencerás, partición de Lomuto). Lo único que cambia es **cómo se elige el pivote**:

| | Quick Sort | Random Sort |
|---|---|---|
| Pivote | siempre el último elemento | un elemento al azar del subarreglo |
| Promedio | O(n log n) | O(n log n) |
| Peor caso | O(n²) con datos ya ordenados o invertidos | O(n²), pero no depende de los datos: es casi imposible |

Para ver la diferencia: **Duelo** + **Invertido** + 1000 elementos.

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
