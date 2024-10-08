import React, { useState, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { useAdminLoginMutation } from "../slices/adminAuthApiSlice"
import Loader from "../components/Loader"
import { toast } from "react-toastify"
import { setCredentials } from "../slices/authSlice"

const AdminLoginScreen = () => {
  const [validated, setValidated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [adminLogin, { isLoading }] = useAdminLoginMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get("redirect") || "/admin/dashboard"

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await adminLogin({ email, password }).unwrap()
      dispatch(setCredentials({ ...res }))
      navigate(redirect)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <FormContainer>
        <Card className="p-5 shadow p-3 bg-body rounded admin-login-card">
          <h3 className="text-center">Admin Login</h3>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className=""
          >
            <Form.Group controlId="validationCustom01">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom02" className="mb-3 mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="" disabled={isLoading}>
              Login
            </Button>
            {isLoading && <Loader />}
          </Form>
        </Card>
      </FormContainer>
    </>
  )
}

export default AdminLoginScreen
