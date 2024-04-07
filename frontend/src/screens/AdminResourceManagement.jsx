import React from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import {
  useDeleteResourceMutation,
  useGetResourceByFolderQuery,
  useGetSingleFolderDataQuery,
  useGetSubFoldersQuery,
} from "../slices/resourceAdminSlice"
import { Table, Button, Breadcrumb, Container } from "react-bootstrap"
import Loader from "../components/Loader"
import Message from "../components/Message"

const AdminResourceManagement = () => {
  const { id: folderName } = useParams()

  const {
    data: folderResources,
    isLoading,
    refetch,
    error,
  } = useGetSingleFolderDataQuery(folderName)

  const { data: subfolders } = useGetSubFoldersQuery(folderName)

  const [deleteResource] = useDeleteResourceMutation()

  const bytesToMB = (bytes) => {
    if (bytes === 0) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(2) + " MB"
  }

  const deleteResourceHandler = async (resourceId) => {
    try {
      const result = await deleteResource({
        resourceId: resourceId,
      })
      refetch()
      toast.success("Resource Deleted")
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
                    <td>{subfolder.subfolderName}</td>
                    <td>Subfolder</td>
                    <td></td> {/* No size for folders */}
                    <td>
                      <Button variant="success" className="me-2">Manage</Button>
                      <Button variant="danger">Delete</Button>
                    </td>
                  </tr>
                ))}
              {/* Render resources if they exist */}
              {folderResources.resources &&
                folderResources.resources.length > 0 &&
                folderResources.resources.map((resource) => (
                  <tr key={resource._id}>
                    <td>{resource.fileName}</td>
                    <td>{resource.fileType}</td>
                    <td>{bytesToMB(resource.fileSize)}</td>
                    <td>
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
    </>
  )
}

export default AdminResourceManagement
