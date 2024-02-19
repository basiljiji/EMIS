import React from "react"
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import AdminLayout from "../components/AdminLayout"
import { useGetTeachersQuery } from "../slices/teacherApiSlice"

const TeacherManagement = () => {
  const { data: teachers, isLoading, error, refetch } = useGetTeachersQuery()

  const deleteHandler = () => {
    console.log("delete")
  }

  return (
    <AdminLayout>
      <Container>
        <Row>
          <Col md={8}>
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
                    <th>Subjects</th>
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
                        <td></td>
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
          </Col>
          <Col>
            <Form>
              <Form.Group>
                <Form.Label>Add Teacher</Form.Label>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  )
}

export default TeacherManagement
