import * as L from "leaflet";

declare module "leaflet" {
  function river(latLngs: L.LatLngExpression[], options: RiverOptions): River;

  interface RiverOptions extends L.PathOptions {
    minWidth?: number;
    maxWidth?: number;
    ratio?: number | null;
  }

  class River extends L.FeatureGroup {
    constructor(layers?: L.Layer[], options?: L.LayerOptions);
    setStyle(style: any): void;
    setMinWidth(width: number): void;
    setMaxWidth(width: number): void;
    getMinWidth(): number;
    getMaxWidth(): number;
    useLength(ratio: number): this;
    convertToPolyline(options: L.PolylineOptions): L.Polyline;
  }
}
