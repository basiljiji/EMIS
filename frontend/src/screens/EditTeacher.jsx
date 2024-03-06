import React, { useState, useEffect } from "react"
import { Form, Container, Row, Col, Button } from "react-bootstrap"
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
        const result = await editTeacher({
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
              <Form.Group className="mb-3">
                <Form.Label>
                  First Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Middle Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Middle Name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Last Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  New Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Confirm New Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button className="mt-3 bg-secondary" onClick={submitEditHandler}>
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
