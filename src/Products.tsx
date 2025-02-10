import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, fetchProducts } from './db.ts'

function Products({attr, term}) {

  let products = useLiveQuery(async () => {
    return await fetchProducts(attr, term);
  }, [attr, term]);

  return (
    <>
      <ul>
      {products?.map((product) => (
        <li key={product.id}>
          {product.restaurant}, {product.price}
        </li>
      ))}
      </ul>)
    </>
  )
}

export default Products
