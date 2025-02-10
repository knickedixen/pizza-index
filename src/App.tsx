import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import './App.css'
import { db, fetchProducts } from './db.ts'
import Products from './Products.tsx'

function App() {
  const count = useLiveQuery(() => db.vesuvios.count());
  const [attr, setAttr] = useState("city")
  const [term, setTerm] = useState("linköping")

  function handleClick() {
    setAttr("county");
    setTerm("stockholm");
  }


  return (
    <>
      <div className="page">
        <div className="header">
          <h3>PizzaIndex</h3>
          <Button onClick={handleClick}/>
        </div>
        <div className="main">
          <div className="left"><Products attr={attr} term={term}/></div>
          <div className="right"><p>We got this many vesuvios: {count}</p></div>
        </div>
      </div>
    </>
  )
}

function Button({ onClick }) {

  return (
    <button onClick={onClick}>
      Search
    </button>
  )
}

export default App
