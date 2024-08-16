import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import {
  useDeleteResourceMutation,
  useDeleteSubfolderMutation,
  useGetSingleFolderDataQuery,
  useGetSubFoldersQuery,
  useRenameFolderMutation,
  useRenameFolderResourcesMutation,
  useRenameSubfolderMutation,
} from "../slices/resourceAdminSlice"
import {
  Table,
  Button,
  Breadcrumb,
  Container,
  Modal,
  Form,
} from "react-bootstrap"
import Loader from "../components/Loader"
import Message from "../components/Message"

const AdminResourceManagement = () => {
  const { id: folderName } = useParams()

  const [showModal, setShowModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showRenameResourceModal, setshowRenameResourceModal] = useState(false)
  const [renameFolderName, setRenameFolderName] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [renameResource, setRenameResource] = useState("")
  const [selectedResourceId, setSelectedResourceId] = useState("")

  const handleClose = () => {
    setShowModal(false)
  }

  const handleRename = (subfolderId, subfolderName) => {
    setSelectedFolderId(subfolderId)
    setRenameFolderName(subfolderName)
    setShowRenameModal(true)
  }

  const renameResourceHandler = (resourceId, resourceName) => {
    setSelectedResourceId(resourceId)
    setRenameResource(resourceName)
    setshowRenameResourceModal(true)
  }

  const {
    data: folderResources,
    isLoading,
    refetch,
    error,
  } = useGetSingleFolderDataQuery(folderName)

  const { data: subfolders, refetch: subfoldersRefetch } =
    useGetSubFoldersQuery(folderName)

  const [deleteResource] = useDeleteResourceMutation()
  const [renameFolderResource] = useRenameFolderResourcesMutation()
  const [deleteSubfolder] = useDeleteSubfolderMutation()
  const [renameSubfolder] = useRenameSubfolderMutation()

  const bytesToMB = (bytes) => {
    if (bytes === 0) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + " MB"
  }

  const deleteResourceHandler = async (resourceId) => {
    try {
      const result = await deleteResource({
        resourceId: resourceId,
        folderName,
      })
      refetch()
      toast.success("Resource Deleted")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteSubfolderHandler = async (subfolderId) => {
    try {
      const result = await deleteSubfolder({
        subfolderId: subfolderId,
      })
      subfoldersRefetch()
      toast.success("Folder Deleted")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleRenameFolder = async () => {
    try {
      const result = await renameSubfolder({
        subfolderId: selectedFolderId,
        subfolderName: renameFolderName,
      })
      setshowRenameResourceModal(false)
      subfoldersRefetch()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleRenameResource = async () => {
    try {
      const result = await renameFolderResource({
        folderName: folderName,
        resourceId: selectedResourceId,
        portionTitle: renameResource,
      })
      console.log(result,"ress")
      setShowRenameModal(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Container>
        <Breadcrumb>
          <LinkContainer to="/admin/folder">
            <Breadcrumb.Item>Access</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>Resources</Breadcrumb.Item>
        </Breadcrumb>
        {isLoading && <Loader />}
        {error && <Message></Message>}
        {folderResources && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render subfolders if they exist */}
              {subfolders &&
                subfolders.length > 0 &&
                subfolders.map((subfolder) => (
                  <tr key={subfolder._id}>
                    <td>{subfolder.folderTitle}</td>
                    <td>Subfolder</td>
                    <td>-</td> {/* No size for folders */}
                    <td>
                      <LinkContainer
                        to={`/admin/folder/${folderName}/${subfolder.subfolderName}`}
                      >
                        <Button variant="success" className="me-2">
                          Manage
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={() =>
                          handleRename(subfolder._id, subfolder.folderTitle)
                        }
                      >
                        Rename
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteSubfolderHandler(subfolder._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              {/* Render resources if they exist */}
              {folderResources.resources &&
                folderResources.resources.length > 0 &&
                folderResources.resources.map((resource) => (
                  <tr key={resource._id}>
                    <td>{resource.portionTitle}</td>
                    <td>{resource.fileType}</td>
                    <td>{bytesToMB(resource.fileSize)}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => renameResourceHandler(resource._id, resource.portionTitle)}
                      >
                        Rename
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteResourceHandler(resource._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Container>
      {/* Rename Folder Modal */}
      <Modal show={showRenameResourceModal} onHide={() => setShowRenameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={renameResource}
            onChange={(e) => setRenameResource(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setshowRenameResourceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRenameResource}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Rename Folder Modal */}
      <Modal show={showRenameModal} onHide={() => setShowRenameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={renameFolderName}
            onChange={(e) => setRenameFolderName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRenameModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRenameFolder}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminResourceManagement
