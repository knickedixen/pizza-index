import { latLng, latLngBounds } from "leaflet";
import { useMap } from "react-leaflet";

export default function RecenterMapAutomatically() {
  const map = useMap();
  map.fitBounds(latLngBounds(latLng(55, 13), latLng(70, 22)));

  return null;
}
