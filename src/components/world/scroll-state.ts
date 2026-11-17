/**
 * Estado compartido (fuera de React) entre el DOM y la escena 3D.
 * `t` es un índice flotante de estación: 0 = inicio … N-1 = contacto.
 * Se calcula con el centro del viewport respecto al centro de cada
 * sección [data-station], así las secciones pueden tener cualquier alto.
 */
export const scrollState = { t: 0, pointerX: 0, pointerY: 0 };

let centers: number[] = [];

export function measureStations() {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
  centers = els.map((el) => {
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2;
  });
}

export function updateStationT() {
  if (centers.length < 2) return;
  const v = window.scrollY + window.innerHeight / 2;
  const last = centers.length - 1;
  if (v <= centers[0]) return void (scrollState.t = 0);
  if (v >= centers[last]) return void (scrollState.t = last);
  for (let i = 0; i < last; i++) {
    if (v < centers[i + 1]) {
      scrollState.t = i + (v - centers[i]) / (centers[i + 1] - centers[i]);
      return;
    }
  }
}
