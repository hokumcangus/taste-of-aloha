import './App.css'
import SnackCard from './components/cards'

function App() {

  return (
    <>  
    <div>
      <h1>Taste of Aloha 🌺</h1>
      <p>Mahalo for visiting my Vite + TypeScript app!</p>
    </div>
    <SnackCard 
      name="Hawaiian Snack"
      description="A delicious tropical treat."
      price={4.99}
    />
    </>
    )
}
export default App
