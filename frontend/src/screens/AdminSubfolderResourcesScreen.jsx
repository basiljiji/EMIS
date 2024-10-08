import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import {
  useDeleteNestedSubfolderMutation,
  useDeleteNestedSubfolderResourceMutation,
  useDeleteResourceMutation,
  useDeleteSubfolderMutation,
  useDeleteSubfolderResourceMutation,
  useGetSingleFolderDataQuery,
  useGetSingleNestedSubfoldersQuery,
  useGetSingleSubfolderDataQuery,
  useGetSubFoldersQuery,
  useRenameNestedSubfolderMutation,
  useRenameNestedSubfolderResourcesMutation,
  useRenameSubfolderMutation,
  useRenameSubfolderResourcesMutation,
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

const AdminSubfolderResourcesScreen = () => {
  const { id: folderName } = useParams()
  const { sid: subfolderName } = useParams()

  const [showModal, setShowModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameFolderName, setRenameFolderName] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState("")
  const [renameResource, setRenameResource] = useState("")
  const [selectedResourceId, setSelectedResourceId] = useState("")

  const [showRenameResourceModal, setshowRenameResourceModal] = useState(false)
  
  
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
    data: subfolderResources,
    isLoading,
    refetch,
    error,
  } = useGetSingleSubfolderDataQuery({ folderName, subfolderName })


  const [deleteSubfolderResource] = useDeleteSubfolderResourceMutation()
  const [renameSubfolderResource] = useRenameSubfolderResourcesMutation()

  //Nested Folder
  const { data: nestedSubfolders, refetch: nestedSubfoldersRefetch } =
    useGetSingleNestedSubfoldersQuery({ folderName, subfolderName })

    console.log(nestedSubfolders,"123")

  // const [deleteNestedfolderResource] = useDeleteNestedSubfolderResourceMutation()
  // const [renameNestedFolderResource] = useRenameNestedSubfolderResourcesMutation()
  const [deleteNestedSubfolder] = useDeleteNestedSubfolderMutation()
  const [renameNestedSubfolder] = useRenameNestedSubfolderMutation()

  const bytesToMB = (bytes) => {
    if (bytes === 0) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + " MB"
  }

  const deleteResourceHandler = async (resourceId) => {
    try {
      const result = await deleteSubfolderResource({
        resourceId: resourceId,
        folderName,
        subfolderName,
      })
      refetch()
      toast.success("Resource Deleted")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }


  const deleteNestedSubfolderHandler = async (subfolderId) => {
    try {
      const result = await deleteNestedSubfolder({
        subfolderId: subfolderId,
      })
      nestedSubfoldersRefetch()
      toast.success("Folder Deleted")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }



  const handleRenameResource = async () => {
    try {
      console.log(selectedResourceId, "ress")
      const result = await renameSubfolderResource({
        folderName: folderName,
        subfolderName: subfolderName,
        resourceId: selectedResourceId,
        portionTitle: renameResource,
      })
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
        {subfolderResources && (
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
              {(nestedSubfolders?.nestedSubfolders || []).map((nestedSubfolder) => (
                  <tr key={nestedSubfolder._id}>
                    <td>{nestedSubfolder.folderTitle}</td>
                    <td>Nested SubFolder</td>
                    <td>-</td> {/* No size for folders */}
                    <td>
                      <LinkContainer
                      to={`/admin/folder/${folderName}/${subfolderName}/${nestedSubfolder.nestedSubfolderName}`}
                      >
                        <Button variant="success" className="me-2">
                          Manage
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={() =>
                          handleRename(nestedSubfolder._id, nestedSubfolder.folderTitle)
                        }
                      >
                        Rename
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteNestedSubfolderHandler(nestedSubfolder._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              {/* Render resources if they exist */}
              {subfolderResources.resources &&
                subfolderResources.resources.length > 0 &&
                subfolderResources.resources.map((resource) => (
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
          <Modal.Title>Rename</Modal.Title>
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
          <Button variant="primary" onClick={handleRenameResource}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminSubfolderResourcesScreen
