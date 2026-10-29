// Escena 3D del hero (identidad "Parte de olas", DESIGN.md): un teléfono estilizado cuya pantalla
// es una ola en movimiento. Modelo armado en código (no es el iPhone de Apple: sin licencias ni
// archivos pesados). Se importa dinámicamente desde TelefonoOla, después de pintar el hero.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type Opciones = {
  /** Color del cuerpo (hex). */
  color: string;
  /** prefers-reduced-motion: se dibuja un cuadro quieto y no hay animación. */
  reducido: boolean;
  /** Sección que da el progreso de scroll (el teléfono gira mientras sale de pantalla). */
  seccion: HTMLElement | null;
  onListo: () => void;
};

const ANCHO = 0.74;
const ALTO = 1.5;
const GROSOR = 0.08;

// Colores de la paleta: atlántico, mar profundo y espuma.
const HONDO = "#0B2533";
const MAR = "#05467D";
const ESPUMA = "#EEF2F0";

const vertexOla = /* glsl */ `
  uniform vec2 uTamano;
  varying vec2 vUv;
  void main() {
    vUv = position.xy / uTamano + 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Crestas de ola que suben por la pantalla, como en el logo: líneas de espuma sobre el degradé
// del fondo del mar a la superficie.
const fragmentOla = /* glsl */ `
  uniform float uTiempo;
  uniform vec3 uHondo;
  uniform vec3 uMar;
  uniform vec3 uEspuma;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv;
    vec3 color = mix(uHondo, uMar, smoothstep(0.0, 1.0, p.y));
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float altura = 0.12 + fi * 0.15
        + 0.035 * sin(p.x * 6.2831 * (0.8 + fi * 0.25) + uTiempo * (0.7 + fi * 0.12) + fi * 1.7);
      float d = abs(p.y - altura);
      float linea = smoothstep(0.011, 0.0, d);
      float brillo = smoothstep(0.09, 0.0, d) * 0.12;
      color = mix(color, uEspuma, linea * (0.7 - fi * 0.08) + brillo);
    }
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function rectanguloRedondeado(ancho: number, alto: number, radio: number): THREE.ShapeGeometry {
  const x = -ancho / 2;
  const y = -alto / 2;
  const forma = new THREE.Shape();
  forma.moveTo(x + radio, y);
  forma.lineTo(x + ancho - radio, y);
  forma.quadraticCurveTo(x + ancho, y, x + ancho, y + radio);
  forma.lineTo(x + ancho, y + alto - radio);
  forma.quadraticCurveTo(x + ancho, y + alto, x + ancho - radio, y + alto);
  forma.lineTo(x + radio, y + alto);
  forma.quadraticCurveTo(x, y + alto, x, y + alto - radio);
  forma.lineTo(x, y + radio);
  forma.quadraticCurveTo(x, y, x + radio, y);
  return new THREE.ShapeGeometry(forma, 12);
}

const suavizar = (t: number) => 1 - Math.pow(1 - t, 3);
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Monta la escena en `host`. Devuelve la función que la desarma (y libera la GPU). */
export function montarTelefono(host: HTMLElement, { color, reducido, seccion, onListo }: Opciones): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  escena.environment = entorno;

  const camara = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
  camara.position.set(0, 0, 4.4);

  const luz = new THREE.DirectionalLight("#ffffff", 1.4);
  luz.position.set(2, 3, 4);
  escena.add(luz);

  const telefono = new THREE.Group();
  escena.add(telefono);

  const geometrias: THREE.BufferGeometry[] = [];
  const materiales: THREE.Material[] = [];
  const agregar = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number], rotX = 0) => {
    geometrias.push(geo);
    materiales.push(mat);
    const malla = new THREE.Mesh(geo, mat);
    malla.position.set(...pos);
    malla.rotation.x = rotX;
    telefono.add(malla);
    return malla;
  };

  // Cuerpo de aluminio
  const metal = new THREE.MeshPhysicalMaterial({ color, metalness: 0.85, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  agregar(new RoundedBoxGeometry(ANCHO, ALTO, GROSOR, 6, 0.11), metal, [0, 0, 0]);

  // Frente: vidrio negro, pantalla con la ola e isla
  const frente = GROSOR / 2 + 0.0005;
  agregar(rectanguloRedondeado(ANCHO - 0.03, ALTO - 0.03, 0.1), new THREE.MeshStandardMaterial({ color: "#050708", roughness: 0.12 }), [0, 0, frente]);
  const anchoPantalla = ANCHO - 0.08;
  const altoPantalla = ALTO - 0.08;
  const ola = new THREE.ShaderMaterial({
    vertexShader: vertexOla,
    fragmentShader: fragmentOla,
    toneMapped: false,
    uniforms: {
      uTiempo: { value: 0 },
      uTamano: { value: new THREE.Vector2(anchoPantalla, altoPantalla) },
      uHondo: { value: new THREE.Color(HONDO) },
      uMar: { value: new THREE.Color(MAR) },
      uEspuma: { value: new THREE.Color(ESPUMA) },
    },
  });
  agregar(rectanguloRedondeado(anchoPantalla, altoPantalla, 0.08), ola, [0, 0, frente + 0.0005]);
  agregar(rectanguloRedondeado(0.2, 0.056, 0.028), new THREE.MeshBasicMaterial({ color: "#000000" }), [0, ALTO / 2 - 0.09, frente + 0.001]);

  // Dorso: módulo de cámaras con dos lentes en diagonal
  const dorso = -GROSOR / 2;
  agregar(new RoundedBoxGeometry(0.3, 0.3, 0.024, 4, 0.07), new THREE.MeshPhysicalMaterial({ color, metalness: 0.6, roughness: 0.12, clearcoat: 1 }), [-0.16, 0.5, dorso - 0.008]);
  const aro = new THREE.MeshStandardMaterial({ color: "#c9ccd1", metalness: 1, roughness: 0.25 });
  const lente = new THREE.MeshPhysicalMaterial({ color: "#0a0d10", metalness: 0.2, roughness: 0.04, clearcoat: 1 });
  for (const [dx, dy] of [[-0.07, 0.07], [0.07, -0.07]]) {
    agregar(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 40), aro, [-0.16 + dx, 0.5 + dy, dorso - 0.03], Math.PI / 2);
    agregar(new THREE.CylinderGeometry(0.045, 0.045, 0.032, 40), lente, [-0.16 + dx, 0.5 + dy, dorso - 0.032], Math.PI / 2);
  }

  // Tamaño
  const ajustar = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
  };
  ajustar();
  const observadorTamano = new ResizeObserver(ajustar);
  observadorTamano.observe(host);

  // Pose base: tres cuartos, mostrando el frente
  const BASE_Y = -0.42;
  const BASE_X = 0.08;
  telefono.rotation.set(BASE_X, BASE_Y, 0.06);

  if (reducido) {
    renderer.render(escena, camara);
    onListo();
  }

  // Interacción: el puntero inclina el teléfono; el scroll lo hace girar hasta mostrar el dorso.
  let objetivoX = 0;
  let objetivoY = 0;
  const alMover = (e: PointerEvent) => {
    objetivoY = (e.clientX / window.innerWidth - 0.5) * 0.7;
    objetivoX = (e.clientY / window.innerHeight - 0.5) * 0.35;
  };
  const progresoScroll = () => {
    if (!seccion) return 0;
    const r = seccion.getBoundingClientRect();
    return limitar(-r.top / r.height, 0, 1);
  };

  let visible = true;
  const observadorVista = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
  });
  observadorVista.observe(host);

  let rafId = 0;
  const inicio = performance.now();
  let inclX = 0;
  let inclY = 0;
  let avisado = false;
  const cuadro = (ahora: number) => {
    rafId = requestAnimationFrame(cuadro);
    if (!visible || document.hidden) return;
    const t = (ahora - inicio) / 1000;
    const entrada = suavizar(limitar(t / 1.4, 0, 1));
    const scroll = suavizar(progresoScroll());

    inclX += (objetivoX - inclX) * 0.06;
    inclY += (objetivoY - inclY) * 0.06;

    telefono.rotation.y = BASE_Y + inclY + Math.sin(t * 0.5) * 0.06 + (1 - entrada) * -1.1 + scroll * Math.PI;
    telefono.rotation.x = BASE_X + inclX + scroll * 0.2;
    telefono.position.y = Math.sin(t * 0.8) * 0.03 - (1 - entrada) * 0.25 - scroll * 0.35;
    telefono.scale.setScalar(0.88 + entrada * 0.12);
    ola.uniforms.uTiempo.value = t;

    renderer.render(escena, camara);
    if (!avisado) {
      avisado = true;
      onListo();
    }
  };
  if (!reducido) {
    window.addEventListener("pointermove", alMover, { passive: true });
    rafId = requestAnimationFrame(cuadro);
  }

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", alMover);
    observadorTamano.disconnect();
    observadorVista.disconnect();
    geometrias.forEach((g) => g.dispose());
    materiales.forEach((m) => m.dispose());
    entorno.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
