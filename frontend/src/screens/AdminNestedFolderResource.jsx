import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import {
    useDeleteNestedSubfolderMutation,
    useDeleteNestedSubfolderResourceMutation,
    useDeleteSubfolderResourceMutation,
    useGetSingleNestedSubfolderDataQuery,
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

const AdminNestedFolderResource = () => {

    const { id: folderName } = useParams()
    const { sid: subfolderName } = useParams()
    const { nid: nestedSubfolderName } = useParams()

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


    //Nested Folder
    const { data: nestedSubfolderResources, refetch, isLoading, error } =
        useGetSingleNestedSubfolderDataQuery({ folderName, subfolderName, nestedSubfolderName })

    console.log(nestedSubfolderResources, "123")

    const [deleteNestedfolderResource] = useDeleteNestedSubfolderResourceMutation()
    const [renameNestedFolderResource] = useRenameNestedSubfolderResourcesMutation()

    const bytesToMB = (bytes) => {
        if (bytes === 0) return "0 MB"
        const mb = bytes / (1024 * 1024)
        return mb.toFixed(2) + " MB"
    }

    const deleteResourceHandler = async (resourceId) => {
        try {
            const result = await deleteNestedfolderResource({
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




    const handleRenameResource = async () => {
        try {
            console.log(selectedResourceId, "ress")
            const result = await renameNestedFolderResource({
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
              {nestedSubfolderResources && (
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
                         
                          {/* Render resources if they exist */}
                          {nestedSubfolderResources.resources &&
                              nestedSubfolderResources.resources.length > 0 &&
                              nestedSubfolderResources.resources.map((resource) => (
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

export default AdminNestedFolderResource