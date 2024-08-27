import React, { useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Col, Button, Nav } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../slices/authSlice'
import {
  FaBars,
  FaTimes,
  FaChartLine,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaSchool,
  FaLock,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa"
import "../App.css"

const Sidebar = ({ isOpen, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sidebarRef = useRef(null)

  const logoutHandler = async () => {
    try {
      dispatch(logout())
      navigate('/login')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <Button onClick={onClose} className="sidebar-close">
          <FaTimes className="white-icon" />
        </Button>
      )}

      {userInfo ? (
        <>
          <div className="sidebar-header">
            <div className="sidebar-username">
              <h5>SMPS</h5>
            </div>
          </div>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/admin/dashboard" className="sidebar-link"><FaChartLine /> Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/teacher" className="sidebar-link"><FaChalkboardTeacher /> Teacher</Nav.Link>
            <Nav.Link as={Link} to="/admin/resource" className="sidebar-link"><FaClipboardList /> Resources</Nav.Link>
            <Nav.Link as={Link} to="/admin/period" className="sidebar-link"><FaBook /> Reports</Nav.Link>
            <Nav.Link as={Link} to="/admin/details" className="sidebar-link"><FaSchool /> Classes</Nav.Link>
            <Nav.Link as={Link} to="/admin/folder" className="sidebar-link"><FaLock /> Access</Nav.Link>
          </Nav>
          <div className="sidebar-footer">
            <Button onClick={logoutHandler} className="sidebar-logout">
              <FaSignOutAlt className="white-icon" /> Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="sidebar-footer">
          <Button onClick={onClose} className="sidebar-logout">
            <FaSignOutAlt className="white-icon" /> Login
          </Button>
        </div>
      )}
    </div>
  )
}

export default Sidebar
