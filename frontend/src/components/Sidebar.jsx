import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button, Nav } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import {
  FaHome,
  FaChartBar,
  FaUserFriends,
  FaUser,
  FaCog,
  FaBookOpen,
  FaBars,
  FaTimes,
  FaChartLine,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
  FaSchool,
  FaLock,
} from "react-icons/fa" 

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Col
      xs={12}
      md={2}
      className={`bg-light sidebar ${collapsed ? "collapsed" : ""}`}
    >
      <Button className="toggle-btn text-light" onClick={handleToggle}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </Button>
      <Nav className="flex-column" variant="pills">
        <Nav.Item>
          <Link to="/admin/dashboard" className="nav-link">
            <FaChartLine /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>
              Dashboard
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/teacher" className="nav-link">
            <FaChalkboardTeacher /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>Teacher</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/resource" className="nav-link">
            <FaBook /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>
              Resources
            </span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/period" className="nav-link">
            <FaClipboardList /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>Reports</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/details" className="nav-link">
            <FaSchool /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>Classes</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/folder" className="nav-link">
            <FaLock /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>Access</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            <FaUser /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>Profile</span>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            <FaCog /> {/* Icon */}
            <span className={`ps-2 ${collapsed ? "d-none" : ""}`}>
              Settings
            </span>
          </Link>
        </Nav.Item>
      </Nav>
    </Col>
  )
}

export default Sidebar
