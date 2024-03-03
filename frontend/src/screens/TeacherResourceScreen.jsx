import React, { useState } from "react"
import { Row, Col, Card, Button, Container } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetResourcesQuery } from "../slices/resourceAdminSlice"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"

const TeacherResourceScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const { id: folderName } = useParams()
  const navigate = useNavigate()

  const {
    data: resources,
    isLoading,
    refetch,
    error,
  } = useGetResourcesQuery(folderName)


  const handleFileClick = (file) => {
    setSelectedFile(file)
  }

  const handleFileEdit = (fileUrl) => {
    setSelectedFile(fileUrl)
  }

  const handleEditButtonClick = (fileUrl) => {
    if (fileUrl.endsWith(".pdf")) {
      navigate(`/resource/pdf`, {
        state: { fileUrl },
      })
    } else if (
      fileUrl.endsWith(".mp4") ||
      fileUrl.endsWith(".mov") ||
      fileUrl.endsWith(".avi")
    ) {
      navigate(`/resource/media`, {
        state: { fileUrl },
      })
    } else {
      navigate(`/resource/image`, {
        state: { fileUrl },
      })
    }
  }

  return (
    <>
      <Container>
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
                    onClick={() => handleFileClick(resource.filePath)}
                  />
                  <Card.Body>
                    <Card.Title>{resource.fileName}</Card.Title>
                    <Card.Text>File Size: {resource.fileSize}</Card.Text>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleEditButtonClick(
                          `http://localhost:5000/${resource.filePath}`
                        )
                      }
                    >
                      View
                    </Button>
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
      </Container>
    </>
  )
}

export default TeacherResourceScreen
