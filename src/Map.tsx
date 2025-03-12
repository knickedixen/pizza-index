import "./Map.css"
import { useContext, useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { getAllRegions, Product, Region } from './db.ts'
import { icon, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import 'react-leaflet-markercluster/styles'
import shadowUrl from './assets/marker-shadow.svg'
import redIconUrl from './assets/marker-red.svg'
import greenIconUrl from './assets/marker-green.svg'
import blueIconUrl from './assets/marker-blue.svg'
import GeoRegion from "./GeoRegion.tsx"
import { RegionSelectionContext } from "./App";
import { LoadingContext } from "./DBLoader.tsx"
import RestaurantPopup from "./RestaurantPopup.tsx"
import RecenterMapAutomatically from "./RecenterMapAutomatically.tsx"

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

export default function Map({ products }: { products: Array<Product> }) {
  const productsCopy = [...products];
  const { dbReady } = useContext(LoadingContext);
  const { selectedRegion } = useContext(RegionSelectionContext);
  const [regions, setRegions] = useState<Array<Region>>([])

  let cheapest, mostExpensive;
  if (productsCopy.length > 1) {
    cheapest = productsCopy?.shift();
    mostExpensive = productsCopy?.pop();
  }

  useEffect(() => {
    if (dbReady) {
      getAllRegions().then(regions => setRegions(regions));
    }
  }, [dbReady]);

  return (
    <>
      <MapContainer center={[62, 15]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cheapest &&
          <Marker
            zIndexOffset={2}
            title="Cheapest!"
            key={cheapest.code}
            icon={greenIcon}
            position={[cheapest.latitude, cheapest.longitude]}
          >
            <RestaurantPopup product={cheapest} />
          </Marker>
        }

        <MarkerClusterGroup>
          {productsCopy?.map((product) => (
            <Marker
              key={product.code}
              icon={blueIcon}
              position={[product.latitude, product.longitude]}
            >
              <RestaurantPopup product={product} />
            </Marker>
          ))}
        </MarkerClusterGroup>

        {mostExpensive &&
          <Marker
            zIndexOffset={1}
            title="Most Expensive!"
            key={mostExpensive.code}
            icon={redIcon}
            position={[mostExpensive.latitude, mostExpensive.longitude]}
          >
            <RestaurantPopup product={mostExpensive} />
          </Marker>
        }
        {regions?.map((region) => (
          <GeoRegion key={region.id} region={region} />
        ))}

        <RecenterMapAutomatically selectedRegion={selectedRegion} />
      </MapContainer>
    </>
  );
}
