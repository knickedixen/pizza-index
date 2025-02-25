import "./Map.css"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap } from 'react-leaflet'
import { Product } from './db.ts'
import { icon, latLng, LatLngBounds, latLngBounds, point } from "leaflet"
import MarkerClusterGroup from "react-leaflet-markercluster"
import 'leaflet/dist/leaflet.css'
// @ts-ignore
import 'react-leaflet-markercluster/styles'
import shadowUrl from '../public/marker-shadow.svg'
import redIconUrl from '../public/marker-red.svg'
import greenIconUrl from '../public/marker-green.svg'
import blueIconUrl from '../public/marker-blue.svg'


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


const RecenterAutomatically = ({ bounds }: { bounds: LatLngBounds }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds]);
  return null;
}

const RestaurantPopup = function({ product }: { product: Product }) {
  return (
    <>
      <Popup>
        <h5>{product.restaurant}, {product.city}</h5>
        <p>{product.product} {product.price} kr</p>
        <a href={"https://www.foodora.se/restaurant/" + product.code} target="_blank">
          Go to restaurant
        </a>
      </Popup>
      <Tooltip permanent direction="right" offset={point(5, 0)}>
        {product.price} kr
      </Tooltip>
    </>
  );
}

export default function Map({ products: products }: { products: Array<Product> }) {

  const productsCopy = [...products];

  const bounds = productsCopy && productsCopy.length > 0 ? latLngBounds(productsCopy.map((product) => (latLng(product.latitude, product.longitude)))) : latLngBounds(latLng(55, 13), latLng(70, 22));

  let cheapest, mostExpensive;
  if (productsCopy.length > 1) {
    cheapest = productsCopy?.shift();
    mostExpensive = productsCopy?.pop();
  }

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

        <RecenterAutomatically bounds={bounds} />
      </MapContainer>
    </>
  );
}
