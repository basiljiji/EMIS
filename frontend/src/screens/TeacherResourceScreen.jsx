import React, { useState } from "react"
import { Row, Col, Card, Button, Container } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetResourcesQuery } from "../slices/resourceAdminSlice"
import { useAddAccessedFilesMutation } from "../slices/periodApiSlice"
import pdfThumbnail from "../assets/pdf-thumbnail.png"
import videoThumbnail from "../assets/video-thumbnail.png"

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
              <Col className="col-md-3 mt-4" key={resource._id}>
                <Card>
                  {(resource.filePath.endsWith(".jpg") ||
                    resource.filePath.endsWith(".JPG") ||
                    resource.filePath.endsWith(".jpeg") ||
                    resource.filePath.endsWith(".png")) && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/${resource.filePath}`}
                      alt={resource.fileName}
                      onClick={() => handleFileClick(resource.filePath)}
                      style={{
                        fontSize: "15px",
                      }}
                    />
                  )}
                  {resource.filePath.endsWith(".pdf") && (
                    <Card.Img
                      variant="top"
                      src={pdfThumbnail}
                      alt="PDF Thumbnail"
                      onClick={() => handleFileClick(resource.filePath)}
                      style={{
                        fontSize: "15px",
                        width: "150px",
                        height: "150px",
                      }}
                    />
                  )}
                  {(resource.filePath.endsWith(".mp4") ||
                    resource.filePath.endsWith(".mov") ||
                    resource.filePath.endsWith(".avi")) && (
                    <Card.Img
                      variant="top"
                      src={videoThumbnail}
                      alt="Video Thumbnail"
                      onClick={() => handleFileClick(resource.filePath)}
                      style={{
                        fontSize: "12px",
                        width: "150px",
                        height: "150px",
                      }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: "18px",
                      }}
                    >
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
