import { useState } from 'react'
import './App.css'
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Footer from './components/Footer'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import "./App.css"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <>
      <Header onSidebarToggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main>
        <Container fluid className='p-0'>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App