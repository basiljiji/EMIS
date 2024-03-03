import React, { useState, useEffect } from "react"
import { Container, Col, Row, Table, Form, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import {
  useAddClassMutation,
  useDeleteClassMutation,
  useGetClassesQuery,
} from "../slices/classApiSlice"

const AdminDetailsScreen = () => {
  const [className, setClassName] = useState("")

  const [classData, setClassData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const [subjectData, setSubjectData] = useState([])

  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes, refetch } = useGetClassesQuery()

  const [addClass] = useAddClassMutation()
  const [deleteClass] = useDeleteClassMutation()
  
  const [addSection] = useAddClassMutation()
  const [addSubject] = useAddClassMutation()

  useEffect(() => {
    if (classes) setClassData(classes)
    if (sections) setSectionData(sections)
    if (subjects) setSubjectData(subjects)
  }, [classes, sections, subjects])

  const addClassHandler = async (e) => {
    e.preventDefault()
    try {
      const result = await addClass({
        classDetail: className,
      })
      refetch()
      toast.success("Success")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteClass(id)
        toast.success("Fixture Deleted")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <div>
      <Container>
        <Row>
          <Col md={4}>
            <h4>Add Class</h4>
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <Button className="mt-3" onClick={addClassHandler}>
              Add Class
            </Button>
          </Col>
          <Col>
            <h4>List Class</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Class Name</th>
                </tr>
              </thead>
              <tbody>
                {classData.map((classItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{classItem.class}</td>
                    <td>
                      <LinkContainer to="/admin/details" className="me-2">
                        <Button variant="primary">Edit</Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        onClick={() => deleteHandler(classItem._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <hr />
        <Row className="my-3">
          <Col md={4}>
            <h4>Add Section</h4>
            <Form.Label>Section Name</Form.Label>
            <Form.Control type="text" placeholder="Section Name" />
            <Button className="mt-3">Add Section</Button>
          </Col>
          <Col>
            <h4>List Section</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Section Name</th>
                </tr>
              </thead>
              <tbody>
                {sectionData.map((sectionItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{sectionItem.section}</td>
                    <td>
                      <LinkContainer to="/admin/details" className="me-2">
                        <Button variant="primary">Edit</Button>
                      </LinkContainer>
                      <Button variant="danger" onClick={() => deleteHandler()}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <hr />

        <Row>
          <Col md={4}>
            <h4>Add Subject</h4>
            <Form.Label>Subject Name</Form.Label>
            <Form.Control type="text" placeholder="Subject Name" />
            <Button className="mt-3">Add Subject</Button>
          </Col>
          <Col>
            <h4>List Subject</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject Name</th>
                </tr>
              </thead>
              <tbody>
                {subjectData.map((subjectItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{subjectItem.subject}</td>
                    <td>
                      <LinkContainer to="/admin/details" className="me-2">
                        <Button variant="primary">Edit</Button>
                      </LinkContainer>
                      <Button variant="danger" onClick={() => deleteHandler()}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminDetailsScreen
