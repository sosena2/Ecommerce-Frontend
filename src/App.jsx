import './App.css'

import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
function App() {

  return (
    <>
       <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
       </Routes>
      
    </>
  )
}

export default App
