import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button } from "react-bootstrap"

const Sidebar = () => {
  return (
    <Col xs={12} md={3} className="bg-light d-flex flex-column">
      <h4>Navigation</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/reports" className="nav-link">
            Reports
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/profile" className="nav-link">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/settings" className="nav-link">
            Settings
          </Link>
        </li>
      </ul>
    </Col>
  )
}

export default Sidebar
