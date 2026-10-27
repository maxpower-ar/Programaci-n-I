"use strict";
// ============================================================
//  Visualizador: dibuja el arreglo como barras en un <canvas>
//  y va pidiéndole pasos al algoritmo (ver algoritmos.ts).
// ============================================================
const URL_PUBLICA = "https://maxpower-ar.github.io/Programaci-n-I/algoritmos_de_ordenamiento/";
// Valores recomendados para la presentación
const N_RECOMENDADO = 100;
const VELOCIDAD_RECOMENDADA = 53; // ~190 operaciones por segundo
function $(sel, raiz = document) {
    return raiz.querySelector(sel);
}
function $$(sel, raiz = document) {
    return [...raiz.querySelectorAll(sel)];
}
const estado = {
    alg: "quick",
    n: N_RECOMENDADO,
    base: [], // arreglo original (desordenado)
    corriendo: false,
    velocidad: VELOCIDAD_RECOMENDADA, // 0..100 del slider
    sonido: false,
    pestana: "quick", // código visible en modo duelo
};
const colores = {};
function leerColores() {
    const css = getComputedStyle(document.documentElement);
    for (const nombre of ["barra", "cmp", "swap", "pivote", "listo", "rango"]) {
        colores[nombre] = css.getPropertyValue("--c-" + nombre).trim();
    }
}
// ------------------------------------------------------------
//  Datos de entrada
// ------------------------------------------------------------
function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
// Los valores 1..n en orden aleatorio
function generarDatos(n) {
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    do
        mezclar(arr);
    while (n > 1 && arr.every((v, i) => v === i + 1));
    return arr;
}
// n! escrito como "9,3 × 10^157" (con logaritmos, porque no entra en un number)
function factorialAproximado(n) {
    let log10 = 0;
    for (let k = 2; k <= n; k++)
        log10 += Math.log10(k);
    if (log10 < 9)
        return fmt.format(Math.round(Math.pow(10, log10)));
    const exp = Math.floor(log10);
    const mantisa = Math.pow(10, log10 - exp).toFixed(1).replace(".", ",");
    return `${mantisa} × 10<sup>${exp}</sup>`;
}
// ------------------------------------------------------------
//  Velocidad: el slider (0..100) se convierte en operaciones por
//  segundo. Hasta 40 es "modo explicación" (de 0,5 a 30 op/s);
//  de ahí en más crece rapidísimo hasta ~150.000 op/s.
// ------------------------------------------------------------
function opsPorSegundo(v) {
    return v <= 40 ? 0.5 * Math.pow(60, v / 40) : 30 * Math.pow(5000, (v - 40) / 60);
}
function formatearVelocidad(ops) {
    if (ops < 10)
        return ops.toFixed(1).replace(".", ",") + " op/s";
    if (ops < 1000)
        return Math.round(ops) + " op/s";
    return (ops / 1000).toFixed(ops < 10000 ? 1 : 0).replace(".", ",") + "k op/s";
}
const fmt = new Intl.NumberFormat("es-AR");
// ------------------------------------------------------------
//  Sonido (opcional): cada operación suena con una altura
//  proporcional al valor de la barra.
// ------------------------------------------------------------
let audio = null;
let salida = null;
function prepararAudio() {
    if (audio)
        return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx)
        return;
    audio = new Ctx();
    salida = audio.createGain();
    salida.gain.value = 0.5;
    salida.connect(audio.destination);
}
function tono(valor, maximo, duracion = 0.07) {
    if (!estado.sonido || !audio || !salida)
        return;
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
const NOMBRES_ESTADO = {
    listo: "listo", corriendo: "ordenando", pausado: "pausado", terminado: "ordenado",
};
class Corredor {
    constructor(figura) {
        this.ancho = 0;
        this.alto = 0;
        this.alg = "quick";
        this.arr = [];
        this.max = 1;
        this.listo = new Uint8Array(0);
        this.gen = null;
        this.comparaciones = 0;
        this.intercambios = 0;
        this.mezclas = 0;
        this.linea = 0;
        this.rango = null;
        this.pivote = -1;
        this.tocadosCmp = [];
        this.tocadosSwp = [];
        this.terminado = false;
        this.barrido = -1; // posición de la pasada final de verificación
        this.ganador = false;
        this.estado = null;
        this.figura = figura;
        this.canvas = $("canvas", figura);
        this.ctx = this.canvas.getContext("2d");
        this.hud = {
            nombre: $(".hud-nombre", figura),
            cmp: $(".hud-cmp", figura),
            swp: $(".hud-swp", figura),
            mezclas: $(".hud-mezclas", figura),
            estado: $(".hud-estado", figura),
            reglaFin: $(".regla-fin", figura),
        };
        new ResizeObserver(() => this.medir()).observe(this.canvas);
    }
    medir() {
        const dpr = window.devicePixelRatio || 1;
        const r = this.canvas.getBoundingClientRect();
        this.ancho = r.width;
        this.alto = r.height;
        this.canvas.width = Math.round(r.width * dpr);
        this.canvas.height = Math.round(r.height * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.dibujar();
    }
    preparar(alg, base) {
        this.alg = alg;
        this.arr = base.slice();
        this.max = Math.max(...this.arr);
        this.listo = new Uint8Array(this.arr.length);
        this.gen = null;
        this.comparaciones = 0;
        this.intercambios = 0;
        this.mezclas = 0;
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
        this.hud.mezclas.parentElement.hidden = alg !== "random";
        this.hud.reglaFin.textContent = String(this.arr.length - 1);
        this.ponerEstado("listo");
        this.actualizarHud();
        this.dibujar();
    }
    ponerEstado(e) {
        if (this.estado === e)
            return;
        this.estado = e;
        this.figura.dataset.estado = e;
        this.hud.estado.textContent = NOMBRES_ESTADO[e];
    }
    // Avanza `presupuesto` operaciones (comparaciones o intercambios).
    avanzar(presupuesto) {
        if (this.terminado)
            return;
        if (!this.gen)
            this.gen = ALGORITMOS[this.alg].generador(this.arr);
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
            const ev = r.value;
            this.linea = ev.linea;
            switch (ev.tipo) {
                case "comparar":
                    this.comparaciones++;
                    presupuesto--;
                    if (this.tocadosCmp.length < 48)
                        this.tocadosCmp.push(ev.i, ev.j);
                    ultimo = ev.i;
                    break;
                case "swap":
                    this.intercambios++;
                    presupuesto--;
                    if (this.tocadosSwp.length < 48)
                        this.tocadosSwp.push(ev.i, ev.j);
                    if (this.pivote === ev.i)
                        this.pivote = ev.j;
                    else if (this.pivote === ev.j)
                        this.pivote = ev.i;
                    ultimo = ev.j;
                    break;
                case "rango":
                    this.rango = [ev.lo, ev.hi];
                    this.pivote = -1;
                    break;
                case "pivote":
                    this.pivote = ev.i;
                    break;
                case "mezcla":
                    this.mezclas++;
                    break;
                case "ordenado":
                    this.listo.fill(1, ev.desde, ev.hasta + 1);
                    break;
            }
        }
        if (ultimo >= 0)
            tono(this.arr[ultimo], this.max);
    }
    // Pasada final: recorre las barras de izquierda a derecha
    avanzarBarrido() {
        if (this.barrido < 0 || this.barrido >= this.arr.length)
            return;
        const paso = Math.max(1, Math.ceil(this.arr.length / 50));
        this.barrido = Math.min(this.arr.length, this.barrido + paso);
        tono(this.arr[this.barrido - 1], this.max, 0.05);
    }
    actualizarHud() {
        this.hud.cmp.textContent = fmt.format(this.comparaciones);
        this.hud.swp.textContent = fmt.format(this.intercambios);
        this.hud.mezclas.textContent = fmt.format(this.mezclas);
    }
    dibujar() {
        const { ctx, ancho, alto, arr } = this;
        if (!arr.length || !ancho)
            return;
        ctx.clearRect(0, 0, ancho, alto);
        const n = arr.length;
        const anchoBarra = ancho / n;
        const hueco = anchoBarra >= 5 ? Math.min(2, anchoBarra * 0.2) : 0;
        const arriba = 38; // espacio para el HUD
        const altoUtil = alto - arriba - 1;
        // Banda del subarreglo en el que se está trabajando
        if (this.rango) {
            const [lo, hi] = this.rango;
            ctx.fillStyle = colores.rango;
            ctx.fillRect(lo * anchoBarra, 0, (hi - lo + 1) * anchoBarra, alto);
        }
        // Color de cada barra según lo que está pasando
        const color = new Array(n);
        const enBarrido = this.barrido >= 0;
        for (let i = 0; i < n; i++) {
            if (enBarrido)
                color[i] = i < this.barrido ? "listo" : "barra";
            else
                color[i] = this.listo[i] ? "listo" : "barra";
        }
        if (!enBarrido) {
            if (this.pivote >= 0)
                color[this.pivote] = "pivote";
            for (const i of this.tocadosCmp)
                if (i >= 0)
                    color[i] = "cmp";
            for (const i of this.tocadosSwp)
                if (i >= 0)
                    color[i] = "swap";
        }
        else if (this.barrido < n) {
            color[this.barrido] = "swap";
        }
        // Se dibuja agrupado por color: cambiar fillStyle es lo que más cuesta
        for (const c of ["barra", "listo", "pivote", "cmp", "swap"]) {
            ctx.fillStyle = colores[c];
            ctx.beginPath();
            for (let i = 0; i < n; i++) {
                if (color[i] !== c)
                    continue;
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
const corredores = $$(".escenario").map((f) => new Corredor(f));
function corredoresActivos() {
    return estado.alg === "duelo" ? corredores : [corredores[0]];
}
// ------------------------------------------------------------
//  Título: al cambiar de algoritmo, las letras se "ordenan"
//  solas (con inserción, obvio) hasta formar el nombre nuevo.
// ------------------------------------------------------------
const palabra = $("#palabra");
let idAnimacion = 0;
function animarPalabra(texto) {
    const id = ++idAnimacion;
    const letras = [...texto].map((ch, idx) => ({ ch, idx }));
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pintar = (lista, moviendo = []) => {
        palabra.replaceChildren(...lista.map((l, k) => {
            const s = document.createElement("span");
            s.className = "letra" + (moviendo.includes(k) ? " moviendo" : "");
            s.textContent = l.ch === " " ? " " : l.ch;
            return s;
        }));
    };
    if (reducir)
        return pintar(letras);
    mezclar(letras);
    if (letras.every((l, k) => l.idx === k) && letras.length > 1) {
        [letras[0], letras[1]] = [letras[1], letras[0]];
    }
    // Se calculan de antemano los intercambios del ordenamiento por inserción
    const pasos = [];
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
    const tic = () => {
        if (id !== idAnimacion)
            return;
        if (p >= pasos.length)
            return pintar(letras);
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
const FUNCIONES = /\b(quickSort|randomSort|particion|intercambiar|estaOrdenado|mezclar)\b/g;
function escapar(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function resaltar(linea) {
    const corte = linea.indexOf("//");
    const codigo = corte >= 0 ? linea.slice(0, corte) : linea;
    const comentario = corte >= 0 ? linea.slice(corte) : "";
    let html = escapar(codigo)
        .replace(PALABRAS_CLAVE, '<span class="kw">$1</span>')
        .replace(TIPOS, '<span class="ty">$1</span>')
        .replace(FUNCIONES, '<span class="fn">$1</span>');
    if (comentario)
        html += '<span class="cm">' + escapar(comentario) + "</span>";
    return html;
}
let codigoMostrado = null;
let lineaActiva = 0;
function mostrarCodigo(alg) {
    if (codigoMostrado === alg)
        return;
    codigoMostrado = alg;
    lineaActiva = 0;
    $("#codigo").innerHTML = CODIGO[alg]
        .split("\n")
        .map((l) => '<span class="ln">' + (resaltar(l) || " ") + "</span>")
        .join("");
}
function marcarLinea(n) {
    if (n === lineaActiva)
        return;
    const lineas = $("#codigo").children;
    if (lineaActiva)
        lineas[lineaActiva - 1]?.classList.remove("activa");
    lineaActiva = n;
    if (n)
        lineas[n - 1]?.classList.add("activa");
}
// ------------------------------------------------------------
//  Textos según el algoritmo
// ------------------------------------------------------------
const BAJADAS = {
    quick: "<b>Quick Sort</b> · divide y vencerás · pivote = último elemento · partición de Lomuto",
    random: "<b>Random Sort</b> (Bogosort) · ¿está ordenado? si no, mezclar todo al azar y volver a probar",
    duelo: "<b>Duelo</b> · los dos algoritmos, el mismo arreglo, la misma velocidad. ¿Quién termina primero? (spoiler: Quick)",
};
function actualizarTextos() {
    const clave = estado.alg === "duelo" ? estado.pestana : estado.alg;
    const info = ALGORITMOS[clave];
    $("#bajada").innerHTML = BAJADAS[estado.alg];
    $("#resumen").textContent = info.resumen;
    actualizarNota();
    $("#fichas").innerHTML = info.datos.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    mostrarCodigo(clave);
    const nombre = estado.alg === "duelo" ? "Quick vs Random" : info.nombre;
    document.title = `${nombre} Sort · Algoritmos de Ordenación — Programación I`;
}
// Para Random Sort: cuántos órdenes posibles hay con n elementos
function actualizarNota() {
    const nota = $("#nota");
    const clave = estado.alg === "duelo" ? estado.pestana : estado.alg;
    nota.hidden = clave !== "random";
    if (nota.hidden)
        return;
    const n = estado.n;
    const final = n <= 7 ? "Con tan pocos debería terminar enseguida."
        : n <= 9 ? "Puede tardar bastante: paciencia (o subí la velocidad)."
            : "No va a terminar nunca. Para verlo ordenar, bajá a 5 o 6 elementos.";
    nota.innerHTML = `Con <b>${n}</b> elementos hay <b>${factorialAproximado(n)}</b> órdenes posibles y sólo uno es el correcto. ${final}`;
}
// Marca "recomendado" cuando el slider está en el valor sugerido
function marcarRecomendado(id, recomendado) {
    $(id).classList.toggle("recomendado", recomendado);
}
// ------------------------------------------------------------
//  Acciones
// ------------------------------------------------------------
function reiniciar(nuevosDatos) {
    if (nuevosDatos || estado.base.length !== estado.n)
        estado.base = generarDatos(estado.n);
    pausar();
    if (estado.alg === "duelo") {
        corredores[0].preparar("quick", estado.base);
        corredores[1].preparar("random", estado.base);
    }
    else {
        corredores[0].preparar(estado.alg, estado.base);
    }
    marcarLinea(0);
}
function arrancar() {
    if (corredoresActivos().every((c) => c.terminado))
        reiniciar(false);
    estado.corriendo = true;
    for (const c of corredoresActivos())
        if (!c.terminado)
            c.ponerEstado("corriendo");
    actualizarBotonPlay();
}
function pausar() {
    estado.corriendo = false;
    for (const c of corredoresActivos())
        if (!c.terminado && c.gen)
            c.ponerEstado("pausado");
    actualizarBotonPlay();
}
function alternar() {
    estado.corriendo ? pausar() : arrancar();
}
function unPaso() {
    pausar();
    for (const c of corredoresActivos()) {
        if (c.terminado)
            continue;
        c.avanzar(1);
        c.ponerEstado(c.terminado ? "terminado" : "pausado");
        c.actualizarHud();
    }
}
function actualizarBotonPlay() {
    const btn = $("#btnPlay");
    const algunoEmpezado = corredoresActivos().some((c) => c.gen && !c.terminado);
    $(".btn-txt", btn).textContent = estado.corriendo ? "Pausa" : algunoEmpezado ? "Seguir" : "Ordenar";
    btn.classList.toggle("corriendo", estado.corriendo);
}
function elegirAlgoritmo(alg) {
    if (alg === estado.alg)
        return;
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
function pintarSlider(input) {
    const p = ((+input.value - +input.min) / (+input.max - +input.min)) * 100;
    input.style.setProperty("--p", p + "%");
}
function cambiarVelocidad(v) {
    estado.velocidad = Math.max(0, Math.min(100, v));
    const input = $("#rngV");
    input.value = String(estado.velocidad);
    pintarSlider(input);
    $("#outV").textContent = formatearVelocidad(opsPorSegundo(estado.velocidad));
    marcarRecomendado("#outV", estado.velocidad === VELOCIDAD_RECOMENDADA);
}
// ------------------------------------------------------------
//  Bucle de animación
// ------------------------------------------------------------
let tiempoAnterior = performance.now();
let acumulado = 0;
let ultimoCuadroBarrido = 0;
function cuadro(t) {
    const dt = Math.min(100, t - tiempoAnterior);
    tiempoAnterior = t;
    const activos = corredoresActivos();
    if (estado.corriendo) {
        acumulado += (dt / 1000) * opsPorSegundo(estado.velocidad);
        const ops = Math.floor(acumulado);
        acumulado -= ops;
        if (ops > 0) {
            for (const c of activos) {
                if (c.terminado)
                    continue;
                c.avanzar(ops);
                c.actualizarHud();
                if (c.terminado) {
                    c.ponerEstado("terminado");
                    if (estado.alg === "duelo" && !activos.some((o) => o !== c && o.ganador)) {
                        const rival = activos.find((o) => o !== c);
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
    }
    else {
        acumulado = 0;
    }
    // La pasada final de verificación va a ritmo fijo (~60 cuadros)
    if (t - ultimoCuadroBarrido > 14) {
        ultimoCuadroBarrido = t;
        for (const c of activos)
            c.avanzarBarrido();
    }
    for (const c of activos)
        c.dibujar();
    const fuente = estado.alg === "duelo" ? corredores[estado.pestana === "quick" ? 0 : 1] : corredores[0];
    marcarLinea(fuente.terminado ? 0 : fuente.linea);
    requestAnimationFrame(cuadro);
}
// ------------------------------------------------------------
//  Compartir: QR + link
// ------------------------------------------------------------
function urlParaCompartir() {
    const publica = /^https?:$/.test(location.protocol) &&
        !/^(localhost|127\.|10\.|192\.168\.|\[::1\])/.test(location.hostname);
    return publica ? location.origin + location.pathname : URL_PUBLICA;
}
function prepararCompartir() {
    const url = urlParaCompartir();
    const enlace = $("#enlace");
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
    }
    else {
        $("#qr").hidden = true;
    }
    $("#btnCopiar").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        try {
            await navigator.clipboard.writeText(url);
            btn.textContent = "¡Copiado!";
        }
        catch {
            btn.textContent = "Copialo de arriba";
        }
        setTimeout(() => (btn.textContent = "Copiar link"), 1600);
    });
}
// ------------------------------------------------------------
//  Tema y pantalla completa
// ------------------------------------------------------------
function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    $('meta[name="theme-color"]').content = tema === "papel" ? "#efe9dc" : "#0f0e0c";
    leerColores();
    for (const c of corredores)
        c.dibujar();
    try {
        localStorage.setItem("ordenacion-tema", tema);
    }
    catch { }
}
function alternarTema() {
    aplicarTema(document.documentElement.dataset.tema === "papel" ? "tinta" : "papel");
}
function alternarPantallaCompleta() {
    if (document.fullscreenElement)
        document.exitFullscreen?.();
    else
        document.documentElement.requestFullscreen?.().catch(() => { });
}
function alternarSonido() {
    estado.sonido = !estado.sonido;
    if (estado.sonido) {
        prepararAudio();
        audio?.resume();
    }
    $("#btnSonido").setAttribute("aria-pressed", String(estado.sonido));
}
// ------------------------------------------------------------
//  Eventos
// ------------------------------------------------------------
function conectar() {
    $$(".segmentado button").forEach((b) => b.addEventListener("click", () => elegirAlgoritmo(b.dataset.alg)));
    $$("#pestanas button").forEach((b) => b.addEventListener("click", () => {
        estado.pestana = b.dataset.cod;
        $$("#pestanas button").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        actualizarTextos();
    }));
    const rngN = $("#rngN");
    rngN.addEventListener("input", () => {
        estado.n = +rngN.value;
        $("#outN").textContent = String(estado.n);
        marcarRecomendado("#outN", estado.n === N_RECOMENDADO);
        actualizarNota();
        pintarSlider(rngN);
        reiniciar(true);
    });
    const rngV = $("#rngV");
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
        const b = e.target.closest("button");
        if (b && e.pointerType === "mouse")
            b.blur();
    });
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey)
            return;
        const enFoco = document.activeElement;
        const enSlider = enFoco instanceof HTMLInputElement && enFoco.type === "range";
        const enBoton = enFoco instanceof HTMLButtonElement;
        switch (e.key) {
            case " ":
                if (enBoton)
                    return;
                e.preventDefault();
                alternar();
                break;
            case "ArrowRight":
                if (enSlider)
                    return;
                e.preventDefault();
                unPaso();
                break;
            case "ArrowUp":
                if (enSlider)
                    return;
                e.preventDefault();
                cambiarVelocidad(estado.velocidad + 5);
                break;
            case "ArrowDown":
                if (enSlider)
                    return;
                e.preventDefault();
                cambiarVelocidad(estado.velocidad - 5);
                break;
            case "r":
            case "R":
                reiniciar(true);
                break;
            case "1":
                elegirAlgoritmo("quick");
                break;
            case "2":
                elegirAlgoritmo("random");
                break;
            case "3":
                elegirAlgoritmo("duelo");
                break;
            case "m":
            case "M":
                alternarSonido();
                break;
            case "t":
            case "T":
                alternarTema();
                break;
            case "f":
            case "F":
                alternarPantallaCompleta();
                break;
        }
    });
}
// ------------------------------------------------------------
//  Arranque
// ------------------------------------------------------------
(function iniciar() {
    let tema = "tinta";
    try {
        tema = localStorage.getItem("ordenacion-tema") || tema;
    }
    catch { }
    aplicarTema(tema);
    conectar();
    const rngN = $("#rngN");
    rngN.value = String(estado.n);
    $("#outN").textContent = String(estado.n);
    marcarRecomendado("#outN", true);
    pintarSlider(rngN);
    cambiarVelocidad(estado.velocidad);
    actualizarTextos();
    animarPalabra("Quick");
    reiniciar(true);
    prepararCompartir();
    requestAnimationFrame(cuadro);
})();
