import React, { useState, useEffect } from "react"
import { Row, Col, Button, Form, Container, Modal } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead"
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
import { useGetTeachersQuery } from "../slices/teacherApiSlice"

const AdminResourceScreen = () => {
  const [showModal, setShowModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [selectedSections, setSelectedSections] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [selectedFolder, setSelectedFolder] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFolders, setFilteredFolders] = useState([])

  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()
  const { data: teachers } = useGetTeachersQuery()
  const [addFolder] = useAddFolderMutation()
  const {
    data: allFolders,
    isLoading,
    refetch,
    error,
  } = useGetAllFoldersQuery()

  useEffect(() => {
    if (allFolders) {
      setFilteredFolders(
        allFolders.filter((folder) =>
          folder.folderTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery, allFolders])

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

  const handleTeacherToggle = (teacherId) => {
    setSelectedTeachers((prevSelected) =>
      prevSelected.includes(teacherId)
        ? prevSelected.filter((id) => id !== teacherId)
        : [...prevSelected, teacherId]
    )
  }

  const isSectionChecked = (sectionId) => selectedSections.includes(sectionId)
  const isSubjectChecked = (subjectId) => selectedSubjects.includes(subjectId)
  const isClassChecked = (classId) => selectedClasses.includes(classId)
  const isTeacherChecked = (teacherId) => selectedTeachers.includes(teacherId)

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
      const checkedTeachers = selectedTeachers.filter((teacherId) =>
        isTeacherChecked(teacherId)
      )
      const res = await addFolder({
        folderName,
        classdata: checkedClasses,
        sectiondata: checkedSections,
        subjectdata: checkedSubjects,
        teacherdata: checkedTeachers,
      }).unwrap()
      refetch()
      setFolderName("")
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
          <Col>
            <h3>List Folders</h3>
          </Col>
          <Col className="text-end">
            <Button onClick={() => setShowModal(true)}>New Folder</Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Typeahead
              id="folder-search"
              labelKey="folderTitle"
              onChange={setSelectedFolder}
              options={filteredFolders}
              placeholder="Search for a folder..."
              selected={selectedFolder}
              onInputChange={(input) => setSearchQuery(input)}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p>
              <Message variant="danger">
                {error?.data?.message || error.error}
              </Message>
            </p>
          ) : (
            <Row xs={3} md={6} lg={8} className="g-4">
              {allFolders
                .filter((folder) =>
                  folder.folderTitle.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((folder) => (
                  <Col key={folder.id}>
                    <LinkContainer to={`/admin/resource/${folder.folderName}`}>
                      <Col xs="auto" className="text-center">
                        <FaFolder
                          style={{
                            width: "80px",
                            height: "80px",
                            color: "white",
                          }}
                        />
                        <p className="fw-bold">{folder.folderTitle}</p>
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
            <Col>
              <h5>Teachers:</h5>
              {teachers &&
                teachers.map((teacher) => (
                  <Form.Check
                    key={teacher._id}
                    type="checkbox"
                    label={teacher.firstName + " " + teacher.lastName}
                    checked={isTeacherChecked(teacher._id)}
                    onChange={() => handleTeacherToggle(teacher._id)}
                    style={{
                      color: isTeacherChecked(teacher._id)
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
