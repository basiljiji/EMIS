import React, { useEffect } from "react"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaUser } from "react-icons/fa"
import { useLogoutMutation } from "../slices/teacherAuthApiSlice"
import { logout } from "../slices/authSlice"
import logo from "../assets/logo.png"
import { useAdminLogoutMutation } from "../slices/adminAuthApiSlice"

const Header = () => {
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
      <Navbar expand="lg" collapseOnSelect className="py-3">
        <Container>
          <LinkContainer to="/dashboard">
            <Navbar.Brand>
              <img src={logo} alt="SMPS" width="30px" height="30px" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="bg-light"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userInfo && userInfo.role === "admin" ? (
                <LinkContainer to="/admin/dashboard">
                  <Nav.Link className="text-light">Home</Nav.Link>
                </LinkContainer>
              ) : (
                <LinkContainer to="/dashboard">
                  <Nav.Link className="text-light">Home</Nav.Link>
                </LinkContainer>
              )}
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
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/dashboard">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
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
