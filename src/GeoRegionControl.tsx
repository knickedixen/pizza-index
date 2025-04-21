import { LayerGroup, LayersControl, useMapEvent } from 'react-leaflet';
import { getAllRegions, Region } from './db.ts';
import GeoRegion from './GeoRegion.tsx';
import { RegionSelectionContext } from "./App";
import { useContext, useEffect, useMemo, useState } from 'react';

export default function GeoRegionControl() {
  const { region, setSelectedRegion } = useContext(RegionSelectionContext);
  const [isCountySelected, setIsCountySelected] = useState<boolean>(false);
  const [regions, setRegions] = useState<Array<Region>>([]);

  useMapEvent("baselayerchange", () => setSelectedRegion(null));

  useMemo(() => setRegions(getAllRegions()), []);

  useEffect(() => {
    setIsCountySelected(region?.type == "county");
  }, [region]);

  return (
    <>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked={!isCountySelected} name="Landskap">
          <LayerGroup>
            {regions?.map((region) => (
              region.type == "state" &&
              <GeoRegion key={region.id} region={region} />
            ))}
          </LayerGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked={isCountySelected} name="Kommuner">
          <LayerGroup>
            {regions?.map((region) => (
              region.type == "county" &&
              <GeoRegion key={region.id} region={region} />
            ))}
          </LayerGroup>
        </LayersControl.BaseLayer>
      </LayersControl >
    </>
  )
}
