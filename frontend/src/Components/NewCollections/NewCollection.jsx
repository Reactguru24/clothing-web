import React, { useEffect, useState } from 'react'
import './NewCollection.css'
import new_collection from '../Assets/new_collections'
import Item from '../Items/Item'

function NewCollection() {

  const [new_collection, setNew_collection]=useState([])

  useEffect(()=>{
    fetch('http://localhost:4001/newcollections')
    .then(response => response.json())
    .then(data => setNew_collection(data))
  },[])

  return (
    <div className='new-collection'>
<h1>NEW COLLECTIONS</h1>
<hr />
<div className="collection">
 {new_collection.map((item,i)=>{
       return <Item
       key={i}
       id={item.id}
       name={item.name}
       image={item.image}
       new_price={item.new_price}
       old_price={item.old_price}
       /> 
 })}
 </div>
</div>
  )
}

export default NewCollection