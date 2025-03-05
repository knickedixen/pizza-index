import { searchProducts } from "./db";
import { calculateAverage } from "./App";
import Gradient from "javascript-color-gradient";
import { useEffect, useState, useContext } from "react"
import { Region, regionConstants } from './db.ts'
import { Tooltip, GeoJSON, useMap } from 'react-leaflet'
import { LatLngBounds, Polyline } from "leaflet";
import { Feature } from "geojson";
import { searchContext } from "./App";

export default function GeoRegion({ region }: { region: Region }) {
  const [count, setCount] = useState<number>(0)
  const [average, setAverage] = useState<number>(0)
  const [bounds, setBounds] = useState<LatLngBounds | null>(null)
  const { selectedRegion, setRegionType, setSelectedRegion } = useContext(searchContext);
  const map = useMap();

  if (!region.type || !regionConstants.has(region.type)) {
    console.warn(`Uknown region type '${region.type}'`);
    return;
  }

  let typeConstants = regionConstants.get(region.type);
  let color = "gray";
  let opacity = selectedRegion == region.id ? 0 : 0.5;

  if (count > 0 && average > 0 && typeConstants && (!selectedRegion || selectedRegion == region.id)) {
    let weight = average - typeConstants.minPrice;
    weight = weight > 0 ? weight : 1;
    let midpoint = typeConstants.maxPrice - typeConstants.minPrice;
    color = new Gradient()
      .setColorGradient("#001aff", "#fc0307")
      .setMidpoint(midpoint)
      .getColor(weight);
  }

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

  const fitBounds = function() {
    if (selectedRegion == region.id && bounds) {
      map.fitBounds(bounds);
    }
  }
  useEffect(() => {
    fitBounds();
  }, [selectedRegion, bounds]);

  const onEachFeature = (_feature: Feature, layer: Polyline) => {
    setBounds(layer.getBounds());
    layer.on("click", function() {
      if (region.type && region.id) {
        setRegionType(region.type)
        setSelectedRegion(region.id)
      }
    })
  };

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
