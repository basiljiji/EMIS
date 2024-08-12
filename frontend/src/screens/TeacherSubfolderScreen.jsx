import React, { useState } from "react"
import { Card, Col, Row, Container, Button, Breadcrumb } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { useGetSingleNestedSubfoldersQuery, useGetSingleSubfolderDataQuery } from "../slices/resourceAdminSlice"
import pdfThumbnail from "../assets/pdf.gif"
import videoThumbnail from "../assets/video.gif"
import { FaFolder } from "react-icons/fa"
import Loader from "../components/Loader"
import Message from "../components/Message"


const TeacherSubfolderScreen = () => {
  const { id: folderName, sid: subfolderName } = useParams()

  const {
    data: subfolderResources,
    refetch,
    isLoading,
    error,
  } = useGetSingleSubfolderDataQuery({ folderName, subfolderName })


  const {
    data: nestedSubfolders,
    isLoading: nestedSubfoldersLoading,
    error: nestedSubfoldersError,
    refetch: nestedSubfolderRefetch,
  } = useGetSingleNestedSubfoldersQuery({ folderName, subfolderName })


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
      fileUrl.endsWith(".webm") ||
      fileUrl.endsWith(".mp3") ||
      fileUrl.endsWith(".mkv") ||
      fileUrl.endsWith(".mpeg") ||
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

  const thumbnailStyle = {
    height: "150px",
    fontSize: "15px",
    textAlign: "center"
  };

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
        {nestedSubfoldersLoading ? (
          <Loader />
        ) : nestedSubfoldersError ? (
          <p>
            <Message variant="danger">
              {nestedSubfoldersError?.data?.message || nestedSubfoldersError.error}
            </Message>
          </p>
        ) : (
          <Row>
            {nestedSubfoldersLoading ? (
              <Loader />
            ) : nestedSubfoldersError ? (
              <p>
                <Message variant="danger">
                  {nestedSubfoldersError?.data?.message || nestedSubfoldersError.error}
                </Message>
              </p>
            ) : (
              <Row xs={3} md={6} lg={8} className="g-4">
                {(nestedSubfolders?.nestedSubfolders || []).map((folder) => (
                  <Col key={folder._id}>
                    <LinkContainer to={`/resource/${folder.parentFolder.folderName}/${folder.parentSubfolder.subfolderName}/${folder.nestedSubfolderName}`}>
                      <Col xs="auto" className="text-center">
                        <FaFolder
                          style={{
                            width: "80px",
                            height: "80px",
                            color: "white",
                          }}
                        />
                        <p className="fw-bold">{folder.nestedSubfolderName}</p>
                      </Col>
                    </LinkContainer>
                  </Col>
                )) || <p>No nested subfolders available.</p>}
              </Row>
            )}
          </Row>

        )}
      </Row>
      <Row>
        {Array.isArray(subfolderResources?.resources) &&
          subfolderResources.resources.map((resource, index) => (
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
                        `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/${resource.filePath}`
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
