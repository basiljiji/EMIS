import React, { useState, useEffect } from "react"
import { Table, Button, Modal, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import { LinkContainer } from "react-router-bootstrap"
import AdminLayout from "../components/AdminLayout"
import {
  useDeleteFolderMutation,
  useEditFolderAccessMutation,
  useGetAllFoldersQuery,
  useRenameFolderMutation,
} from "../slices/resourceAdminSlice"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"

const AdminFolderManagement = () => {
  const [showModal, setShowModal] = useState(false)

  const handleClose = () => {
    setShowModal(false)
  }

  const {
    data: allFolders,
    isLoading,
    refetch,
    error,
  } = useGetAllFoldersQuery()

  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()

  const [renameFolder] = useRenameFolderMutation()
  const [deleteFolder] = useDeleteFolderMutation()

  const [folders, setFolders] = useState([])
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [renameFolderName, setRenameFolderName] = useState("")
  const [selectedFolderId, setSelectedFolderId] = useState("")

  useEffect(() => {
    if (allFolders) {
      setFolders(allFolders)
    }
  }, [allFolders])

  const handleRename = (folderId, folderName) => {
    setSelectedFolderId(folderId)
    setRenameFolderName(folderName)
    setShowRenameModal(true)
  }

  const handleDelete = async (folderId) => {
    try {
      const result = await deleteFolder({
        folderId: folderId,
      })
      refetch()
      toast.success("Folder Deleted")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleRenameFolder = async () => {
    try {
      const result = await renameFolder({
        folderId: selectedFolderId,
        folderName: renameFolderName,
      })
      setShowRenameModal(false)
      refetch()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <AdminLayout>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SI No</th>
            <th>Folder Name</th>
            <th>Rename</th>
            <th>Access</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {allFolders &&
            allFolders.map((folder, index) => (
              <tr key={folder.id}>
                <td>{index + 1}</td>
                <td>{folder.folderName}</td>
                <td>
                  <Button
                    className="border-0"
                    onClick={() => handleRename(folder._id, folder.folderName)}
                  >
                    Rename
                  </Button>
                </td>
                <td>
                  <LinkContainer to={`/admin/folder/edit/${folder._id}`}>
                    <Button className="bg-warning border-0">Access</Button>
                  </LinkContainer>
                </td>
                <td>
                  <Button
                    className="bg-danger border-0"
                    onClick={() => handleDelete(folder._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

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
    </AdminLayout>
  )
}

export default AdminFolderManagement
