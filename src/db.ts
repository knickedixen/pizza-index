// db.ts
import Dexie, { type EntityTable } from 'dexie';

let dbVersion = 1;

interface Product {
  id: number;
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
    'id'
  >;
  postcodes: EntityTable<
    PostCode,
    'postal_code'
  >;
};

db.version(dbVersion).stores({
  vesuvios: '++id, product, price, restaurant, postcode, city, variant, longitude, latitude, code',
  postcodes: '&postal_code, city, county, state, country'
});

async function loadDatabase() {
  return db.vesuvios.clear()
    .then(() => fetch("public/vesuvios.json"))
    .then((res) => res.text())
    .then((text) => db.vesuvios.bulkAdd(JSON.parse(text)))
    .then(() => console.log("Loaded vesuvios 2"))
    .then(() => db.postcodes.clear())
    .then(() => fetch("public/postcodes.json"))
    .then((res) => res.text())
    .then((text) => db.postcodes.bulkAdd(JSON.parse(text)))
    .then(() => console.log("Loaded postcodes"));
}

function searchProducts(attr: string, term: string) {
  if (attr == "city") {
    // TODO: Remove this when we got all postcodes. 
    // Seems like the restaurants sets their own city on foodora.
    return db.vesuvios.where("city").equalsIgnoreCase(term).sortBy("price");
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
