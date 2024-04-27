import React, { useState } from "react"
import { Row, Col, Card, Button, Container, Breadcrumb } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import {
  useGetResourceByFolderQuery,
  useGetSubFoldersQuery,
} from "../slices/resourceAdminSlice"
import { LinkContainer } from "react-router-bootstrap"
import pdfThumbnail from "../assets/pdf.gif"
import videoThumbnail from "../assets/video.gif"
import { FaFolder } from "react-icons/fa"
import { useFetchResourcesQuery } from "../slices/resourceTeacherSlice"

const TeacherResourceScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null)

  const { id: folderName } = useParams()
  const navigate = useNavigate()

  const {
    data: folderResources,
    isLoading,
    refetch,
    error,
  } = useFetchResourcesQuery(folderName)

  const { data: subfolders } = useGetSubFoldersQuery(folderName)

  const handleFileClick = (file) => {
    setSelectedFile(file)
  }

  const handleFileEdit = (fileUrl) => {
    setSelectedFile(fileUrl)
  }

  const handleEditButtonClick = (fileUrl, portionTitle) => {
    if (fileUrl.endsWith(".pdf")) {
      navigate(`/resource/pdf`, {
        state: { fileUrl, portionTitle },
      })
    } else if (
      fileUrl.endsWith(".mp4") ||
      fileUrl.endsWith(".mov") ||
      fileUrl.endsWith(".webm") ||
      fileUrl.endsWith(".mpeg") ||
      fileUrl.endsWith(".mp3") ||
      fileUrl.endsWith(".mkv") ||
      fileUrl.endsWith(".avi")
    ) {
      navigate(`/resource/media`, {
        state: { fileUrl, portionTitle },
      })
    } else if (fileUrl.endsWith(".ppt") || fileUrl.endsWith(".pptx")) {
      navigate(`/resource/doc`, {
        state: { fileUrl, portionTitle },
      })
    } else {
      navigate(`/resource/image`, {
        state: { fileUrl, portionTitle },
      })
    }
  }

  const thumbnailStyle = {
    height: "150px", 
    fontSize: "15px",
    textAlign:"center"
  };

  return (
    <>
      <Container>
        <Row>
          <Breadcrumb>
            <LinkContainer to="/dashboard">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </LinkContainer>
            <Breadcrumb.Item active>{folderName}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row className="text-end">
          <Col>
            <LinkContainer to="/resource/canvas">
              <Button className="bg-success mt-2 fw-bold btn-lg">Open Canvas</Button>
            </LinkContainer>
          </Col>
        </Row>
        <Row xs={3} md={6} lg={8} className="g-4">
          {subfolders?.map((subfolder) => (
            <Col key={subfolder.id}>
              <LinkContainer
                to={`/resource/${subfolder.parentFolder.folderName}/${subfolder.subfolderName}`}
              >
                <Col xs="auto" className="text-center">
                  <FaFolder
                    style={{
                      width: "80px",
                      height: "80px",
                      // color: "gold",
                      color: "white",
                    }}
                  />
                  <p className="fw-bold">{subfolder.subfolderName}</p>
                </Col>
              </LinkContainer>
            </Col>
          ))}
        </Row>
        <Row>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {folderResources &&
            folderResources.resources.map((resource) => (
              <Col className="col-md-3 mt-4" key={resource._id}>
                <Card className="my-3 p-3 rounded zoom">
                  {(resource.filePath.endsWith(".jpg") ||
                    resource.filePath.endsWith(".JPG") ||
                    resource.filePath.endsWith(".jpeg") ||
                    resource.filePath.endsWith(".png")) && (
                      <Card.Img
                        variant="top"
                        src={`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/${resource.filePath}`}
                      alt={resource.portionTitle}
                        onClick={() => handleFileClick(resource.filePath)}
                        style={{ ...thumbnailStyle }}
                      />
                    )}
                  {resource.filePath.endsWith(".pdf") && (
                    <Card.Img
                      variant="top"
                      src={pdfThumbnail}
                      alt="PDF Thumbnail"
                      onClick={() => handleFileClick(resource.filePath)}
                      style={{ ...thumbnailStyle }}
                    />
                  )}
                  {(resource.filePath.endsWith(".mp4") ||
                    resource.filePath.endsWith(".mov") ||
                    resource.filePath.endsWith(".webm") ||
                    resource.filePath.endsWith(".mp3") ||
                    resource.filePath.endsWith(".mpeg") ||
                    resource.filePath.endsWith(".mkv") ||
                    resource.filePath.endsWith(".avi")) && (
                      <Card.Img
                        variant="top"
                        src={videoThumbnail}
                        alt="Video Thumbnail"
                        onClick={() => handleFileClick(resource.filePath)}
                        style={{ ...thumbnailStyle }}
                      />
                    )}
                  <Card.Body>

                    <Card.Title as="div"
                      style={{
                        fontSize: "18px",
                      }}
                      className="resource-title"
                    >
                      <span class="d-inline-block" tabindex="0" data-toggle="tooltip" title={resource.portionTitle}>
                        <strong>{resource.portionTitle}</strong>
                      </span>
                    </Card.Title>
                    <Card.Text as="h3"
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
                      variant="warning"
                      className="text-dark fw-bold col-12"
                      onClick={() =>
                        handleEditButtonClick(
                          `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/${resource.filePath}`, resource.portionTitle
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
