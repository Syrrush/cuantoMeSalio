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
      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span>Powered by</span>
          <a
            // href="https://sztech.com"
            // target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/sz-tech.jpg"
              alt="SZ Tech"
              className="h-15 hover:opacity-80 transition-opacity"
            />
          </a>
        </div>
    </>
  )
}

export default App
