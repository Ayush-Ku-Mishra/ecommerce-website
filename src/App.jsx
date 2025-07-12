import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Home from './Components/Home'
import Login from './Components/Login'
import Register from './Components/Register'
import ProductDetails from './Components/ProductDetails'
import Wishlist from './Components/Wishlist'
import Cart from './Components/Cart'
import Fashion from './Components/Fashion'
import Electronics from './Components/Electronics'
import Bags from './Components/Bags'
import FootWear from './Components/FootWear'
import Groceries from './Components/Groceries'
import Beauty from './Components/Beauty'
import Furnitures from './Components/Furnitures'
import Jewellery from './Components/Jewellery'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: 
      <div>
        <Navbar/>
        <Home/>
      </div>
    },
    {
      path: '/login',
      element: 
      <div>
        <Navbar/>
        <Login/>
      </div>
    },
    {
      path: '/register',
      element: 
      <div>
        <Navbar/>
        <Register/>
      </div>
    },
    {
      path: '/product/:id',
      element: 
      <div>
        <Navbar/>
        <ProductDetails/>
      </div>
    },
    {
      path: '/wishlist',
      element:
      <div>
        <Navbar/>
        <Wishlist/>
      </div>
    },
    {
      path: '/cart',
      element:
      <div>
        <Navbar/>
        <Cart/>
      </div>
    },
    {
      path: '/fashion',
      element:
      <div>
        <Navbar/>
        <Fashion/>
      </div>
    },
    {
      path: '/electronics',
      element:
      <div>
        <Navbar/>
        <Electronics/>
      </div>
    },
    {
      path: '/bags',
      element:
      <div>
        <Navbar/>
        <Bags/>
      </div>
    },
    {
      path: '/footwear',
      element:
      <div>
        <Navbar/>
        <FootWear/>
      </div>
    },
    {
      path: '/groceries',
      element:
      <div>
        <Navbar/>
        <Groceries/>
      </div>
    },
    {
      path: '/beauty',
      element:
      <div>
        <Navbar/>
        <Beauty/>
      </div>
    },
    {
      path: '/furnitures',
      element:
      <div>
        <Navbar/>
        <Furnitures/>
      </div>
    },
    {
      path: '/jewellery',
      element:
      <div>
        <Navbar/>
        <Jewellery/>
      </div>
    },
    {},
    {},
    {},
  ]
)

function App() {

  return (
    <div>
     <RouterProvider router={router}/>
    </div>
  )
}

export default App
