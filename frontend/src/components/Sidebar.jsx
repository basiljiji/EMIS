import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button, Nav } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const Sidebar = () => {
  return (
    <Col xs={12} md={2} className="bg-light d-flex flex-column pb-5 pt-3 p-0">
      <h5 className="ps-2">Navigation</h5>
      <Nav className="flex-column" variant="pills">
        <Nav.Item>
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/reports" className="nav-link">
            Reports
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/admin/teacher" className="nav-link">
            Teacher Management
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            Profile
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="#" className="nav-link">
            Settings
          </Link>
        </Nav.Item>
      </Nav>
    </Col>
  )
}

export default Sidebar
