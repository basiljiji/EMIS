import React, { useState, useEffect } from "react"
import {
  Container,
  Col,
  Row,
  Table,
  Form,
  Button,
  Modal,
} from "react-bootstrap"
import { toast } from "react-toastify"
import {
  useAddSectionMutation,
  useDeleteSectionMutation,
  useEditSectionMutation,
  useGetSectionsQuery,
} from "../slices/sectionApiSlice"
import {
  useAddSubjectMutation,
  useDeleteSubjectMutation,
  useEditSubjectMutation,
  useGetSubjectsQuery,
} from "../slices/subjectApiSlice"
import {
  useAddClassMutation,
  useDeleteClassMutation,
  useEditClassMutation,
  useGetClassesQuery,
} from "../slices/classApiSlice"
import AdminLayout from "../components/AdminLayout"

const AdminDetailsScreen = () => {
  const [className, setClassName] = useState("")
  const [sectionName, setSectionName] = useState("")
  const [subjectName, setSubjectName] = useState("")

  const [classData, setClassData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const [subjectData, setSubjectData] = useState([])

  const [showClassModal, setShowClassModal] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [selectedClassName, setSelectedClassName] = useState("")

  const [showSectionModal, setShowSectionModal] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [selectedSectionName, setSelectedSectionName] = useState("")

  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  const [selectedSubjectName, setSelectedSubjectName] = useState("")

  const { data: sections, refetch: refetchSections } = useGetSectionsQuery()
  const { data: subjects, refetch: refetchSubjects } = useGetSubjectsQuery()
  const { data: classes, refetch: refetchClasses } = useGetClassesQuery()

  const [addClass] = useAddClassMutation()
  const [editClass] = useEditClassMutation()
  const [deleteClass] = useDeleteClassMutation()

  const [addSection] = useAddSectionMutation()
  const [editSection] = useEditSectionMutation()
  const [deleteSection] = useDeleteSectionMutation()

  const [addSubject] = useAddSubjectMutation()
  const [editSubject] = useEditSubjectMutation()
  const [deleteSubject] = useDeleteSubjectMutation()

  useEffect(() => {
    if (classes) setClassData(classes)
    if (sections) setSectionData(sections)
    if (subjects) setSubjectData(subjects)
  }, [classes, sections, subjects])

  const handleCloseClassModal = () => {
    setShowClassModal(false)
    setSelectedClassId(null)
    setSelectedClassName("")
  }
  const handleCloseSectionModal = () => {
    setShowSectionModal(false)
    setSelectedSectionId(null)
    setSelectedSectionName("")
  }
  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false)
    setSelectedSubjectId(null)
    setSelectedSubjectName("")
  }

  const handleEditClassModal = (classId, className) => {
    setSelectedClassId(classId)
    setSelectedClassName(className)
    setClassName(className)
    setShowClassModal(true)
  }

  const handleEditSectionModal = (sectionId, sectionName) => {
    setSelectedSectionId(sectionId)
    setSelectedSectionName(sectionName)
    setSectionName(sectionName)
    setShowSectionModal(true)
  }

  const handleEditSubjectModal = (subjectId, subjectName) => {
    setSelectedSubjectId(subjectId)
    setSelectedSubjectName(subjectName)
    setSubjectName(subjectName)
    setShowSubjectModal(true)
  }

  const addClassHandler = async (e) => {
    e.preventDefault()
    try {
      const result = await addClass({
        classDetail: className,
      })
      refetchClasses()
      toast.success("Success")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const addSectionHandler = async (e) => {
    e.preventDefault()
    try {
      const result = await addSection({
        section: sectionName,
      })
      refetchSections()
      toast.success("Success")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const addSubjectHandler = async (e) => {
    e.preventDefault()
    try {
      const result = await addSubject({
        subject: subjectName,
      })
      refetchSubjects()
      toast.success("Success")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleEditClass = async () => {
    try {
      await editClass({
        classId: selectedClassId,
        classDetail: className,
      })
      refetchClasses()
      toast.success("Class Updated")
      handleCloseClassModal()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleEditSection = async () => {
    try {
      await editSection({
        sectionId: selectedSectionId,
        section: sectionName,
      })
      refetchSections()
      toast.success("Section Updated")
      handleCloseSectionModal()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleEditSubject = async () => {
    try {
      await editSubject({
        subjectId: selectedSubjectId,
        subject: subjectName,
      })
      refetchSubjects()
      toast.success("Subject Updated")
      handleCloseSubjectModal()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteClassHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteClass(id)
        toast.success("Class Deleted")
        refetchClasses()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }
  const deleteSectionHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteSection(id)
        toast.success("Section Deleted")
        refetchSections()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  const deleteSubjectHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteSubject(id)
        toast.success("Subject Deleted")
        refetchSubjects()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <AdminLayout>
      <div>
        <Container>
          <Row>
            <Col md={4}>
              <h4>Add Class</h4>
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
              <Button className="mt-3" onClick={addClassHandler}>
                Add Class
              </Button>
            </Col>
            <Col>
              <h4>List Class</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Class Name</th>
                  </tr>
                </thead>
                <tbody>
                  {classData.map((classItem, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{classItem.class}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleEditClassModal(classItem._id, classItem.class)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => deleteClassHandler(classItem._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          <hr />
          <Row className="my-3">
            <Col md={4}>
              <h4>Add Section</h4>
              <Form.Label>Section Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Section Name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
              <Button className="mt-3" onClick={addSectionHandler}>
                Add Section
              </Button>
            </Col>
            <Col>
              <h4>List Section</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Section Name</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionData.map((sectionItem, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{sectionItem.section}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleEditSectionModal(
                              sectionItem._id,
                              sectionItem.section
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteSectionHandler(sectionItem._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          <hr />

          <Row>
            <Col md={4}>
              <h4>Add Subject</h4>
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
              <Button className="mt-3" onClick={addSubjectHandler}>
                Add Subject
              </Button>
            </Col>
            <Col>
              <h4>List Subject</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject Name</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectData.map((subjectItem, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{subjectItem.subject}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleEditSubjectModal(
                              subjectItem._id,
                              subjectItem.subject
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteSubjectHandler(subjectItem._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
        <Modal show={showClassModal} onHide={handleCloseClassModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseClassModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditClass}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSectionModal} onHide={handleCloseSectionModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Section</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Section Name</Form.Label>
            <Form.Control
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSectionModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSection}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSubjectModal} onHide={handleCloseSubjectModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Subject Name</Form.Label>
            <Form.Control
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSubjectModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSubject}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminDetailsScreen
