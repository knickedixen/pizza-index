import productData from './assets/vesuvios.json';
import regionData from "./assets/regions.json"

import { search } from 'jmespath';

//type RegionType = "state" | "county" | string;
interface Product {
  product: string;
  price: number;
  restaurant: string;
  postcode: string;
  city: string;
  variant: string;
  longitude: number;
  latitude: number;
  code: string;
  county: string;
  county_code: string;
  state: string;
  state_code: string;
}
interface Region {
  id: string;
  name: string;
  type?: string;
  geojson: any;
}

type RegionConstant = {
  minPrice: number,
  maxPrice: number,
}

const regionConstants = new Map<string, RegionConstant>([
  [
    "state", {
      minPrice: 108,
      maxPrice: 133,
    }
  ],
  [
    "county", {
      minPrice: 75,
      maxPrice: 145,
    }]
]);

const regions: Region[] = regionData;
const products: Product[] = productData;

function searchProducts(regionId: string) {
  return search(products, `[? starts_with(county_code, '${regionId}')]`);
}

function getAllRestaurants() {
  return search(products, "[*]");
}

function getRegion(id: string) {
  return search(regions, `[? id == '${id}']`);
}

function getAllRegions() {
  return search(regions, `[*]`);
}

function getRegions(type: string) {
  return search(regions, `[? type == '${type}']`);
}

function calculateAverage(products: Array<Product>) {
  let sum = products.reduce((sum, product) => sum + product.price, 0);
  return sum > 0 ? sum / products.length : 0;
}

export type { Product, Region, RegionConstant };
export { searchProducts, getAllRestaurants, getRegions, getAllRegions, getRegion, regionConstants, calculateAverage };
