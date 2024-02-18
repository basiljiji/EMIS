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
import EditFixture from './screens/EditFixture'
import AdminDashboard from './screens/AdminDashboard'
import PrivateRoute from './components/PrivateRoutes'
import AdminRoute from './components/AdminRoute'
import FixtureReport from './screens/FixtureReport'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/admin/login' element={<AdminLoginScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/fixture/edit/:id' element={<EditFixture />} />
      </Route>


      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/reports' element={<FixtureReport />} />
      </Route>

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
