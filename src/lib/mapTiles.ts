import L from "leaflet";

// OpenTopoMap is a volunteer-run service: tiles regularly stall or fail,
// especially at high zoom on weak mobile connections — and Leaflet never
// retries a failed tile, leaving grey holes. This shared layer factory
// retries each failed tile up to 3 times with exponential backoff.

const MAX_RETRIES = 3;

export function createTopoLayer(): L.TileLayer {
  const layer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    subdomains: "abc",
    // Keep a wider ring of tiles loaded around the viewport so panning
    // and small zooms reveal fewer unloaded areas.
    keepBuffer: 4,
    attribution:
      '© <a href="https://openstreetmap.org">OpenStreetMap</a> · ' +
      '© <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
  });

  const retries = new WeakMap<HTMLImageElement, number>();
  layer.on("tileerror", (event) => {
    const e = event as L.TileErrorEvent;
    const tile = e.tile as HTMLImageElement;
    const attempt = (retries.get(tile) ?? 0) + 1;
    if (attempt > MAX_RETRIES) return;
    retries.set(tile, attempt);
    const url = layer.getTileUrl(e.coords);
    setTimeout(
      () => {
        // Fresh query param forces a new request instead of the cached failure.
        tile.src = `${url}?retry=${attempt}`;
      },
      600 * 2 ** (attempt - 1),
    );
  });

  return layer;
}
