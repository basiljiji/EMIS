import React, { useState, useEffect } from "react"
import { Table, Button, Modal, Form } from "react-bootstrap"
import { toast } from "react-toastify"
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
  const [classCheckboxes, setClassCheckboxes] = useState([])
  const [sectionCheckboxes, setSectionCheckboxes] = useState([])
  const [subjectCheckboxes, setSubjectCheckboxes] = useState([])

  const handleAccess = (folder) => {
    // Logic to set initial checkbox state based on folder.accessTo
    setClassCheckboxes(
      classes.map((cls) => folder.accessTo.classAccess.includes(cls._id))
    )
    setSectionCheckboxes(
      sections.map((section) =>
        folder.accessTo.sectionAccess.includes(section._id)
      )
    )
    setSubjectCheckboxes(
      subjects.map((subject) =>
        folder.accessTo.subjectAccess.includes(subject._id)
      )
    )

    setShowModal(true)
  }

  const handleCheckboxChange = (index, type) => {
    if (type === "class") {
      const newClassCheckboxes = [...classCheckboxes]
      newClassCheckboxes[index] = !newClassCheckboxes[index]
      setClassCheckboxes(newClassCheckboxes)
    } else if (type === "section") {
      const newSectionCheckboxes = [...sectionCheckboxes]
      newSectionCheckboxes[index] = !newSectionCheckboxes[index]
      setSectionCheckboxes(newSectionCheckboxes)
    } else if (type === "subject") {
      const newSubjectCheckboxes = [...subjectCheckboxes]
      newSubjectCheckboxes[index] = !newSubjectCheckboxes[index]
      setSubjectCheckboxes(newSubjectCheckboxes)
    }
  }
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

  const [editFolderAccess] = useEditFolderAccessMutation()
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
                  <Button
                    className="bg-warning border-0"
                    onClick={() => handleAccess(folder)}
                  >
                    Access
                  </Button>
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

      {/*Access Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Access</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              <>
                {allFolders &&
                  allFolders.map((folder, index) => (
                    <tr key={folder.id}>
                      <td>
                        {classes && (
                          <>
                            {classes.map((cls, idx) => (
                              <div key={cls._id}>
                                <input
                                  type="checkbox"
                                  checked={classCheckboxes[index]}
                                  onChange={() =>
                                    handleCheckboxChange(index, "class")
                                  }
                                />
                                {cls.class}
                              </div>
                            ))}
                          </>
                        )}
                      </td>
                      <td>
                        {sections && (
                          <>
                            {sections.map((sec, idx) => (
                              <div key={sec._id}>
                                <input
                                  type="checkbox"
                                  checked={sectionCheckboxes[index]}
                                  onChange={() =>
                                    handleCheckboxChange(index, "section")
                                  }
                                />
                                {sec.section}
                              </div>
                            ))}
                          </>
                        )}
                      </td>
                      <td>
                        {subjects && (
                          <>
                            {subjects.map((sub, idx) => (
                              <div key={sub._id}>
                                <input
                                  type="checkbox"
                                  checked={subjectCheckboxes[index]}
                                  onChange={() =>
                                    handleCheckboxChange(index, "subject")
                                  }
                                />
                                {sub.subject}
                              </div>
                            ))}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* Add more buttons if needed */}
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default AdminFolderManagement
