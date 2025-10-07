import React, { useState, useEffect } from "react"
import { Form, Container, Button, Row, Col } from "react-bootstrap"
import InputGroup from "react-bootstrap/InputGroup"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import {
  useEditTeacherMutation,
  useTeacherByIdQuery,
} from "../slices/teacherApiSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EditTeacher = () => {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { id: teacherId } = useParams()

  const navigate = useNavigate()

  const {
    data: teacher,
    isLoading,
    error,
    refetch,
  } = useTeacherByIdQuery(teacherId)

  useEffect(() => {
    if (teacher) {
      setFirstName(teacher.firstName || "")
      setMiddleName(teacher.middleName || "")
      setLastName(teacher.lastName || "")
      setEmail(teacher.email || "")
    }
  }, [teacher])

  const [editTeacher] = useEditTeacherMutation()

  const submitEditHandler = async (e) => {
    e.preventDefault()
    try {
      if (firstName || lastName || middleName || email || password) {
        await editTeacher({
          teacherId,
          firstName,
          middleName,
          lastName,
          email,
          password,
        })
        refetch()
        navigate("/admin/teacher")
        toast.success("Teacher Updated")
      } else {
        toast.error("Oops !!")
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }


  return (
    <>
      <Container>
        <h4>Edit Teacher</h4>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          teacher && (
            <Form className="my-3">
              <Row>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      First Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      Middle Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      Last Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      New Password <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-2">
                  <Form.Group>
                    <Form.Label>
                      Confirm New Password <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup size="sm">
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                      >
                        {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
              <Button size="sm" className="mt-2 bg-secondary" onClick={submitEditHandler}>
                Update Teacher
              </Button>
            </Form>
          )
        )}
      </Container>
    </>
  )
}

export default EditTeacher
