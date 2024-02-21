import React, { useState } from "react"
import { Row, Col, Button, Form, Container } from "react-bootstrap"
import { toast } from "react-toastify"

import AdminLayout from "../components/AdminLayout"
import { useAddFolderMutation } from "../slices/resourceAdminSlice"

const AdminResourceScreen = () => {
  const [folderName, setFolderName] = useState("")

  const [addFolder] = useAddFolderMutation()

  const folderHandler = async (e) => {
    console.log(folderName, "123")
    e.preventDefault()
    try {
      const res = await addFolder({ folderName }).unwrap()
      toast.success("Folder Created")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

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
                <Form.Control
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                ></Form.Control>
              </Col>
              <Col>
                <Button onClick={folderHandler}>Add Folder</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  )
}

export default AdminResourceScreen
