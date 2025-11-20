import './App.css'
import React from 'react'
import Home from '../src/pages/Home'

function App() {
  return (
    <>  
      <div>
        <h1>Taste of Aloha 🌺</h1>
        <p>Mahalo for visiting my Vite + JavaScript app!</p>
      </div>
      <div>
        {Home && <Home/>}
      </div>
      <p 
        name="Hawaiian Snack"
        description="A delicious tropical treat."
        price={4.99}
      />
    </>
    )
}
export default App