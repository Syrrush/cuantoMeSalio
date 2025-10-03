import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Recipes from './components/Recipes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Recipes/>
    </>
  )
}

export default App
