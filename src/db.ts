// db.ts
import Dexie, { type EntityTable } from 'dexie';

let dbVersion = 1;

interface Product {
  id: number;
  price: number;
  restaurant: string;
  postcode: string;
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
  vesuvios: '++id, price, restaurant, postcode',
  postcodes: '&postal_code, city, county, state, country'
});

function loadDatabase() {
  fetch("vesuvios.json")
    .then((res) => res.text())
    .then((text) => {
      db.vesuvios.clear()
      .then(function(){
        db.vesuvios.bulkAdd(JSON.parse(text))
      })
      .then(function() {return db.vesuvios.count()})
      .then(count => {
        console.log(`Loaded ${count} vesuvios`)
      });
  });
  fetch("postcodes.json")
    .then((res) => res.text())
    .then((text) => {
      db.postcodes.clear()
      .then(function(){
        db.postcodes.bulkAdd(JSON.parse(text))
      })
      .then(function() {return db.postcodes.count()})
      .then(count => {
        console.log(`Loaded ${count} postcodes`)
      });
  });
}


function fetchProducts(attr, term) {
  return db.postcodes.where(attr).equalsIgnoreCase(term).toArray(postcodes => {
    postcodes = postcodes.map(
      function(postcode) { 
        return postcode['postal_code'];
      }
    );

    console.log("found postcodes " + postcodes.length)
    return db.vesuvios.where("postcode").anyOf(postcodes).sortBy("price");
  })
}

export type { Product, PostCode };
export { db, loadDatabase, fetchProducts };
