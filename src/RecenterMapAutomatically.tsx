import { latLng, latLngBounds } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function RecenterMapAutomatically({ selectedRegion }: { selectedRegion: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedRegion) {
      map.fitBounds(latLngBounds(latLng(55, 13), latLng(70, 22)));
    }
  }, [selectedRegion]);
  return null;
}
