import React, { useState } from "react"
import { Card, Button, Modal, Row, Image, Col, Form } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import {
  useGetResourcesQuery,
  useUploadReourcesMutation,
} from "../slices/resourceAdminSlice"

const ResourceScreen = () => {
  const [selectedFile, setSelectedFile] = useState("")

  const { id: folderName } = useParams()

  const {
    data: resources,
    isLoading,
    refetch,
    error,
  } = useGetResourcesQuery(folderName)

  const [uploadResources] = useUploadReourcesMutation()

  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      if (!selectedFile) {
        throw new Error("No file selected")
      }

      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await uploadResources({ folderName, formData })
      refetch()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <AdminLayout>
      <Row>
        <Form>
          <Form.Group controlId="upload" className="my-2">
            <Form.Label>Resources</Form.Label>
            <Form.Control
              name="file"
              type="file"
              label="Choose file"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button onClick={handleUpload}>Upload Resources</Button>
        </Form>
      </Row>
      <Row>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {resources &&
          resources.map((resource) => (
            <Col className="col-md-3" key={resource._id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/${resource.filePath}`}
                  alt={resource.fileName}
                  onClick={() => handleImageClick(resource.filePath)}
                />
                <Card.Body>
                  <Card.Title>{resource.fileName}</Card.Title>
                  <Card.Text>File Size: {resource.fileSize}</Card.Text>
                  <Button
                    variant="primary"
                    href={`http://localhost:5000/${resource.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* Modal to display the selected image */}
      <Modal show={selectedImage !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <Image
              src={`http://localhost:5000/${selectedImage}`}
              alt="Selected"
              style={{ width: "100%" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default ResourceScreen
