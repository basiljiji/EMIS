import React, { useState } from "react"
import {
  Card,
  Button,
  Modal,
  Row,
  Image,
  Col,
  Form,
  ProgressBar,
} from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import {
  useAddSubfolderMutation,
  useGetAllFoldersQuery,
  useGetSingleFolderDataQuery,
  useGetSubFoldersQuery,
  useUploadReourcesMutation,
} from "../slices/resourceAdminSlice"
import commonImage from "../assets/pdf-thumbnail.png" // Import the common image
import { FaFolder } from "react-icons/fa"
import pdfThumbnail from "../assets/pdf-thumbnail.png"
import videoThumbnail from "../assets/video-thumbnail.png"

const ResourceScreen = () => {
  const [selectedFiles, setSelectedFiles] = useState([]) // Initialize as an array
  const { id: folderName } = useParams()

  const {
    data: folderResources,
    isLoading,
    refetch,
    error,
  } = useGetSingleFolderDataQuery(folderName)

  const [addSubfolder] = useAddSubfolderMutation()

  const { data: subfolders, refetch: subfolderRefetch } =
    useGetSubFoldersQuery(folderName)

    console.log(subfolders,"sub")

  const [uploadResources] = useUploadReourcesMutation()
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadProgress, setUploadProgress] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [subfolderName, setSubfolderName] = useState("")

  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  const handleEditButtonClick = (fileUrl) => {
    if (fileUrl.endsWith(".pdf")) {
      navigate(`/admin/viewer`, {
        state: { fileUrl },
      })
    } else if (
      fileUrl.endsWith(".mp4") ||
      fileUrl.endsWith(".mp3") ||
      fileUrl.endsWith(".mov") ||
      fileUrl.endsWith(".webm") ||
      fileUrl.endsWith(".mpeg") ||
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

  const handleFileClick = (file) => {
    setSelectedFile(file)
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]) // Store all selected files
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

        const { data } = await uploadResources({ folderName, formData }, config)
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

  const subfolderHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await addSubfolder({
        folderName,
        subfolderName,
      }).unwrap()
      subfolderRefetch()
      setSubfolderName("")
      toast.success("Folder Created")
      setShowModal(false)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
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

        <Button onClick={() => setShowModal(true)}>New Folder</Button>
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
      <Row xs={3} md={6} lg={8} className="g-4">
        {subfolders?.map((subfolder) => (
          <Col key={subfolder.id}>
            <LinkContainer
              to={`/admin/resource/${subfolder.parentFolder.folderName}/${subfolder.subfolderName}`}
            >
              <Col xs="auto" className="text-center">
                <FaFolder
                  style={{
                    width: "80px",
                    height: "80px",
                    color: "gold",
                  }}
                />
                <p>{subfolder.subfolderName}</p>
              </Col>
            </LinkContainer>
          </Col>
        ))}
      </Row>
      <Row>
        {Array.isArray(folderResources?.resources) &&
          folderResources.resources.map((resource, index) => (
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
                {resource.filePath.endsWith(".pptx") && (
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
                  resource.filePath.endsWith(".mkv") ||
                  resource.filePath.endsWith(".webm") ||
                  resource.filePath.endsWith(".mp3") ||
                  resource.filePath.endsWith(".mpeg") ||
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={subfolderName}
            onChange={(e) => setSubfolderName(e.target.value)}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={subfolderHandler}>
            Save Folder
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default ResourceScreen
