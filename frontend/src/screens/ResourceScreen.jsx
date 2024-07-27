import React, { useState, useEffect } from "react"
import {
  Card,
  Button,
  Modal,
  Row,
  Image,
  Col,
  Form,
  ProgressBar,
  Container,
  InputGroup
} from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import {
  useAddSubfolderMutation,
  useGetSingleFolderDataQuery,
  useGetSubFoldersQuery,
  useUploadReourcesMutation,
} from "../slices/resourceAdminSlice"
import { FaFolder } from "react-icons/fa"
import pdfThumbnail from "../assets/pdf.gif"
import videoThumbnail from "../assets/video.gif"
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

const ResourceScreen = () => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const { id: folderName } = useParams()

  const {
    data: folderResources = { resources: [] },
    isLoading,
    refetch,
    error,
  } = useGetSingleFolderDataQuery(folderName)

  const [addSubfolder] = useAddSubfolderMutation()
  const { data: subfolders = [], refetch: subfolderRefetch } = useGetSubFoldersQuery(folderName)
  const [uploadResources] = useUploadReourcesMutation()

  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadProgress, setUploadProgress] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [subfolderName, setSubfolderName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ folders: [], resources: [] })

  const navigate = useNavigate()

  const handleEditButtonClick = (fileUrl) => {
    navigate(`/admin/viewer`, {
      state: { fileUrl },
    })
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
    setSelectedFiles([...event.target.files])
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

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Ensure sorting only applies to valid folder data
  const sortedFolders = subfolders.slice().sort((a, b) => {
    if (!a.subfolderName || !b.subfolderName) {
      console.error('Invalid folder data:', a, b)
      return 0
    }
    if (sortOrder === "asc") {
      return a.subfolderName.localeCompare(b.subfolderName)
    } else {
      return b.subfolderName.localeCompare(a.subfolderName)
    }
  })

  useEffect(() => {
    const filteredFolders = subfolders.filter((folder) =>
      folder.subfolderName?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
    )

    const filteredResources = folderResources.resources.filter((resource) =>
      resource.portionTitle?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
    )

    setSearchResults({ folders: filteredFolders, resources: filteredResources })
  }, [searchQuery, subfolders, folderResources])

  const thumbnailStyle = {
    height: "150px",
    fontSize: "15px",
    textAlign: "center",
  }

  return (
    <AdminLayout>
      <Container>
        <Row>
          <Col md={6}>
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
          </Col>
          <Col md={6} className="text-end">
            <Button className="my-2" onClick={() => setShowModal(true)}>
              New Folder
            </Button>
          </Col>
        </Row>
        <Row className="my-4">
          <Col md={6}>
            <InputGroup>
              <Typeahead
                id="search"
                labelKey="name"
                options={[...sortedFolders, ...folderResources.resources].map(item => item.subfolderName || item.portionTitle)}
                placeholder="Search..."
                onChange={(selected) => handleSearch(selected[0])}
                onInputChange={(text) => handleSearch(text)}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="text-end">
            <Button onClick={handleSortOrderChange}>
              Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
            </Button>
          </Col>
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
          {searchResults.folders.map((subfolder) => (
            <Col key={subfolder.id}>
              <LinkContainer
                to={`/admin/resource/${subfolder.parentFolder.folderName}/${subfolder.subfolderName}`}
              >
                <Col xs="auto" className="text-center">
                  <FaFolder
                    style={{
                      width: "80px",
                      height: "80px",
                      color: "white",
                    }}
                  />
                  <p className="fw-bold ">{subfolder.subfolderName}</p>
                </Col>
              </LinkContainer>
            </Col>
          ))}
        </Row>
        <Row>
          {searchResults.resources.map((resource) => (
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
                {(resource.filePath.endsWith(".pdf")) && (
                  <Card.Img
                    variant="top"
                    src={pdfThumbnail}
                    alt="PDF Thumbnail"
                    onClick={() => handleFileClick(resource.filePath)}
                    style={{ ...thumbnailStyle }}
                  />
                )}
                {(resource.filePath.endsWith(".avi")) && (
                  <Card.Img
                    variant="top"
                    src={videoThumbnail}
                    alt="Video Thumbnail"
                    onClick={() => handleFileClick(resource.filePath)}
                    style={{ ...thumbnailStyle }}
                  />
                )}
                <Card.Body>
                  <Card.Title as="div">
                    <strong>{resource.portionTitle}</strong>
                  </Card.Title>
                  <Card.Text as="div" className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      onClick={() => handleEditButtonClick(resource.filePath)}
                    >
                      View
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Modal show={selectedImage} onHide={handleCloseModal} centered>
        <Modal.Body>
          <Image src={selectedImage} alt="Selected" fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={subfolderHandler}>
            <Form.Group controlId="formFolderName">
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                value={subfolderName}
                onChange={(e) => setSubfolderName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  )
}

export default ResourceScreen
