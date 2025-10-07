import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  Modal,
  Tabs,
  Tab,
} from "react-bootstrap"
import InputGroup from "react-bootstrap/InputGroup"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import DataTable from "react-data-table-component"
import Swal from "sweetalert2"
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
  useGetTeachersQuery,
  useAddTeacherMutation,
  useDeleteTeacherMutation,
} from "../slices/teacherApiSlice"
import {
  useAddClassMutation,
  useDeleteClassMutation,
  useEditClassMutation,
  useGetClassesQuery,
} from "../slices/classApiSlice"
import AdminLayout from "../components/AdminLayout"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { LinkContainer } from "react-router-bootstrap"

const AdminDetailsScreen = () => {
  const [className, setClassName] = useState("")
  const [sectionName, setSectionName] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [teacherFirstName, setTeacherFirstName] = useState("")
  const [teacherMiddleName, setTeacherMiddleName] = useState("")
  const [teacherLastName, setTeacherLastName] = useState("")
  const [teacherEmail, setTeacherEmail] = useState("")
  const [teacherPassword, setTeacherPassword] = useState("")
  const [teacherConfirmPassword, setTeacherConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [classData, setClassData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const [subjectData, setSubjectData] = useState([])
  const [teacherData, setTeacherData] = useState([])

  const [activeKey, setActiveKey] = useState("teachers")
  const [classSearch, setClassSearch] = useState("")
  const [sectionSearch, setSectionSearch] = useState("")
  const [subjectSearch, setSubjectSearch] = useState("")
  const [teacherSearch, setTeacherSearch] = useState("")

  // pagination states for serial numbers across pages
  const [teachersPage, setTeachersPage] = useState(1)
  const [teachersPerPage, setTeachersPerPage] = useState(10)
  const [classesPage, setClassesPage] = useState(1)
  const [classesPerPage, setClassesPerPage] = useState(10)
  const [sectionsPage, setSectionsPage] = useState(1)
  const [sectionsPerPage, setSectionsPerPage] = useState(10)
  const [subjectsPage, setSubjectsPage] = useState(1)
  const [subjectsPerPage, setSubjectsPerPage] = useState(10)

  const [showClassModal, setShowClassModal] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState(null)
  // removed unused selectedClassName

  const [showSectionModal, setShowSectionModal] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  // removed unused selectedSectionName

  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)
  // removed unused selectedSubjectName

  const {
    data: sections,
    refetch: refetchSections,
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useGetSectionsQuery()

  const {
    data: subjects,
    refetch: refetchSubjects,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useGetSubjectsQuery()

  const {
    data: classes,
    refetch: refetchClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClassesQuery()

  const { data: teachers, refetch: refetchTeachers, isLoading: teachersLoading, error: teachersError } = useGetTeachersQuery()

  const [addTeacher] = useAddTeacherMutation()
  const [deleteTeacher] = useDeleteTeacherMutation()

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
    if (teachers) setTeacherData(teachers)
  }, [classes, sections, subjects, teachers])

  const filteredClasses = useMemo(() => {
    const term = classSearch.trim().toLowerCase()
    if (!term) return classData
    return classData.filter((c) => (c?.class || "").toLowerCase().includes(term))
  }, [classData, classSearch])

  const filteredSections = useMemo(() => {
    const term = sectionSearch.trim().toLowerCase()
    if (!term) return sectionData
    return sectionData.filter((s) => (s?.section || "").toLowerCase().includes(term))
  }, [sectionData, sectionSearch])

  const filteredSubjects = useMemo(() => {
    const term = subjectSearch.trim().toLowerCase()
    if (!term) return subjectData
    return subjectData.filter((s) => (s?.subject || "").toLowerCase().includes(term))
  }, [subjectData, subjectSearch])

  const filteredTeachers = useMemo(() => {
    const term = teacherSearch.trim().toLowerCase()
    if (!term) return teacherData
    return teacherData.filter((t) => (
      `${t?.firstName || ''} ${t?.lastName || ''} ${t?.email || ''}`.toLowerCase().includes(term)
    ))
  }, [teacherData, teacherSearch])

  // Define destructive handlers early so columns can reference them
  const deleteClassHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Delete class?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    try {
      await deleteClass(id)
      toast.success("Class Deleted")
      refetchClasses()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }, [deleteClass, refetchClasses])

  const deleteSectionHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Delete section?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    try {
      await deleteSection(id)
      toast.success("Section Deleted")
      refetchSections()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }, [deleteSection, refetchSections])

  const deleteSubjectHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Delete subject?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    try {
      await deleteSubject(id)
      toast.success("Subject Deleted")
      refetchSubjects()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }, [deleteSubject, refetchSubjects])

  const deleteTeacherHandler = useCallback(async (id) => {
    const result = await Swal.fire({
      title: "Delete teacher?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    try {
      await deleteTeacher(id)
      toast.success("Teacher Data Deleted")
      refetchTeachers()
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }, [deleteTeacher, refetchTeachers])

  // move columns below to after handlers to satisfy lint; temporary placeholder
  // define placeholders (will be redefined after handlers)
  let classColumns = []
  let sectionColumns = []
  let subjectColumns = []

  const handleCloseClassModal = () => {
    setShowClassModal(false)
    setSelectedClassId(null)
  }
  const handleCloseSectionModal = () => {
    setShowSectionModal(false)
    setSelectedSectionId(null)
  }
  const handleCloseSubjectModal = () => {
    setShowSubjectModal(false)
    setSelectedSubjectId(null)
  }

  const handleEditClassModal = useCallback((classId, className) => {
    setSelectedClassId(classId)
    setClassName(className)
    setShowClassModal(true)
  }, [])

  const handleEditSectionModal = useCallback((sectionId, sectionName) => {
    setSelectedSectionId(sectionId)
    setSectionName(sectionName)
    setShowSectionModal(true)
  }, [])

  const handleEditSubjectModal = useCallback((subjectId, subjectName) => {
    setSelectedSubjectId(subjectId)
    setSubjectName(subjectName)
    setShowSubjectModal(true)
  }, [])

  // Re-define columns after stable handlers to satisfy lint rules
  const classIndexOffset = useMemo(() => (classesPage - 1) * classesPerPage, [classesPage, classesPerPage])
  classColumns = useMemo(
    () => [
      {
        name: "#",
        width: "64px",
        cell: (_row, index) => classIndexOffset + index + 1,
      },
      {
        name: "Class Name",
        selector: (row) => row.class,
        sortable: true,
        wrap: true,
      },
      {
        name: "Actions",
        width: "220px",
        cell: (row) => (
          <div>
            <Button
              className="me-2"
              size="sm"
              variant="primary"
              onClick={() => handleEditClassModal(row._id, row.class)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteClassHandler && deleteClassHandler(row._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEditClassModal, deleteClassHandler, classIndexOffset]
  )

  const teacherColumns = useMemo(
    () => [
      {
        name: "#",
        width: "64px",
        cell: (_row, index) => ((teachersPage - 1) * teachersPerPage) + index + 1,
      },
      {
        name: "Name",
        selector: (row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
        sortable: true,
        wrap: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
        wrap: true,
      },
      {
        name: "Actions",
        width: "220px",
        cell: (row) => (
          <div>
            <LinkContainer to={`/teacher/edit/${row._id}`} className="me-2">
              <Button size="sm" variant="primary">Edit</Button>
            </LinkContainer>
            <Button size="sm" variant="danger" onClick={() => deleteTeacherHandler(row._id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteTeacherHandler, teachersPage, teachersPerPage]
  )

  const sectionIndexOffset = useMemo(() => (sectionsPage - 1) * sectionsPerPage, [sectionsPage, sectionsPerPage])
  sectionColumns = useMemo(
    () => [
      {
        name: "#",
        width: "64px",
        cell: (_row, index) => sectionIndexOffset + index + 1,
      },
      {
        name: "Section Name",
        selector: (row) => row.section,
        sortable: true,
        wrap: true,
      },
      {
        name: "Actions",
        width: "220px",
        cell: (row) => (
          <div>
            <Button
              className="me-2"
              size="sm"
              variant="primary"
              onClick={() => handleEditSectionModal(row._id, row.section)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteSectionHandler && deleteSectionHandler(row._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEditSectionModal, deleteSectionHandler, sectionIndexOffset]
  )

  const subjectIndexOffset = useMemo(() => (subjectsPage - 1) * subjectsPerPage, [subjectsPage, subjectsPerPage])
  subjectColumns = useMemo(
    () => [
      {
        name: "#",
        width: "64px",
        cell: (_row, index) => subjectIndexOffset + index + 1,
      },
      {
        name: "Subject Name",
        selector: (row) => row.subject,
        sortable: true,
        wrap: true,
      },
      {
        name: "Actions",
        width: "220px",
        cell: (row) => (
          <div>
            <Button
              className="me-2"
              size="sm"
              variant="primary"
              onClick={() => handleEditSubjectModal(row._id, row.subject)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => deleteSubjectHandler && deleteSubjectHandler(row._id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [handleEditSubjectModal, deleteSubjectHandler, subjectIndexOffset]
  )

  const addClassHandler = async (e) => {
    e.preventDefault()
    try {
      await addClass({
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
      await addSection({
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
      await addSubject({
        subject: subjectName,
      })
      refetchSubjects()
      toast.success("Success")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const submitTeacherHandler = async (e) => {
    e.preventDefault()
    try {
      if (teacherFirstName && teacherLastName && teacherEmail && teacherPassword && teacherConfirmPassword) {
        if (teacherPassword !== teacherConfirmPassword) {
          toast.error("Password and Confirm Password do not match")
        } else {
          const result = await addTeacher({
            firstName: teacherFirstName,
            middleName: teacherMiddleName,
            lastName: teacherLastName,
            email: teacherEmail,
            password: teacherPassword,
          })
          refetchTeachers()
          setTeacherFirstName("")
          setTeacherMiddleName("")
          setTeacherLastName("")
          setTeacherEmail("")
          setTeacherPassword("")
          setTeacherConfirmPassword("")
          if (result && result.data && result.data.message) {
            toast.success(result.data.message)
          } else {
            toast.success("Teacher created")
          }
        }
      } else {
        toast.error("Please Select All Fields")
      }
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

  // (handlers defined above)

  return (
    <AdminLayout>
      <div>
        <Container className="py-3">
          <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k || "teachers")} variant="pills" className="small">
            <Tab eventKey="teachers" title="Teachers">
              <Row className="my-2">
                <Form>
                  <Row>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">First Name *</Form.Label>
                        <Form.Control size="sm" type="text" placeholder="First Name" value={teacherFirstName} onChange={(e) => setTeacherFirstName(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">Middle Name</Form.Label>
                        <Form.Control size="sm" type="text" placeholder="Middle Name" value={teacherMiddleName} onChange={(e) => setTeacherMiddleName(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">Last Name *</Form.Label>
                        <Form.Control size="sm" type="text" placeholder="Last Name" value={teacherLastName} onChange={(e) => setTeacherLastName(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">Email *</Form.Label>
                        <Form.Control size="sm" type="text" placeholder="name@example.com" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">Password *</Form.Label>
                        <InputGroup size="sm">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            value={teacherPassword}
                            onChange={(e) => setTeacherPassword(e.target.value)}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowPassword((s) => !s)}
                          >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-2">
                        <Form.Label className="visually-hidden">Confirm Password *</Form.Label>
                        <InputGroup size="sm">
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={teacherConfirmPassword}
                            onChange={(e) => setTeacherConfirmPassword(e.target.value)}
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                          >
                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Row md={5} className="justify-content-end pe-0">
                      <Button size="sm" variant="outline-success" onClick={(e) => submitTeacherHandler(e)}>
                        Add Teacher
                      </Button>
                    </Row>
                  </Row>
                </Form>
              </Row>
              <Row className="mt-3">
                {teachersLoading ? (
                  <Loader />
                ) : teachersError ? (
                  <Message>{teachersError?.data?.message || teachersError.error}</Message>
                ) : (
                  <DataTable
                    columns={teacherColumns}
                    data={filteredTeachers}
                    pagination
                    onChangePage={(p) => setTeachersPage(p)}
                    onChangeRowsPerPage={(newPerPage, page) => { setTeachersPerPage(newPerPage); setTeachersPage(page) }}
                    highlightOnHover
                    dense
                    persistTableHead
                    subHeader
                    subHeaderComponent={
                      <div className="w-100">
                        <Form.Control
                          className="bg-white no-search-decoration"
                          size="sm"
                          type="text"
                          placeholder="Search teachers..."
                          value={teacherSearch}
                          onChange={(e) => setTeacherSearch(e.target.value)}
                        />
                      </div>
                    }
                  />
                )}
              </Row>
            </Tab>
            <Tab eventKey="classes" title="Classes">
              <Row className="my-2 align-items-end">
                <Col md={4}>
                  <Form.Label className="visually-hidden">New Class</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button size="sm" variant="outline-success" className="w-100" onClick={addClassHandler}>
                    Add Class
                  </Button>
                </Col>
                <Col md={6} className="mt-3 mt-md-0"></Col>
              </Row>
              {classesLoading ? (
                <Loader />
              ) : classesError ? (
                <Message variant="danger">
                  {classesError?.data?.message || classesError.error}
                </Message>
              ) : (
                <DataTable
                  columns={classColumns}
                  data={filteredClasses}
                  pagination
                  onChangePage={(p) => setClassesPage(p)}
                  onChangeRowsPerPage={(newPerPage, page) => { setClassesPerPage(newPerPage); setClassesPage(page) }}
                  highlightOnHover
                  dense
                  persistTableHead
                  subHeader
                  subHeaderComponent={
                    <div className="w-100">
                      <Form.Control
                        className="bg-white no-search-decoration"
                        size="sm"
                        type="text"
                        placeholder="Search classes..."
                        value={classSearch}
                        onChange={(e) => setClassSearch(e.target.value)}
                      />
                    </div>
                  }
                />
              )}
            </Tab>
            <Tab eventKey="sections" title="Sections">
              <Row className="my-2 align-items-end">
                <Col md={4}>
                  <Form.Label className="visually-hidden">New Section</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter section name"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button size="sm" variant="outline-success" className="w-100" onClick={addSectionHandler}>
                    Add Section
                  </Button>
                </Col>
                <Col md={6} className="mt-3 mt-md-0"></Col>
              </Row>
              {sectionsLoading ? (
                <Loader />
              ) : sectionsError ? (
                <Message variant="danger">
                  {sectionsError?.data?.message || sectionsError.error}
                </Message>
              ) : (
                <DataTable
                  columns={sectionColumns}
                  data={filteredSections}
                  pagination
                  onChangePage={(p) => setSectionsPage(p)}
                  onChangeRowsPerPage={(newPerPage, page) => { setSectionsPerPage(newPerPage); setSectionsPage(page) }}
                  highlightOnHover
                  dense
                  persistTableHead
                  subHeader
                  subHeaderComponent={
                    <div className="w-100">
                      <Form.Control
                        className="bg-white no-search-decoration"
                        size="sm"
                        type="text"
                        placeholder="Search sections..."
                        value={sectionSearch}
                        onChange={(e) => setSectionSearch(e.target.value)}
                      />
                    </div>
                  }
                />
              )}
            </Tab>
            <Tab eventKey="subjects" title="Subjects">
              <Row className="my-2 align-items-end">
                <Col md={4}>
                  <Form.Label className="visually-hidden">New Subject</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter subject name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button size="sm" variant="outline-success" className="w-100" onClick={addSubjectHandler}>
                    Add Subject
                  </Button>
                </Col>
                <Col md={6} className="mt-3 mt-md-0"></Col>
              </Row>
              {subjectsLoading ? (
                <Loader />
              ) : subjectsError ? (
                <Message variant="danger">
                  {subjectsError?.data?.message || subjectsError.error}
                </Message>
              ) : (
                <DataTable
                  columns={subjectColumns}
                  data={filteredSubjects}
                  pagination
                  onChangePage={(p) => setSubjectsPage(p)}
                  onChangeRowsPerPage={(newPerPage, page) => { setSubjectsPerPage(newPerPage); setSubjectsPage(page) }}
                  highlightOnHover
                  dense
                  persistTableHead
                  subHeader
                  subHeaderComponent={
                    <div className="w-100">
                      <Form.Control
                        className="bg-white no-search-decoration"
                        size="sm"
                        type="text"
                        placeholder="Search subjects..."
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                      />
                    </div>
                  }
                />
              )}
            </Tab>
          </Tabs>
        </Container>
        <Modal show={showClassModal} onHide={handleCloseClassModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Class</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              size="sm"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={handleCloseClassModal}>
              Close
            </Button>
            <Button size="sm" variant="primary" onClick={handleEditClass}>
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
              size="sm"
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={handleCloseSectionModal}>
              Close
            </Button>
            <Button size="sm" variant="primary" onClick={handleEditSection}>
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
              size="sm"
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={handleCloseSubjectModal}>
              Close
            </Button>
            <Button size="sm" variant="primary" onClick={handleEditSubject}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminDetailsScreen
