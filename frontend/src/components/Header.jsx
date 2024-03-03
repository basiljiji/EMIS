import React, { useEffect } from "react"
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaUser } from "react-icons/fa"
import { useLogoutMutation } from "../slices/teacherAuthApiSlice"
import { logout } from "../slices/authSlice"
import logo from "../assets/logo.png"

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
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
        const oneHour = 60 * 1000 // 1 hour in milliseconds
        const currentTime = Date.now()
        if (currentTime - parseInt(loginTime) >= oneHour) {
          console.log("Logout")
          logoutHandler()
          const userInfoString = localStorage.removeItem("userInfo")
        }
      }
    }
  }, []) // Run this effect only once when the component mounts

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="py-3">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="EMIS" width="50px" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>Links</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/">
                <Nav.Link>FAQ</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="ms-auto">
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/fixture">
                    <NavDropdown.Item>Fixtures</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
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
