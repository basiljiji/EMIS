import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Col, Button, Nav } from "react-bootstrap"
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
} from "react-icons/fa"
import "../App.css" 


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Col
      xs={12}
      md={2}
      className={`sidebar bg-light ${collapsed ? "collapsed" : ""}`}
    >
      <Button
        className={`close-btn ${!collapsed ? "d-block" : "d-none"}`}
        onClick={() => setCollapsed(true)}
      >
        <FaTimes />
      </Button>
      <Button
        className={`open-btn ${collapsed ? "d-block" : "d-none"}`}
        onClick={() => setCollapsed(false)}
      >
        <FaBars />
      </Button>
      <Nav className="flex-column">
        <Nav.Item>
          <Link to="/admin/dashboard" className="nav-link">
            <FaChartLine className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>
              Dashboard
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/teacher" className="nav-link">
            <FaChalkboardTeacher className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Teacher</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/resource" className="nav-link">
            <FaBook className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>
              Resources
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/period" className="nav-link">
            <FaClipboardList className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Reports</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/details" className="nav-link">
            <FaSchool className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Classes</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/folder" className="nav-link">
            <FaLock className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Access</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            <FaUser className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Profile</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            <FaCog className="icon" />
            <span className={`nav-text ${collapsed ? "d-none" : ""}`}>Settings</span>
          </Link>
        </Nav.Item>
      </Nav>
    </Col>
  )
}

export default Sidebar
