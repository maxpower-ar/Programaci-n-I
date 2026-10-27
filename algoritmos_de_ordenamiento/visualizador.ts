// ============================================================
//  Visualizador: dibuja el arreglo como barras en un <canvas>
//  y va pidiéndole pasos al algoritmo (ver algoritmos.ts).
// ============================================================

// Librería del QR (se carga desde index.html)
declare const QRCode: any;

const URL_PUBLICA: string = "https://maxpower-ar.github.io/Programaci-n-I/algoritmos_de_ordenamiento/";

type ModoAlgoritmo = ClaveAlgoritmo | "duelo";
type Distribucion = "aleatorio" | "casi" | "invertido" | "pocos";
type EstadoCorredor = "listo" | "corriendo" | "pausado" | "terminado";
type Color = "barra" | "cmp" | "swap" | "pivote" | "listo" | "rango";

function $<T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document): T {
  return raiz.querySelector(sel) as T;
}
function $$<T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document): T[] {
  return [...raiz.querySelectorAll<T>(sel)];
}

const estado = {
  alg: "quick" as ModoAlgoritmo,
  dist: "aleatorio" as Distribucion,
  n: 150,
  base: [] as number[],          // arreglo original (desordenado)
  corriendo: false,
  velocidad: 58,                 // 0..100 del slider
  sonido: false,
  pestana: "quick" as ClaveAlgoritmo, // código visible en modo duelo
};

const colores = {} as Record<Color, string>;

function leerColores(): void {
  const css = getComputedStyle(document.documentElement);
  for (const nombre of ["barra", "cmp", "swap", "pivote", "listo", "rango"] as Color[]) {
    colores[nombre] = css.getPropertyValue("--c-" + nombre).trim();
  }
}

// ------------------------------------------------------------
//  Datos de entrada
// ------------------------------------------------------------
function mezclar<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generarDatos(n: number, dist: Distribucion): number[] {
  const ordenado: number[] = Array.from({ length: n }, (_, i) => i + 1);
  switch (dist) {
    case "invertido":
      return ordenado.reverse();
    case "casi": {
      // ordenado, con algunos vecinos desacomodados
      const cambios = Math.max(2, Math.round(n * 0.06));
      for (let c = 0; c < cambios; c++) {
        const i = Math.floor(Math.random() * n);
        const j = Math.min(n - 1, i + 1 + Math.floor(Math.random() * 6));
        [ordenado[i], ordenado[j]] = [ordenado[j], ordenado[i]];
      }
      return ordenado;
    }
    case "pocos": {
      // sólo 6 alturas distintas, muchísimos repetidos
      const niveles = 6;
      return mezclar(ordenado.map(() => Math.ceil((Math.ceil(Math.random() * niveles) / niveles) * n)));
    }
    default:
      return mezclar(ordenado);
  }
}

// ------------------------------------------------------------
//  Velocidad: el slider (0..100) se convierte en operaciones por
//  segundo. Hasta 40 es "modo explicación" (de 0,5 a 30 op/s);
//  de ahí en más crece rapidísimo hasta ~150.000 op/s.
// ------------------------------------------------------------
function opsPorSegundo(v: number): number {
  return v <= 40 ? 0.5 * Math.pow(60, v / 40) : 30 * Math.pow(5000, (v - 40) / 60);
}

function formatearVelocidad(ops: number): string {
  if (ops < 10) return ops.toFixed(1).replace(".", ",") + " op/s";
  if (ops < 1000) return Math.round(ops) + " op/s";
  return (ops / 1000).toFixed(ops < 10000 ? 1 : 0).replace(".", ",") + "k op/s";
}

const fmt = new Intl.NumberFormat("es-AR");

// ------------------------------------------------------------
//  Sonido (opcional): cada operación suena con una altura
//  proporcional al valor de la barra.
// ------------------------------------------------------------
let audio: AudioContext | null = null;
let salida: GainNode | null = null;

function prepararAudio(): void {
  if (audio) return;
  const Ctx: typeof AudioContext | undefined = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return;
  audio = new Ctx();
  salida = audio.createGain();
  salida.gain.value = 0.5;
  salida.connect(audio.destination);
}

function tono(valor: number, maximo: number, duracion: number = 0.07): void {
  if (!estado.sonido || !audio || !salida) return;
  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = "triangle";
  osc.frequency.value = 160 + (valor / maximo) * 1100;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.09, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
  osc.connect(env).connect(salida);
  osc.start(t);
  osc.stop(t + duracion + 0.02);
}

// ------------------------------------------------------------
//  Corredor: un algoritmo corriendo sobre su propio arreglo,
//  dibujado en su propio canvas.
// ------------------------------------------------------------
const NOMBRES_ESTADO: Record<EstadoCorredor, string> = {
  listo: "listo", corriendo: "ordenando", pausado: "pausado", terminado: "ordenado",
};

class Corredor {
  figura: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  hud: { nombre: HTMLElement; cmp: HTMLElement; swp: HTMLElement; estado: HTMLElement; reglaFin: HTMLElement };
  ancho = 0;
  alto = 0;

  alg: ClaveAlgoritmo = "quick";
  arr: number[] = [];
  max = 1;
  listo = new Uint8Array(0);
  gen: Pasos | null = null;
  comparaciones = 0;
  intercambios = 0;
  linea = 0;
  rango: [number, number] | null = null;
  pivote = -1;
  tocadosCmp: number[] = [];
  tocadosSwp: number[] = [];
  terminado = false;
  barrido = -1;   // posición de la pasada final de verificación
  ganador = false;
  estado: EstadoCorredor | null = null;

  constructor(figura: HTMLElement) {
    this.figura = figura;
    this.canvas = $<HTMLCanvasElement>("canvas", figura);
    this.ctx = this.canvas.getContext("2d")!;
    this.hud = {
      nombre: $(".hud-nombre", figura),
      cmp: $(".hud-cmp", figura),
      swp: $(".hud-swp", figura),
      estado: $(".hud-estado", figura),
      reglaFin: $(".regla-fin", figura),
    };
    new ResizeObserver(() => this.medir()).observe(this.canvas);
  }

  medir(): void {
    const dpr = window.devicePixelRatio || 1;
    const r = this.canvas.getBoundingClientRect();
    this.ancho = r.width;
    this.alto = r.height;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dibujar();
  }

  preparar(alg: ClaveAlgoritmo, base: number[]): void {
    this.alg = alg;
    this.arr = base.slice();
    this.max = Math.max(...this.arr);
    this.listo = new Uint8Array(this.arr.length);
    this.gen = null;
    this.comparaciones = 0;
    this.intercambios = 0;
    this.linea = 0;
    this.rango = null;
    this.pivote = -1;
    this.tocadosCmp = [];
    this.tocadosSwp = [];
    this.terminado = false;
    this.barrido = -1;
    this.ganador = false;
    this.figura.classList.remove("ganador");
    this.hud.nombre.textContent = ALGORITMOS[alg].nombre + " Sort";
    this.hud.reglaFin.textContent = String(this.arr.length - 1);
    this.ponerEstado("listo");
    this.actualizarHud();
    this.dibujar();
  }

  ponerEstado(e: EstadoCorredor): void {
    if (this.estado === e) return;
    this.estado = e;
    this.figura.dataset.estado = e;
    this.hud.estado.textContent = NOMBRES_ESTADO[e];
  }

  // Avanza `presupuesto` operaciones (comparaciones o intercambios).
  avanzar(presupuesto: number): void {
    if (this.terminado) return;
    if (!this.gen) this.gen = ALGORITMOS[this.alg].generador(this.arr);
    this.tocadosCmp.length = 0;
    this.tocadosSwp.length = 0;
    let ultimo = -1;
    while (presupuesto > 0) {
      const r = this.gen.next();
      if (r.done) {
        this.terminado = true;
        this.barrido = 0;
        this.rango = null;
        this.pivote = -1;
        break;
      }
      const ev: Evento = r.value;
      this.linea = ev.linea;
      switch (ev.tipo) {
        case "comparar":
          this.comparaciones++;
          presupuesto--;
          if (this.tocadosCmp.length < 48) this.tocadosCmp.push(ev.i, ev.j);
          ultimo = ev.i;
          break;
        case "swap":
          this.intercambios++;
          presupuesto--;
          if (this.tocadosSwp.length < 48) this.tocadosSwp.push(ev.i, ev.j);
          if (this.pivote === ev.i) this.pivote = ev.j;
          else if (this.pivote === ev.j) this.pivote = ev.i;
          ultimo = ev.j;
          break;
        case "rango":
          this.rango = [ev.lo, ev.hi];
          this.pivote = -1;
          break;
        case "pivote":
          this.pivote = ev.i;
          break;
        case "ordenado":
          this.listo.fill(1, ev.desde, ev.hasta + 1);
          break;
      }
    }
    if (ultimo >= 0) tono(this.arr[ultimo], this.max);
  }

  // Pasada final: recorre las barras de izquierda a derecha
  avanzarBarrido(): void {
    if (this.barrido < 0 || this.barrido >= this.arr.length) return;
    const paso = Math.max(1, Math.ceil(this.arr.length / 50));
    this.barrido = Math.min(this.arr.length, this.barrido + paso);
    tono(this.arr[this.barrido - 1], this.max, 0.05);
  }

  actualizarHud(): void {
    this.hud.cmp.textContent = fmt.format(this.comparaciones);
    this.hud.swp.textContent = fmt.format(this.intercambios);
  }

  dibujar(): void {
    const { ctx, ancho, alto, arr } = this;
    if (!arr.length || !ancho) return;
    ctx.clearRect(0, 0, ancho, alto);

    const n = arr.length;
    const anchoBarra = ancho / n;
    const hueco = anchoBarra >= 5 ? Math.min(2, anchoBarra * 0.2) : 0;
    const arriba = 38;                      // espacio para el HUD
    const altoUtil = alto - arriba - 1;

    // Banda del subarreglo en el que se está trabajando
    if (this.rango) {
      const [lo, hi] = this.rango;
      ctx.fillStyle = colores.rango;
      ctx.fillRect(lo * anchoBarra, 0, (hi - lo + 1) * anchoBarra, alto);
    }

    // Color de cada barra según lo que está pasando
    const color: Color[] = new Array(n);
    const enBarrido = this.barrido >= 0;
    for (let i = 0; i < n; i++) {
      if (enBarrido) color[i] = i < this.barrido ? "listo" : "barra";
      else color[i] = this.listo[i] ? "listo" : "barra";
    }
    if (!enBarrido) {
      if (this.pivote >= 0) color[this.pivote] = "pivote";
      for (const i of this.tocadosCmp) if (i >= 0) color[i] = "cmp";
      for (const i of this.tocadosSwp) if (i >= 0) color[i] = "swap";
    } else if (this.barrido < n) {
      color[this.barrido] = "swap";
    }

    // Se dibuja agrupado por color: cambiar fillStyle es lo que más cuesta
    for (const c of ["barra", "listo", "pivote", "cmp", "swap"] as Color[]) {
      ctx.fillStyle = colores[c];
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        if (color[i] !== c) continue;
        const h = Math.max(1, (arr[i] / this.max) * altoUtil);
        ctx.rect(i * anchoBarra + hueco / 2, alto - h, Math.max(0.6, anchoBarra - hueco), h);
      }
      ctx.fill();
    }

    // Marcador triangular sobre el pivote
    if (!enBarrido && this.pivote >= 0) {
      const x = (this.pivote + 0.5) * anchoBarra;
      const h = (arr[this.pivote] / this.max) * altoUtil;
      const y = alto - h - 6;
      ctx.fillStyle = colores.pivote;
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 7);
      ctx.lineTo(x + 5, y - 7);
      ctx.lineTo(x, y);
      ctx.fill();
    }
  }
}

const corredores: Corredor[] = $$(".escenario").map((f) => new Corredor(f));

function corredoresActivos(): Corredor[] {
  return estado.alg === "duelo" ? corredores : [corredores[0]];
}

// ------------------------------------------------------------
//  Título: al cambiar de algoritmo, las letras se "ordenan"
//  solas (con inserción, obvio) hasta formar el nombre nuevo.
// ------------------------------------------------------------
const palabra = $("#palabra");
let idAnimacion = 0;

interface Letra { ch: string; idx: number }

function animarPalabra(texto: string): void {
  const id = ++idAnimacion;
  const letras: Letra[] = [...texto].map((ch, idx) => ({ ch, idx }));
  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pintar = (lista: Letra[], moviendo: number[] = []): void => {
    palabra.replaceChildren(
      ...lista.map((l, k) => {
        const s = document.createElement("span");
        s.className = "letra" + (moviendo.includes(k) ? " moviendo" : "");
        s.textContent = l.ch === " " ? " " : l.ch;
        return s;
      })
    );
  };

  if (reducir) return pintar(letras);

  mezclar(letras);
  if (letras.every((l, k) => l.idx === k) && letras.length > 1) {
    [letras[0], letras[1]] = [letras[1], letras[0]];
  }

  // Se calculan de antemano los intercambios del ordenamiento por inserción
  const pasos: number[] = [];
  const copia = letras.slice();
  for (let k = 1; k < copia.length; k++) {
    for (let m = k; m > 0 && copia[m - 1].idx > copia[m].idx; m--) {
      [copia[m - 1], copia[m]] = [copia[m], copia[m - 1]];
      pasos.push(m);
    }
  }

  pintar(letras);
  const intervalo = Math.max(28, Math.min(70, 700 / pasos.length));
  let p = 0;
  const tic = (): void => {
    if (id !== idAnimacion) return;
    if (p >= pasos.length) return pintar(letras);
    const m = pasos[p++];
    [letras[m - 1], letras[m]] = [letras[m], letras[m - 1]];
    pintar(letras, [m - 1, m]);
    setTimeout(tic, intervalo);
  };
  setTimeout(tic, 120);
}

// ------------------------------------------------------------
//  Panel de código
// ------------------------------------------------------------
const PALABRAS_CLAVE = /\b(function|const|let|if|for|while|return|continue|break)\b/g;
const TIPOS = /\b(number|void|boolean|string)\b/g;
const FUNCIONES = /\b(quickSort|randomSort|particion|intercambiar)\b/g;

function escapar(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function resaltar(linea: string): string {
  const corte = linea.indexOf("//");
  const codigo = corte >= 0 ? linea.slice(0, corte) : linea;
  const comentario = corte >= 0 ? linea.slice(corte) : "";
  let html = escapar(codigo)
    .replace(PALABRAS_CLAVE, '<span class="kw">$1</span>')
    .replace(TIPOS, '<span class="ty">$1</span>')
    .replace(FUNCIONES, '<span class="fn">$1</span>');
  if (comentario) html += '<span class="cm">' + escapar(comentario) + "</span>";
  return html;
}

let codigoMostrado: ClaveAlgoritmo | null = null;
let lineaActiva = 0;

function mostrarCodigo(alg: ClaveAlgoritmo): void {
  if (codigoMostrado === alg) return;
  codigoMostrado = alg;
  lineaActiva = 0;
  $("#codigo").innerHTML = CODIGO[alg]
    .split("\n")
    .map((l) => '<span class="ln">' + (resaltar(l) || " ") + "</span>")
    .join("");
}

function marcarLinea(n: number): void {
  if (n === lineaActiva) return;
  const lineas = $("#codigo").children;
  if (lineaActiva) lineas[lineaActiva - 1]?.classList.remove("activa");
  lineaActiva = n;
  if (n) lineas[n - 1]?.classList.add("activa");
}

// ------------------------------------------------------------
//  Textos según el algoritmo
// ------------------------------------------------------------
const BAJADAS: Record<ModoAlgoritmo, string> = {
  quick: "<b>Quick Sort</b> · divide y vencerás · pivote = último elemento · partición de Lomuto",
  random: "<b>Random Sort</b> · Quick Sort aleatorizado · pivote = un elemento al azar · partición de Lomuto",
  duelo: "<b>Duelo</b> · los dos algoritmos, el mismo arreglo, la misma velocidad. ¿Quién termina primero?",
};

function actualizarTextos(): void {
  const clave: ClaveAlgoritmo = estado.alg === "duelo" ? estado.pestana : estado.alg;
  const info = ALGORITMOS[clave];
  $("#bajada").innerHTML = BAJADAS[estado.alg];
  $("#resumen").textContent = info.resumen;
  $("#fichas").innerHTML = info.datos.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  mostrarCodigo(clave);
  const nombre = estado.alg === "duelo" ? "Quick vs Random" : info.nombre;
  document.title = `${nombre} Sort · Algoritmos de Ordenación — Programación I`;
}

// ------------------------------------------------------------
//  Acciones
// ------------------------------------------------------------
function reiniciar(nuevosDatos: boolean): void {
  if (nuevosDatos || estado.base.length !== estado.n) estado.base = generarDatos(estado.n, estado.dist);
  pausar();
  if (estado.alg === "duelo") {
    corredores[0].preparar("quick", estado.base);
    corredores[1].preparar("random", estado.base);
  } else {
    corredores[0].preparar(estado.alg, estado.base);
  }
  marcarLinea(0);
}

function arrancar(): void {
  if (corredoresActivos().every((c) => c.terminado)) reiniciar(false);
  estado.corriendo = true;
  for (const c of corredoresActivos()) if (!c.terminado) c.ponerEstado("corriendo");
  actualizarBotonPlay();
}

function pausar(): void {
  estado.corriendo = false;
  for (const c of corredoresActivos()) if (!c.terminado && c.gen) c.ponerEstado("pausado");
  actualizarBotonPlay();
}

function alternar(): void {
  estado.corriendo ? pausar() : arrancar();
}

function unPaso(): void {
  pausar();
  for (const c of corredoresActivos()) {
    if (c.terminado) continue;
    c.avanzar(1);
    c.ponerEstado(c.terminado ? "terminado" : "pausado");
    c.actualizarHud();
  }
}

function actualizarBotonPlay(): void {
  const btn = $("#btnPlay");
  const algunoEmpezado = corredoresActivos().some((c) => c.gen && !c.terminado);
  $(".btn-txt", btn).textContent = estado.corriendo ? "Pausa" : algunoEmpezado ? "Seguir" : "Ordenar";
  btn.classList.toggle("corriendo", estado.corriendo);
}

function elegirAlgoritmo(alg: ModoAlgoritmo): void {
  if (alg === estado.alg) return;
  estado.alg = alg;
  $$(".segmentado button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.alg === alg)));
  const duelo = alg === "duelo";
  $("#escenarios").classList.toggle("duelo", duelo);
  corredores[1].figura.hidden = !duelo;
  $("#pestanas").hidden = !duelo;
  $(".titulo-sort").classList.toggle("es-duelo", duelo);
  animarPalabra(alg === "duelo" ? "Quick×Random" : ALGORITMOS[alg].nombre);
  actualizarTextos();
  reiniciar(false);
}

function elegirDistribucion(dist: Distribucion): void {
  estado.dist = dist;
  $$(".chips button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.dist === dist)));
  reiniciar(true);
}

function pintarSlider(input: HTMLInputElement): void {
  const p = ((+input.value - +input.min) / (+input.max - +input.min)) * 100;
  input.style.setProperty("--p", p + "%");
}

function cambiarVelocidad(v: number): void {
  estado.velocidad = Math.max(0, Math.min(100, v));
  const input = $<HTMLInputElement>("#rngV");
  input.value = String(estado.velocidad);
  pintarSlider(input);
  $("#outV").textContent = formatearVelocidad(opsPorSegundo(estado.velocidad));
}

// ------------------------------------------------------------
//  Bucle de animación
// ------------------------------------------------------------
let tiempoAnterior = performance.now();
let acumulado = 0;
let ultimoCuadroBarrido = 0;

function cuadro(t: number): void {
  const dt = Math.min(100, t - tiempoAnterior);
  tiempoAnterior = t;
  const activos = corredoresActivos();

  if (estado.corriendo) {
    acumulado += (dt / 1000) * opsPorSegundo(estado.velocidad);
    const ops = Math.floor(acumulado);
    acumulado -= ops;
    if (ops > 0) {
      for (const c of activos) {
        if (c.terminado) continue;
        c.avanzar(ops);
        c.actualizarHud();
        if (c.terminado) {
          c.ponerEstado("terminado");
          if (estado.alg === "duelo" && !activos.some((o) => o !== c && o.ganador)) {
            const rival = activos.find((o) => o !== c)!;
            if (!rival.terminado || c.comparaciones + c.intercambios <= rival.comparaciones + rival.intercambios) {
              c.ganador = true;
              c.figura.classList.add("ganador");
            }
          }
        }
      }
      if (activos.every((c) => c.terminado)) {
        estado.corriendo = false;
        actualizarBotonPlay();
      }
    }
  } else {
    acumulado = 0;
  }

  // La pasada final de verificación va a ritmo fijo (~60 cuadros)
  if (t - ultimoCuadroBarrido > 14) {
    ultimoCuadroBarrido = t;
    for (const c of activos) c.avanzarBarrido();
  }

  for (const c of activos) c.dibujar();

  const fuente = estado.alg === "duelo" ? corredores[estado.pestana === "quick" ? 0 : 1] : corredores[0];
  marcarLinea(fuente.terminado ? 0 : fuente.linea);

  requestAnimationFrame(cuadro);
}

// ------------------------------------------------------------
//  Compartir: QR + link
// ------------------------------------------------------------
function urlParaCompartir(): string {
  const publica = /^https?:$/.test(location.protocol) &&
    !/^(localhost|127\.|10\.|192\.168\.|\[::1\])/.test(location.hostname);
  return publica ? location.origin + location.pathname : URL_PUBLICA;
}

function prepararCompartir(): void {
  const url = urlParaCompartir();
  const enlace = $<HTMLAnchorElement>("#enlace");
  enlace.href = url;
  enlace.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (typeof QRCode !== "undefined") {
    new QRCode($("#qr"), {
      text: url,
      width: 240,
      height: 240,
      colorDark: "#16140f",
      colorLight: "#f3eee2",
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    $("#qr").hidden = true;
  }
  $("#btnCopiar").addEventListener("click", async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = "¡Copiado!";
    } catch {
      btn.textContent = "Copialo de arriba";
    }
    setTimeout(() => (btn.textContent = "Copiar link"), 1600);
  });
}

// ------------------------------------------------------------
//  Tema y pantalla completa
// ------------------------------------------------------------
function aplicarTema(tema: string): void {
  document.documentElement.dataset.tema = tema;
  $<HTMLMetaElement>('meta[name="theme-color"]').content = tema === "papel" ? "#efe9dc" : "#0f0e0c";
  leerColores();
  for (const c of corredores) c.dibujar();
  try { localStorage.setItem("ordenacion-tema", tema); } catch {}
}

function alternarTema(): void {
  aplicarTema(document.documentElement.dataset.tema === "papel" ? "tinta" : "papel");
}

function alternarPantallaCompleta(): void {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

function alternarSonido(): void {
  estado.sonido = !estado.sonido;
  if (estado.sonido) { prepararAudio(); audio?.resume(); }
  $("#btnSonido").setAttribute("aria-pressed", String(estado.sonido));
}

// ------------------------------------------------------------
//  Eventos
// ------------------------------------------------------------
function conectar(): void {
  $$(".segmentado button").forEach((b) => b.addEventListener("click", () => elegirAlgoritmo(b.dataset.alg as ModoAlgoritmo)));
  $$(".chips button").forEach((b) => b.addEventListener("click", () => elegirDistribucion(b.dataset.dist as Distribucion)));
  $$("#pestanas button").forEach((b) =>
    b.addEventListener("click", () => {
      estado.pestana = b.dataset.cod as ClaveAlgoritmo;
      $$("#pestanas button").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      actualizarTextos();
    })
  );

  const rngN = $<HTMLInputElement>("#rngN");
  rngN.addEventListener("input", () => {
    estado.n = +rngN.value;
    $("#outN").textContent = String(estado.n);
    pintarSlider(rngN);
    reiniciar(true);
  });

  const rngV = $<HTMLInputElement>("#rngV");
  rngV.addEventListener("input", () => cambiarVelocidad(+rngV.value));

  $("#btnPlay").addEventListener("click", alternar);
  $("#btnPaso").addEventListener("click", unPaso);
  $("#btnMezclar").addEventListener("click", () => reiniciar(true));
  $("#btnSonido").addEventListener("click", alternarSonido);
  $("#btnTema").addEventListener("click", alternarTema);
  $("#btnPantalla").addEventListener("click", alternarPantallaCompleta);

  // Con el mouse, que los botones no se queden con el foco (así la
  // barra espaciadora siempre es "ordenar / pausa")
  document.addEventListener("pointerup", (e) => {
    const b = (e.target as Element).closest("button");
    if (b && e.pointerType === "mouse") b.blur();
  });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const enFoco = document.activeElement as HTMLElement | null;
    const enSlider = enFoco instanceof HTMLInputElement && enFoco.type === "range";
    const enBoton = enFoco instanceof HTMLButtonElement;
    switch (e.key) {
      case " ":
        if (enBoton) return;
        e.preventDefault(); alternar(); break;
      case "ArrowRight":
        if (enSlider) return;
        e.preventDefault(); unPaso(); break;
      case "ArrowUp":
        if (enSlider) return;
        e.preventDefault(); cambiarVelocidad(estado.velocidad + 5); break;
      case "ArrowDown":
        if (enSlider) return;
        e.preventDefault(); cambiarVelocidad(estado.velocidad - 5); break;
      case "r": case "R": reiniciar(true); break;
      case "1": elegirAlgoritmo("quick"); break;
      case "2": elegirAlgoritmo("random"); break;
      case "3": elegirAlgoritmo("duelo"); break;
      case "m": case "M": alternarSonido(); break;
      case "t": case "T": alternarTema(); break;
      case "f": case "F": alternarPantallaCompleta(); break;
    }
  });
}

// ------------------------------------------------------------
//  Arranque
// ------------------------------------------------------------
(function iniciar(): void {
  let tema = "tinta";
  try { tema = localStorage.getItem("ordenacion-tema") || tema; } catch {}
  aplicarTema(tema);

  conectar();
  pintarSlider($<HTMLInputElement>("#rngN"));
  cambiarVelocidad(estado.velocidad);
  actualizarTextos();
  animarPalabra("Quick");
  reiniciar(true);
  prepararCompartir();
  requestAnimationFrame(cuadro);
})();
