import React, { useState } from "react"
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import AdminLayout from "../components/AdminLayout"
import {
  useAddTeacherMutation,
  useDeleteTeacherMutation,
  useGetTeachersQuery,
} from "../slices/teacherApiSlice"

const TeacherManagement = () => {
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { data: teachers, isLoading, error, refetch } = useGetTeachersQuery()

  const [addTeacher] = useAddTeacherMutation()

  const [deleteTeacher] = useDeleteTeacherMutation()

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTeacher(id)
        toast.success("Teacher Data Deleted")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      if (firstName && lastName && email && password && confirmPassword) {
        if (password !== confirmPassword) {
          toast.error("Password and Confirm Password do not match")
        } else {
          const result = await addTeacher({
            firstName,
            middleName,
            lastName,
            email,
            password,
          })
          refetch()
          if (result && result.data.message) {
            toast.success(result.data.message)
          }
        }
      } else {
        toast.error("Please Select All Fields")
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <AdminLayout>
      <Container className="py-3">
        <Row>
          <h4>Create Teacher</h4>
          <Form>
            <Row>
              <Col>
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
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
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
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Row md={5} className="justify-content-end pe-0">
                <Button className="bg-success" onClick={submitHandler}>
                  Add Teacher
                </Button>
              </Row>
            </Row>
          </Form>
        </Row>
        <Row className="mt-5">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {/* <th>Subjects</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers &&
                  teachers.map((teacher, index) => (
                    <tr key={index}>
                      <td>
                        {teacher.firstName}{" "}
                        {teacher.lastName ? teacher.lastName : ""}
                      </td>
                      <td>{teacher.email}</td>
                      {/* <td></td> */}
                      <td>
                        <LinkContainer
                          to={`/teacher/edit/${teacher._id}`}
                          className="me-2"
                        >
                          <Button variant="primary">Edit</Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          onClick={() => deleteHandler(teacher._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
    </AdminLayout>
  )
}

export default TeacherManagement
