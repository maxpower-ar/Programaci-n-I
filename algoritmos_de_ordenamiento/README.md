# Algoritmos de Ordenación — Quick Sort y Rapid Sort

Demo visual para Programación I (ITR). Cada valor del arreglo es una barra; su altura es el valor.

**Verla online:** https://maxpower-ar.github.io/Programaci-n-I/algoritmos_de_ordenamiento/

## Qué se puede hacer

- Elegir **Quick Sort**, **Rapid Sort** o **Duelo** (los dos a la vez sobre el mismo arreglo).
- Cambiar la cantidad de elementos (10 a 1000) y la velocidad (de 0,5 operaciones por segundo hasta ~150.000).
- Elegir los datos de entrada: aleatorio, casi ordenado, invertido o con muchos repetidos.
- Avanzar de a un paso y ver qué línea del código se está ejecutando.
- Activar sonido: cada operación suena según la altura de la barra.
- QR y link para abrirla desde el celu.

Atajos: `espacio` ordenar/pausa · `→` paso · `R` mezclar · `1` `2` `3` algoritmo · `↑` `↓` velocidad · `M` sonido · `T` tema · `F` pantalla completa.

## Los dos algoritmos

| | Quick Sort | Rapid Sort |
|---|---|---|
| Pivote | el último elemento | mediana de tres (primero, medio, último) |
| Partición | Lomuto (un puntero) | Hoare (dos punteros que se cruzan) |
| Subarreglos chicos | sigue partiendo | ordenamiento por inserción (≤ 12) |
| Peor caso | O(n²) con datos ya ordenados o invertidos | O(n²), pero en la práctica casi imposible |

Para ver la diferencia: **Duelo** + **Invertido** + 1000 elementos.

## Archivos

- `algoritmos.js`: los dos algoritmos, escritos como generadores (`function*`) que avisan cada comparación e intercambio.
- `visualizador.js`: dibuja las barras en un `<canvas>` y maneja los controles.
- `estilos.css`, `index.html`: la página.

Para abrirla, alcanza con abrir `index.html` en el navegador.

## Publicarla (GitHub Pages)

En el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**. Al minuto queda en el link de arriba y el QR apunta ahí.
