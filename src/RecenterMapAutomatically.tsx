import { latLng, latLngBounds } from "leaflet";
import { useMemo } from "react";
import { useMap } from "react-leaflet";

export default function RecenterMapAutomatically() {
  const map = useMap();
  useMemo(() => {
    map.fitBounds(latLngBounds(latLng(55, 13), latLng(70, 22)));
  }, []);

  return null;
}
