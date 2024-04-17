import React, { useState } from "react"
import { Card, Col, Row, Button, Form, ProgressBar } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import { useParams, useNavigate } from "react-router-dom"
import {
  useGetSingleSubfolderDataQuery,
  useUploadFilesSubfolderMutation,
} from "../slices/resourceAdminSlice"
import pdfThumbnail from "../assets/pdf-thumbnail.png"
import videoThumbnail from "../assets/video-thumbnail.png"

const AdminSubfoldersScreen = () => {
  const { id: folderName, sid: subfolderName } = useParams()

  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])

  const {
    data: subfolderResources,
    refetch,
    isLoading,
    error,
  } = useGetSingleSubfolderDataQuery({ folderName, subfolderName })

  const [uploadFilesSubfolder] = useUploadFilesSubfolderMutation()

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files])
  }

  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  const handleFileClick = (file) => {
    setSelectedFile(file)
  }

    const handleEditButtonClick = (fileUrl) => {
      if (fileUrl.endsWith(".pdf")) {
        navigate(`/admin/viewer`, {
          state: { fileUrl },
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
        navigate(`/admin/viewer`, {
          state: { fileUrl },
        })
      } else {
        navigate(`/admin/viewer`, {
          state: { fileUrl },
        })
      }
    }

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        throw new Error("No files selected")
      }

      const formDataArray = selectedFiles.map((file) => {
        const formData = new FormData()
        formData.append("files", file)
        return formData
      })

      const uploadPromises = formDataArray.map(async (formData, index) => {
        const config = {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setUploadProgress((prev) => {
              const newProgress = [...prev]
              newProgress[index] = percentCompleted
              return newProgress
            })
          },
        }

        const { data } = await uploadFilesSubfolder(
          { folderName, subfolderName, formData },
          config
        )
        setUploadProgress((prev) => {
          const newProgress = [...prev]
          newProgress[index] = 100
          return newProgress
        })
        return data
      })

      await Promise.all(uploadPromises)
      refetch()
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || err.message)
    }
  }

  return (
    <>
      <AdminLayout>
        <Row xs="auto"></Row>
        <Row>
          <Form>
            <Form.Group controlId="upload" className="my-2">
              <Form.Control
                name="file"
                type="file"
                label="Choose file"
                onChange={handleFileChange}
                multiple
              />
            </Form.Group>
            <Button onClick={handleUpload}>Upload Resources</Button>
          </Form>
        </Row>
        {selectedFiles.length > 0 && (
          <Row>
            {selectedFiles.map((file, index) => (
              <Col className="col-md-3" key={index}>
                <ProgressBar
                  animated
                  now={uploadProgress[index] || 0}
                  label={`${uploadProgress[index] || 0}%`}
                />
                <Card>
                  <Card.Body>
                    <Card.Title>{file.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
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
                      src={`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/${resource.filePath}`}
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
                    resource.filePath.endsWith(".mpeg") ||
                    resource.filePath.endsWith(".mp3") ||
                    resource.filePath.endsWith(".webm") ||
                    resource.filePath.endsWith(".mkv") ||
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
                      {resource.portionTitle}
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
      </AdminLayout>
    </>
  )
}

export default AdminSubfoldersScreen
