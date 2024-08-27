import React, { useEffect, useState } from "react"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaBars, FaUser } from "react-icons/fa"
import { useLogoutMutation } from "../slices/teacherAuthApiSlice"
import { logout } from "../slices/authSlice"
import logo from "../assets/logo.png"
import { useAdminLogoutMutation } from "../slices/adminAuthApiSlice"
import "../App.css"


const Header = ({ onSidebarToggle }) => {
  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()
  const [adminLogout] = useAdminLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  const adminLogoutHandler = async () => {
    try {
      await adminLogout().unwrap()
      dispatch(logout())
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo")
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString)
      const { loginTime } = userInfo
      if (loginTime) {
        const oneHour = 30 * 24 * 60 * 60 * 1000
        const currentTime = Date.now()
        if (currentTime - parseInt(loginTime) >= oneHour) {
          console.log("Logout")
          localStorage.clear()
          logoutHandler()
        }
      }
    }
  }, [])

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="py-3 navbar">
        
        <Container>
          {userInfo && userInfo.role === "admin" ? (
            <>
              <Button onClick={onSidebarToggle} className="sidebar-toggle">
                <FaBars className="white-icon" />
              </Button>
            </>
          ) : (
            <div className="sidebar-footer">
            </div>
          )}
          <LinkContainer to="/dashboard">
            <Navbar.Brand>
              <img src={logo} alt="SMPS" width="30px" height="30px" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="bg-danger"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userInfo ? (
                userInfo.role === "admin" ? (
                  <p></p>
                ) : (
                  <LinkContainer to="/dashboard">
                    <Nav.Link className="text-light">Home</Nav.Link>
                  </LinkContainer>
                )
              ) : null}
            </Nav>
            <Nav className="ms-auto">
              {userInfo ? (
                userInfo.role === "admin" ? (
                  <Nav.Item>
                    <Button
                      onClick={adminLogoutHandler}
                      className="text-light btn btn-danger"
                    >
                      Logout
                    </Button>
                  </Nav.Item>
                ) : (
                  <>
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/dashboard">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                   <Button className="bg-danger" onClick={logoutHandler}>
                      Logout
                    </Button>
                  </>
                )
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="text-light">
                    <FaUser /> Login
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
