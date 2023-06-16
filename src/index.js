import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import StarRating from './StarRating'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating messages={['hi', 'bye', 'dye', 'guy', 'shay']} /> */}
  </React.StrictMode>
)
