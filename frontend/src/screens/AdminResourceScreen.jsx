import React from "react"
import { Row, Col, Button, Form, Container } from "react-bootstrap"
import AdminLayout from "../components/AdminLayout"

const AdminResourceScreen = () => {
  return (
    <AdminLayout>
      <Container className="py-3 justify-content-between ">
        <Row>
          <Col>
            <h5>Admin Resource Screen</h5>
          </Col>
          <Col>
            <Row className="justify-content-md-center">
              <Col>
                <Form.Control type="text"></Form.Control>
              </Col>
              <Col>
                <Button>Add Folder</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  )
}

export default AdminResourceScreen
