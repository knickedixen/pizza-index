import "./Map.css"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { getAllRestaurants, Product } from './db.ts'
import { icon, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import 'react-leaflet-markercluster/styles'
import shadowUrl from './assets/marker-shadow.svg'
import blueIconUrl from './assets/marker-blue.svg'
import RestaurantPopup from "./RestaurantPopup.tsx"
import RecenterMapAutomatically from "./RecenterMapAutomatically.tsx"
import GeoRegionControl from "./GeoRegionControl.tsx"
import { useContext, useMemo, useState } from "react"
import { RegionSelectionContext } from "./App.tsx"

const smallIconSize = point(24, 24);
const smallIconAnchor = point(12, 24);
const smallShadowAnchor = point(11, 23);

const blueIcon = icon({
  iconUrl: blueIconUrl,
  iconSize: smallIconSize,
  iconAnchor: smallIconAnchor,
  shadowUrl: shadowUrl,
  shadowSize: smallIconSize,
  shadowAnchor: smallShadowAnchor
})

export default function Map() {
  const { selectedRegion } = useContext(RegionSelectionContext);
  const [products, setProducts] = useState<Array<Product>>([]);
  useMemo(() => setProducts(getAllRestaurants()), []);

  return (
    <>
      <MapContainer center={[62, 15]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>
          {products.map((product) => (
            selectedRegion && product.county_code.startsWith(selectedRegion) &&
            <Marker
              key={product.code}
              icon={blueIcon}
              position={[product.latitude, product.longitude]}
            >
              <RestaurantPopup product={product} />
            </Marker>
          ))}
        </MarkerClusterGroup>
        <GeoRegionControl />

        <RecenterMapAutomatically selectedRegion={selectedRegion} />
      </MapContainer>
    </>
  );
}

