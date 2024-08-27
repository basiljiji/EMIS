import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/bootstrap.min.css'
import './index.css'
import App from './App'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import reportWebVitals from './reportWebVitals'
// import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import AdminLoginScreen from './screens/AdminLoginScreen'
import AdminDashboard from './screens/AdminDashboard'
import PrivateRoute from './components/PrivateRoutes'
import AdminRoute from './components/AdminRoute'
import TeacherManagement from './screens/TeacherManagement'
import EditTeacher from './screens/EditTeacher'
import AdminResourceScreen from './screens/AdminResourceScreen'
import ResourceScreen from './screens/ResourceScreen'
import TeacherDashboard from './screens/TeacherDashboard'
import TeacherResourceScreen from './screens/TeacherResourceScreen'
import ImageCanvas from './components/ImageCanvas'
import PdfCanvas from './components/PdfCanvas'
import MediaCanvas from './components/MediaCanvas'
import AdminDetailsScreen from './screens/AdminDetailsScreen'
import AdminPeriod from './screens/AdminPeriod'
import CanvasComponent from './components/CanvasComponent'
import AdminFolderManagement from './screens/AdminFolderManagement'
import AdminEditAccessScreen from './screens/AdminEditAccessScreen'
import AdminResourceManagement from './screens/AdminResourceManagement'
import AdminSubfoldersScreen from './screens/AdminSubfoldersScreen'
import TeacherSubfolderScreen from './screens/TeacherSubfolderScreen'
import AdminResourceViewerScreen from './screens/AdminResourceViewerScreen'
import DocCanvas from './components/DocCanvas'
import AdminSubfolderResourcesScreen from './screens/AdminSubfolderResourcesScreen'
import AdminNestedSubfolderScreen from './screens/AdminNestedSubfolderScreen'
import TeacherNestedFolderResourceScreen from './screens/TeacherNestedFolderResourceScreen'
import AdminNestedFolderResource from './screens/AdminNestedFolderResource'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* <Route index={true} path='/' element={<HomeScreen />} /> */}
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/admin/login' element={<AdminLoginScreen />} />

      <Route path='/' element={<PrivateRoute />}>
        <Route path='/dashboard' element={<TeacherDashboard />} />
        <Route path='/resource/:id' element={<TeacherResourceScreen />} />
        <Route path='/resource/image' element={<ImageCanvas />} />
        <Route path='/resource/pdf' element={<PdfCanvas />} />
        <Route path='/resource/media' element={<MediaCanvas />} />
        <Route path='/resource/canvas' element={<CanvasComponent />} />
        <Route path='/resource/doc' element={<DocCanvas />} />
        <Route path='/resource/:id/:sid' element={<TeacherSubfolderScreen />} />
        <Route path='/resource/:id/:sid/:nid' element={<TeacherNestedFolderResourceScreen />} />

      </Route>


      <Route path='/' element={<AdminRoute />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/teacher' element={<TeacherManagement />} />
        <Route path='/teacher/edit/:id' element={<EditTeacher />} />
        <Route path='/admin/resource' element={<AdminResourceScreen />} />
        <Route path='/admin/resource/:id' element={<ResourceScreen />} />
        <Route path='/admin/details' element={<AdminDetailsScreen />} />
        <Route path='/admin/period' element={<AdminPeriod />} />
        <Route path='/admin/period/:pageNumber' element={<AdminPeriod />} />
        <Route path='/admin/folder' element={<AdminFolderManagement />} />
        <Route path='/admin/folder/edit/:id' element={<AdminEditAccessScreen />} />
        <Route path='/admin/resource/:id/:sid' element={<AdminSubfoldersScreen />} />
        <Route path='/admin/folder/:id' element={<AdminResourceManagement />} />
        <Route path='/admin/folder/:id/:sid/' element={<AdminSubfolderResourcesScreen />} />
        <Route path='/admin/folder/:id/:sid/:nid' element={<AdminNestedFolderResource />} />
        <Route path='/admin/viewer' element={<AdminResourceViewerScreen />} />
        <Route path='/admin/resource/:id/:sid/:nid' element={<AdminNestedSubfolderScreen />} />
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
