import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import { SubmitReview, DisplayReviews } from './components/products.jsx'
import { SignUpForm } from "./components/auth.jsx";
import './index.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    }, {
        path: "/register",
        element: <SignUpForm/>
    }, {
        path: "/reviewing/:productId",
        element: <SubmitReview />
    }, {
        path: "/reviews/:productId",
        element: <DisplayReviews />
    }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
