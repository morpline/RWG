import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Connect from './connect.jsx';


const router = createBrowserRouter([
  {
    path: "/RWG/",
    element: <App/>,
  },
  {
    path: "/RWG/play",
    element: <Connect/>,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
