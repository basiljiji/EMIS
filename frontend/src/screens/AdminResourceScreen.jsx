import React, { useState } from "react"
import { Row, Col, Button, Form, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"

import AdminLayout from "../components/AdminLayout"
import {
  useAddFolderMutation,
  useGetAllFoldersQuery,
} from "../slices/resourceAdminSlice"
import { FaFolder } from "react-icons/fa"

const AdminResourceScreen = () => {
  const [folderName, setFolderName] = useState("")

  const [addFolder] = useAddFolderMutation()
  const {
    data: allFolders,
    isLoading,
    refetch,
    error,
  } = useGetAllFoldersQuery()

  const folderHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await addFolder({ folderName }).unwrap()
      refetch()
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
                />
              </Col>
              <Col>
                <Button onClick={folderHandler}>Add Folder</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <h3>List Folders</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            allFolders.map((folder) => (
              <Row key={folder.id} className="align-items-center">
                <LinkContainer to={`/admin/resource/${folder.folderName}`}>
                  <Col xs="auto">
                    <FaFolder style={{ width: "50px", height: "50px" }} />
                    <p>{folder.folderName}</p>
                  </Col>
                </LinkContainer>
              </Row>
            ))
          )}
        </Row>
      </Container>
    </AdminLayout>
  )
}

export default AdminResourceScreen
