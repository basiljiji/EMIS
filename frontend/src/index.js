import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/bootstrap.min.css'
import './index.css'
import App from './App'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import reportWebVitals from './reportWebVitals'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import AdminLoginScreen from './screens/AdminLoginScreen'
import EditFixture from './screens/EditFixture'
import AdminDashboard from './screens/AdminDashboard'
import PrivateRoute from './components/PrivateRoutes'
import AdminRoute from './components/AdminRoute'
import FixtureReport from './screens/FixtureReport'
import TeacherManagement from './screens/TeacherManagement'
import EditTeacher from './screens/EditTeacher'
import AdminResourceScreen from './screens/AdminResourceScreen'
import ResourceScreen from './screens/ResourceScreen'
import FixturesScreen from './screens/FixturesScreen'
import TeacherDashboard from './screens/TeacherDashboard'
import TeacherResourceScreen from './screens/TeacherResourceScreen'
import ImageCanvas from './components/ImageCanvas'
import PdfCanvas from './components/PdfCanvas'
import MediaCanvas from './components/MediaCanvas'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/admin/login' element={<AdminLoginScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/dashboard' element={<TeacherDashboard />} />
        <Route path='/fixture' element={<FixturesScreen />} />
        <Route path='/fixture/edit/:id' element={<EditFixture />} />
        <Route path='/resource/:id' element={<TeacherResourceScreen />} />
        <Route path='/resource/image' element={<ImageCanvas />} />
        <Route path='/resource/pdf' element={<PdfCanvas />} />
        <Route path='/resource/media' element={<MediaCanvas />} />
      </Route>


      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/reports' element={<FixtureReport />} />
        <Route path='/admin/teacher' element={<TeacherManagement />} />
        <Route path='/teacher/edit/:id' element={<EditTeacher />} />
        <Route path='/admin/resource' element={<AdminResourceScreen />} />
        <Route path='/admin/resource/:id' element={<ResourceScreen />} />
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
