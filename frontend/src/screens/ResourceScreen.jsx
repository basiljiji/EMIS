import React, { useState } from "react"
import { Card, Button, Modal, Row, Image, Col, Form } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import {
  useGetResourcesQuery,
  useUploadReourcesMutation,
} from "../slices/resourceAdminSlice"
import commonImage from "../assets/pdf-thumbnail.png" // Import the common image

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
      <Row className="mb-3">
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
                {/* Conditionally render image or common image based on file type */}
                {resource.fileType.startsWith("image") ? (
                  <Card.Img
                    variant="top"
                    src={`http://192.168.0.128:5000/${resource.filePath}`}
                    alt={resource.fileName}
                    onClick={() => handleImageClick(resource.filePath)}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src={commonImage} // Use the imported common image
                    alt="Common Image"
                    style={{ width: "80px", height: "80px" }}
                  />
                )}
                <Card.Body>
                  <Card.Title style={{ fontSize: "15px" }}>
                    {resource.fileName}
                  </Card.Title>
                  <Card.Text
                    style={{
                      fontSize: "14px",
                      fontFamily: "Arial",
                    }}
                  >
                    File Size:{" "}
                    {resource.fileSize
                      ? (resource.fileSize / (1024 * 1024)).toFixed(2) + " MB"
                      : "Unknown"}
                  </Card.Text>
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
              src={`http://192.168.0.128:5000/${selectedImage}`}
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
