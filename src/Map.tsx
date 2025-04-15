import "./Map.css"
import { createContext, useContext, useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { getAllRegions, Product, Region, searchProducts, getRegion, calculateAverage } from './db.ts'
import { icon, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import 'react-leaflet-markercluster/styles'
import shadowUrl from './assets/marker-shadow.svg'
import redIconUrl from './assets/marker-red.svg'
import greenIconUrl from './assets/marker-green.svg'
import blueIconUrl from './assets/marker-blue.svg'
import { LoadingContext } from "./DBLoader.tsx"
import RestaurantPopup from "./RestaurantPopup.tsx"
import RecenterMapAutomatically from "./RecenterMapAutomatically.tsx"
import GeoRegionControl from "./GeoRegionControl.tsx"
import AreaInfoBox from "./AreaInfoBox.tsx"
import SearchRegionInput from "./SearchRegionInput.tsx"

const smallIconSize = point(24, 24);
const smallIconAnchor = point(12, 24);
const smallShadowAnchor = point(11, 23);

const bigIconSize = point(36, 36);
const bigIconAnchor = point(18, 36);
const bigShadowAnchor = point(17, 35);

const redIcon = icon({
  iconUrl: redIconUrl,
  iconSize: bigIconSize,
  iconAnchor: bigIconAnchor,
  shadowUrl: shadowUrl,
  shadowSize: bigIconSize,
  shadowAnchor: bigShadowAnchor
});
const greenIcon = icon({
  iconUrl: greenIconUrl,
  iconSize: bigIconSize,
  iconAnchor: bigIconAnchor,
  shadowUrl: shadowUrl,
  shadowSize: bigIconSize,
  shadowAnchor: bigShadowAnchor
})
const blueIcon = icon({
  iconUrl: blueIconUrl,
  iconSize: smallIconSize,
  iconAnchor: smallIconAnchor,
  shadowUrl: shadowUrl,
  shadowSize: smallIconSize,
  shadowAnchor: smallShadowAnchor
})

type RegionSelection = {
  region: Region | null,
  selectedRegion: string | null,
  setRegion: (type: Region) => void;
  setSelectedRegion: (region: string | null) => void;
}

const RegionSelectionContext = createContext<RegionSelection>({
  region: null,
  selectedRegion: null,
  setRegion: () => { },
  setSelectedRegion: () => { },
});

export default function Map() {
  const [areaCount, setAreaCount] = useState<number>(0)
  const [areaAverage, setAreaAverage] = useState<number>(0)
  const [region, setRegion] = useState<Region | null>(null)
  const [products, setProducts] = useState<Array<Product>>([]);
  const { dbReady } = useContext(LoadingContext);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regions, setRegions] = useState<Array<Region>>([])

  const regionSelection = {
    region: region,
    setRegion: setRegion,
    selectedRegion: selectedRegion,
    setSelectedRegion: setSelectedRegion
  }

  useEffect(() => {
    if (dbReady) {
      getAllRegions().then(regions => setRegions(regions));
    }
  }, [dbReady]);

  useEffect(() => {
    if (dbReady) {
      if (selectedRegion) {
        getRegion(selectedRegion).then(region => {
          setRegion(region ?? null);
        });
        searchProducts(selectedRegion).then((products) => {
          setProducts(products ?? []);
          setAreaAverage(calculateAverage(products ?? []));
          setAreaCount(products ? products.length : 0);
        });
      } else {
        setProducts([]);
      }
    }
  }, [selectedRegion, dbReady]);

  return (
    <>
      <RegionSelectionContext.Provider value={regionSelection}>
        <MapContainer center={[62, 15]} zoom={5} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {products &&
            <MarkerClusterGroup>
              {products.map((product) => (
                <Marker
                  key={product.code}
                  icon={blueIcon}
                  position={[product.latitude, product.longitude]}
                >
                  <RestaurantPopup product={product} />
                </Marker>
              ))}
            </MarkerClusterGroup>
          }

          <GeoRegionControl regions={regions} />

          <SearchRegionInput />

          {selectedRegion &&
            <AreaInfoBox
              name={region?.name}
              count={areaCount}
              average={areaAverage}
              onClose={() => setSelectedRegion(null)}
            />
          }
          <RecenterMapAutomatically selectedRegion={selectedRegion} />
        </MapContainer>
      </RegionSelectionContext.Provider>
    </>
  );
}

export { RegionSelectionContext };
