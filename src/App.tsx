import MapContent from './MapContent.tsx'
import { createContext, useMemo, useState } from 'react';
import { Region } from './db.ts';
import AreaInfo from './AreaInfo.tsx';
import { MapContainer, TileLayer } from 'react-leaflet';
import { latLng, latLngBounds, Map } from 'leaflet';
import MapControls from './MapControls.tsx';

type AppGlobals = {
  map: Map | null,
  setMap: (map: Map | null) => void,
  selectedRegion: Region | null,
  setSelectedRegion: (type: Region | null) => void;
}

const AppContext = createContext<AppGlobals>({
  map: null,
  setMap: () => { },
  selectedRegion: null,
  setSelectedRegion: () => { },
});

function App() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [map, setMap] = useState<Map | null>(null);

  const appContext = {
    map: map,
    setMap: setMap,
    selectedRegion: selectedRegion,
    setSelectedRegion: setSelectedRegion,
  }

  useMemo(() => {
    map?.fitBounds(latLngBounds(latLng(55, 13), latLng(70, 22)));
  }, [map]);

  return (
    <>
      <AppContext.Provider value={appContext}>
        <div className="map-container">
          <MapContainer ref={setMap}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapContent />
            <MapControls />
          </MapContainer>
        </div>
        <AreaInfo />
      </AppContext.Provider>
    </>
  )
}

export { AppContext };
export default App;
