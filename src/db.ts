import Dexie, { type EntityTable } from 'dexie';
import vesuviosData from './assets/vesuvios.json';
import postcodesData from './assets/postcodes.json';

const vesuvios: Product[] = vesuviosData;
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
interface PostCode {
  postal_code: string;
  city: string;
  county: string;
  state: string;
  country: string;
}

const db = new Dexie('PizzaIndex') as Dexie & {
  vesuvios: EntityTable<
    Product,
    'code'
  >;
  postcodes: EntityTable<
    PostCode,
    'postal_code'
  >;
};

db.version(dbVersion).stores({
  vesuvios: '&code, product, price, restaurant, postcode, city, variant, longitude, latitude',
  postcodes: '&postal_code, city, county, state, country'
});

async function loadDatabase() {
  return db.vesuvios.clear()
    .then(() => db.vesuvios.bulkAdd(vesuvios))
    .then(() => db.postcodes.clear())
    .then(() => db.postcodes.bulkAdd(postcodes))
}

function searchProducts(attr: string, term: string) {
  if (attr == "country") {
    // TODO: do this differently... empty arguments?
    return db.vesuvios.where("price").above(0).sortBy("price");
  } else {
    return db.postcodes.where(attr).equalsIgnoreCase(term).toArray(postcodes => {
      let postal = postcodes.map(
        function(postcode) {
          return postcode['postal_code'];
        }
      );

      return db.vesuvios.where("postcode").anyOf(postal).sortBy("price");
    })
  }
}

function fetchUniqueValues(attr: string) {
  return db.postcodes.orderBy(attr).uniqueKeys();
}

export type { Product, PostCode };
export { db, loadDatabase, searchProducts, fetchUniqueValues };
