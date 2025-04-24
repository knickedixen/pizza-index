import { searchProducts, calculateAverage } from "./db";
import Gradient from "javascript-color-gradient";
import { useState, useContext, useMemo } from "react"
import { Region, regionConstants } from './db.ts'
import { GeoJSON, useMap } from 'react-leaflet'
import { geoJson, LatLngBounds, Polyline } from "leaflet";
import { Feature } from "geojson";
import { AppContext } from "./App.tsx";

const getColor = function(region: Region, average: number, selectedRegion: Region | null) {
  if (!region.type || !regionConstants.has(region.type)) {
    console.warn(`Uknown region type '${region.type}'`);
    return "gray";
  }

  let typeConstants = regionConstants.get(region.type);
  if (average <= 0 || selectedRegion?.id == region.id || !typeConstants) {
    return "gray";
  }

  let weight = average - typeConstants.minPrice;
  weight = weight > 0 ? weight : 1;
  let midpoint = typeConstants.maxPrice - typeConstants.minPrice;
  let gradient = new Gradient().setColorGradient("#001aff", "#fc0307").setMidpoint(midpoint);

  return gradient.getColor(weight);
}

const createStyle = function(region: Region, average: number, selectedRegion: Region | null) {
  const color = getColor(region, average, selectedRegion)
  const opacity = selectedRegion?.id == region.id ? 0 : 0.5;

  return {
    fillColor: color,
    weight: 1,
    opacity: 1,
    color: color,
    fillOpacity: opacity,
  };
}

export default function GeoRegion({ region }: { region: Region }) {
  const [average, setAverage] = useState<number>(0)
  const [bounds, setBounds] = useState<LatLngBounds | null>()
  const map = useMap();
  const { selectedRegion, setSelectedRegion } = useContext(AppContext);

  let style = useMemo(() =>
    createStyle(region, average, selectedRegion),
    [region, average, selectedRegion]
  );

  useMemo(() => {
    setAverage(calculateAverage(searchProducts(region.id)));
    setBounds(geoJson(region.geojson).getBounds());
  }, [region]
  );

  const onEachFeature = (_feature: Feature, layer: Polyline) => {
    layer.on("click", function() {
      if (region.type && region.id) {
        setSelectedRegion(region)
      }
      if (bounds) {
        map.fitBounds(bounds);
      }
    })
  };

  return (
    <>
      <GeoJSON data={region.geojson} style={style} onEachFeature={onEachFeature}>
      </GeoJSON>
    </>
  );
}
