import React, { useState } from "react"
import { Row, Col, Button, Form, Container, Modal } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { toast } from "react-toastify"
import AdminLayout from "../components/AdminLayout"
import { FaFolder } from "react-icons/fa"
import {
  useAddFolderMutation,
  useGetAllFoldersQuery,
} from "../slices/resourceAdminSlice"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"
import Message from "../components/Message"
import Loader from "../components/Loader"

const AdminResourceScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [selectedSections, setSelectedSections] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])

  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()

  const [addFolder] = useAddFolderMutation()
  const {
    data: allFolders,
    isLoading,
    refetch,
    error,
  } = useGetAllFoldersQuery()

  const handleClassToggle = (classId) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(classId)
        ? prevSelected.filter((id) => id !== classId)
        : [...prevSelected, classId]
    )
  }

  const handleSectionToggle = (sectionId) => {
    setSelectedSections((prevSelected) =>
      prevSelected.includes(sectionId)
        ? prevSelected.filter((id) => id !== sectionId)
        : [...prevSelected, sectionId]
    )
  }

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prevSelected) =>
      prevSelected.includes(subjectId)
        ? prevSelected.filter((id) => id !== subjectId)
        : [...prevSelected, subjectId]
    )
  }

  const isSectionChecked = (sectionId) => selectedSections.includes(sectionId)
  const isSubjectChecked = (subjectId) => selectedSubjects.includes(subjectId)
  const isClassChecked = (classId) => selectedClasses.includes(classId)

  const folderHandler = async () => {
    try {
      const checkedClasses = selectedClasses.filter((classId) =>
        isClassChecked(classId)
      )
      const checkedSections = selectedSections.filter((sectionId) =>
        isSectionChecked(sectionId)
      )
      const checkedSubjects = selectedSubjects.filter((subjectId) =>
        isSubjectChecked(subjectId)
      )

      const res = await addFolder({
        folderName,
        classdata: checkedClasses,
        sectiondata: checkedSections,
        subjectdata: checkedSubjects,
      }).unwrap()
      refetch()
      setFolderName("") // Use setFolderName to update state
      toast.success("Folder Created")
      setShowModal(false)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <AdminLayout>
      <Container className="py-3 justify-content-between ">
        <Row className="justify-content-between">
          <Col xs="auto">
            <h5>Admin Resource Screen</h5>
          </Col>
          <Col xs="auto">
            <Button onClick={() => setShowModal(true)}>New Folder</Button>
          </Col>
        </Row>
        <Row>
          <h3>List Folders</h3>
          {isLoading ? (
            <p>
              <Loader />
            </p>
          ) : error ? (
            <p>
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            </p>
          ) : (
            <Row xs={3} md={6} lg={8} className="g-4">
              {allFolders.map((folder) => (
                <Col key={folder.id}>
                  <LinkContainer to={`/admin/resource/${folder.folderName}`}>
                    <Col xs="auto" className="text-center">
                      <FaFolder
                        style={{
                          width: "80px",
                          height: "80px",
                          color: "gold",
                        }}
                      />
                      <p>{folder.folderName}</p>
                    </Col>
                  </LinkContainer>
                </Col>
              ))}
            </Row>
          )}
        </Row>
      </Container>

      {/* Modal for adding a new folder */}
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
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            autoFocus
          />
          <Row>
            <Col md={4}>
              <h4 className="mt-3">Access To</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Classes:</h5>
              {classes &&
                classes.map((classItem) => (
                  <Form.Check
                    key={classItem._id}
                    type="checkbox"
                    label={classItem.class}
                    checked={isClassChecked(classItem._id)}
                    onChange={() => handleClassToggle(classItem._id)}
                    style={{
                      color: isClassChecked(classItem._id)
                        ? "green"
                        : "inherit",
                    }}
                  />
                ))}
            </Col>
            <Col>
              <h5>Sections:</h5>
              {sections &&
                sections.map((section) => (
                  <Form.Check
                    key={section.id}
                    type="checkbox"
                    label={section.section}
                    checked={isSectionChecked(section._id)}
                    onChange={() => handleSectionToggle(section._id)}
                    style={{
                      color: isSectionChecked(section._id)
                        ? "green"
                        : "inherit",
                    }}
                  />
                ))}
            </Col>
            <Col>
              <h5>Subjects:</h5>
              {subjects &&
                subjects.map((subject) => (
                  <Form.Check
                    key={subject._id}
                    type="checkbox"
                    label={subject.subject}
                    checked={isSubjectChecked(subject._id)}
                    onChange={() => handleSubjectToggle(subject._id)}
                    style={{
                      color: isSubjectChecked(subject._id)
                        ? "green"
                        : "inherit",
                    }}
                  />
                ))}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={folderHandler}>
            Save Folder
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  )
}

export default AdminResourceScreen
