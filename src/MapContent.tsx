import { Marker } from 'react-leaflet'
import { getAllRestaurants, Product } from './db.ts'
import { icon, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import 'react-leaflet-markercluster/styles'
import shadowUrl from './assets/marker-shadow.svg'
import blueIconUrl from './assets/marker-blue.svg'
import RestaurantPopup from "./RestaurantPopup.tsx"
import { useContext, useMemo, useState } from "react"
import { AppContext } from "./App.tsx"
import GeoRegionControl from './GeoRegionControl.tsx'

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

export default function MapContent() {
  const { selectedRegion } = useContext(AppContext);
  const [products, setProducts] = useState<Array<Product>>([]);
  useMemo(() => setProducts(getAllRestaurants()), []);

  return (
    <>
      <MarkerClusterGroup maxClusterRadius={20}>
        {products.map((product) =>
          selectedRegion && product.county_code.startsWith(selectedRegion.id) &&
          <Marker
            key={product.code}
            icon={blueIcon}
            position={[product.latitude, product.longitude]}
          >
            <RestaurantPopup product={product} />
          </Marker>
        )}
      </MarkerClusterGroup>
      <GeoRegionControl />
    </>
  );
}

