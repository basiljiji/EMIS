import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import reportWebVitals from './reportWebVitals'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import AdminLoginScreen from './screens/AdminLoginScreen'
import Dashboard from './screens/Dashboard'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/dashboard' element={<Dashboard />} />

      <Route path='/admin/login' element={<AdminLoginScreen />} />
    </Route>
  )
)


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)


reportWebVitals()
