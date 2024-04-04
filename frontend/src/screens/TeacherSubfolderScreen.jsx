import React, { useState } from "react"
import { Card, Col, Row, Container, Button, Breadcrumb } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetSingleSubfolderDataQuery } from "../slices/resourceAdminSlice"
import pdfThumbnail from "../assets/pdf-thumbnail.png"
import videoThumbnail from "../assets/video-thumbnail.png"

const TeacherSubfolderScreen = () => {
  const { id: folderName, sid: subfolderName } = useParams()

  const {
    data: subfolderResources,
    refetch,
    isLoading,
    error,
  } = useGetSingleSubfolderDataQuery({ folderName, subfolderName })

  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

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
    <Container>
      <Row>
        <Breadcrumb>
          <LinkContainer to="/dashboard">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to={`/resource/${folderName}`}>
            <Breadcrumb.Item>{folderName}</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>{subfolderName}</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Row>
        {Array.isArray(subfolderResources?.resources) &&
          subfolderResources.resources.map((resource, index) => (
            <Col className="col-md-3 mt-4" key={resource._id}>
              <Card>
                {(resource.filePath.endsWith(".jpg") ||
                  resource.filePath.endsWith(".JPG") ||
                  resource.filePath.endsWith(".jpeg") ||
                  resource.filePath.endsWith(".png")) && (
                  <Card.Img
                    variant="top"
                    src={`http://127.0.0.1:5000/${resource.filePath}`}
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
                        `http://127.0.0.1:5000/${resource.filePath}`
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
  )
}

export default TeacherSubfolderScreen
