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
        const oneHour = 60 * 60 * 1000
        const currentTime = Date.now()
        if (currentTime - parseInt(loginTime) >= oneHour) {
          console.log("Logout")
          localStorage.removeItem("userInfo")
          logoutHandler()
        }
      }
    }
  }, [])

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="py-3">
        <Container>
          <LinkContainer to="/dashboard">
            <Navbar.Brand>
              <img src={logo} alt="SMPS" width="30px" height="30px" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/dashboard">
                <Nav.Link className="text-light">Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/dashboard">
                <Nav.Link className="text-light">Links</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/dashboard">
                <Nav.Link className="text-light">FAQ</Nav.Link>
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
