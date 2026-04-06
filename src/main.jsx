import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FallbackElement from "./components/FallbackElement"


import MainRoute from "./routes/MainRoute.jsx";

const router = createBrowserRouter(MainRoute);

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
      <RouterProvider router={router} fallbackElement={<FallbackElement />} />
  </StrictMode>,
)