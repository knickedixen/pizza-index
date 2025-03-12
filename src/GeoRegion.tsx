import { searchProducts } from "./db";
import { calculateAverage } from "./App";
import Gradient from "javascript-color-gradient";
import { useEffect, useState, useContext } from "react"
import { Region, regionConstants } from './db.ts'
import { Tooltip, GeoJSON, useMap } from 'react-leaflet'
import { Polyline } from "leaflet";
import { Feature } from "geojson";
import { RegionSelectionContext } from "./App";

const getColor = function(region: Region, average: number, selectedRegion: string | null) {
  if (!region.type || !regionConstants.has(region.type)) {
    console.warn(`Uknown region type '${region.type}'`);
    return "gray";
  }

  let typeConstants = regionConstants.get(region.type);
  if (average <= 0 || selectedRegion == region.id || !typeConstants) {
    return "gray";
  }

  let weight = average - typeConstants.minPrice;
  weight = weight > 0 ? weight : 1;
  let midpoint = typeConstants.maxPrice - typeConstants.minPrice;
  let gradient = new Gradient().setColorGradient("#001aff", "#fc0307").setMidpoint(midpoint);

  return gradient.getColor(weight);
}

export default function GeoRegion({ region }: { region: Region }) {
  const [count, setCount] = useState<number>(0)
  const [average, setAverage] = useState<number>(0)
  const [layer, setLayer] = useState<Polyline | null>()
  const map = useMap();
  const {
    selectedRegion,
    regionType,
    setRegionType,
    setSelectedRegion } = useContext(RegionSelectionContext);

  let color = getColor(region, average, selectedRegion);
  let opacity = selectedRegion == region.id ? 0 : 0.5;

  const geoJsonStyle = {
    fillColor: color,
    weight: 1,
    opacity: 1,
    color: color,
    fillOpacity: opacity,
  };

  searchProducts(region.id).then((products) => {
    setAverage(calculateAverage(products ?? []));
    setCount(products ? products.length : 0);
  });

  useEffect(() => {
    fitBounds();
  }, [selectedRegion, layer]);

  useEffect(() => {
    if (layer) {
      if (regionType == region.type) {
        map.addLayer(layer);
      } else {
        map.removeLayer(layer);
      }
    }
  }, [regionType, layer]);

  const onEachFeature = (_feature: Feature, layer: Polyline) => {
    setLayer(layer);
    layer.on("click", function() {
      if (region.type && region.id) {
        setRegionType(region.type)
        setSelectedRegion(region.id)
      }
    })
  };

  const fitBounds = function() {
    if (selectedRegion == region.id && layer) {
      map.fitBounds(layer.getBounds());
    }
  }

  return (
    <>
      <GeoJSON data={region.geojson} style={geoJsonStyle} onEachFeature={onEachFeature}>
        {selectedRegion != region.id &&
          <Tooltip>
            <div style={{ fontSize: 16 }}><b><u>{region.name}</u></b></div>
            {count > 0 ?
              <div>
                <b>Restaurants:</b> {count}
                <br />
                <b>Average price:</b> {average.toFixed(1)} kr
              </div>
              : <p>Data missing</p>
            }
          </Tooltip>
        }
      </GeoJSON>
    </>
  );
}
