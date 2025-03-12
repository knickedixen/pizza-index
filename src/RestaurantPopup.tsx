import { Product } from './db.ts'
import { Tooltip, Popup } from 'react-leaflet'
import { point } from "leaflet"

export default function RestaurantPopup({ product }: { product: Product }) {
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
