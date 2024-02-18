import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button } from "react-bootstrap"
import Sidebar from "./Sidebar"

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        {!collapsed && <Sidebar />}
        {/* Main content */}
        <Col>
          <Col xs={12} className="px-0">
            {children}
          </Col>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminLayout
