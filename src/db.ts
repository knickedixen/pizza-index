import Dexie, { type EntityTable } from 'dexie';
import productData from './assets/vesuvios.json';
import postcodesData from './assets/postcodes.json';
import countyData from "./assets/counties.json"
import stateData from "./assets/states.json"

const counties: Region[] = countyData;
const states: Region[] = stateData;
const products: Product[] = productData;
const postcodes: PostCode[] = postcodesData;

let dbVersion = 1;

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
}
interface Region {
  id: string;
  name: string;
  type?: RegionType;
  geojson: any;
}
interface PostCode {
  postal_code: string;
  city: string;
  county: string;
  county_code: string;
  state: string;
  state_code: string;
  country: string;
}
type RegionType = "state" | "county";

type RegionConstant = {
  minPrice: number,
  maxPrice: number,
  label: string,
  searchAttr: string
}

const regionConstants = new Map<RegionType, RegionConstant>([
  [
    "state", {
      minPrice: 108,
      maxPrice: 133,
      label: "Län",
      searchAttr: "state_code"
    }
  ],
  ["county", {
    minPrice: 75,
    maxPrice: 145,
    label: "Kommuner",
    searchAttr: "county_code"
  }]
]);

const db = new Dexie('PizzaIndex') as Dexie & {
  product: EntityTable<
    Product,
    'code'
  >;
  postcode: EntityTable<
    PostCode,
    'postal_code'
  >;
  region: EntityTable<
    Region,
    'id'
  >;
};

db.version(dbVersion).stores({
  product: '&code, product, price, restaurant, postcode, city, variant, longitude, latitude',
  postcode: '&postal_code, city, county, county_code, state, state_code, country',
  region: '&id, name, type, geojson',
});

async function loadDatabase() {
  return db.product.clear()
    .then(() => db.product.bulkAdd(products))
    .then(() => db.postcode.clear())
    .then(() => db.postcode.bulkAdd(postcodes))
    .then(() => db.region.clear())
    .then(() => db.region.bulkAdd(states.map(state => ({ ...state, type: 'state' }))))
    .then(() => db.region.bulkAdd(counties.map(county => ({ ...county, type: 'county' }))))
}

//function searchProducts(attr: string, term: string) {
//  return db.postcode.where(attr).equalsIgnoreCase(term).toArray(postcodes => {
//    let postal = postcodes.map(
//      function(postcode) {
//        return postcode['postal_code'];
//      }
//    );
//
//    return db.product.where("postcode").anyOf(postal).sortBy("price");
//  })
//}
function searchProducts(id: string) {
  return getRegion(id).then((region) => {
    if (region) {
      return db.postcode.where(`${region.type}_code`).equals(region.id).toArray(postcodes => {
        let postal = postcodes.map(
          function(postcode) {
            return postcode['postal_code'];
          }
        );
        return db.product.where("postcode").anyOf(postal).sortBy("price");
      });
    }
  })
}

function getAllRestaurants() {
  return db.product.toArray();
}

function getRegion(id: string) {
  return db.region.where("id").equals(id).first();
}
function getRegions(type: RegionType) {
  return db.region.where("type").equalsIgnoreCase(type).toArray();
}

export type { Product, PostCode, Region, RegionType, RegionConstant };
export { db, loadDatabase, searchProducts, getAllRestaurants, getRegions, getRegion, regionConstants };
