import React, { useState } from "react"
import { Form, Button, Row, Col, Container } from "react-bootstrap"
import { toast } from "react-toastify"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetAllFoldersQuery } from "../slices/resourceAdminSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"
import { useFetchFoldersMutation } from "../slices/resourceTeacherSlice"
import { FaFolder } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAddTeacherClassDataMutation } from "../slices/periodApiSlice"

const TeacherDashboard = () => {
  const [classdata, setClassdata] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")

  const { data: allFolders, isLoading, error } = useGetAllFoldersQuery()
  const { data: classes } = useGetClassesQuery()
  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const [fetchFolder] = useFetchFoldersMutation()

  const [addTeacherClassData] = useAddTeacherClassDataMutation()

  const navigate = useNavigate()

  const userInfoString = localStorage.getItem("userInfo") // Retrieve the userInfo string from localStorage

  let teacherId = null // Initialize teacherId to null

  if (userInfoString) {
    const userInfo = JSON.parse(userInfoString) // Parse the userInfo string to convert it to an object
    teacherId = userInfo.id // Extract the id from the userInfo object
  }

  const filteredFolders =
    allFolders &&
    allFolders.filter((folder) => {
      const classMatch = classdata
        ? folder.accessTo.classAccess.includes(classdata)
        : true // If no class selected, always return true for class match
      const sectionMatch = section
        ? folder.accessTo.sectionAccess.includes(section)
        : true // If no section selected, always return true for section match
      const subjectMatch = subject
        ? folder.accessTo.subjectAccess.includes(subject)
        : true // If no subject selected, always return true for subject match
      const teacherMatch = teacherId
        ? folder.accessTo.teacherAccess.includes(teacherId)
        : true // If no teacherId available, always return true for teacher match
      return classMatch && sectionMatch && subjectMatch && teacherMatch
    })

  const handleAccessData = async (folder) => {
    try {
      const result = await addTeacherClassData({
        classId: classdata,
        sectionId: section,
        subjectId: subject,
        folderId: folder._id,
      })
      navigate(`/resource/${folder.folderName}`)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={3}>
            <Form>
              <Form.Label className="mt-3">Select Class:</Form.Label>
              <Form.Select onChange={(e) => setClassdata(e.target.value)}>
                <option value="">Select Class</option>
                {classes &&
                  classes.map((classItem, index) => (
                    <option key={index} value={classItem._id}>
                      {classItem.class}
                    </option>
                  ))}
              </Form.Select>
              <Form.Label className="mt-3">Select Section:</Form.Label>
              <Form.Select onChange={(e) => setSection(e.target.value)}>
                <option value="">Select Section</option>
                {sections &&
                  sections.map((sectionItem, index) => (
                    <option key={index} value={sectionItem._id}>
                      {sectionItem.section}
                    </option>
                  ))}
              </Form.Select>
              <Form.Label className="mt-3">Select Subject:</Form.Label>
              <Form.Select onChange={(e) => setSubject(e.target.value)}>
                <option value="">Select Subject</option>
                {subjects &&
                  subjects.map((subjectItem, index) => (
                    <option key={index} value={subjectItem._id}>
                      {subjectItem.subject}
                    </option>
                  ))}
              </Form.Select>
            </Form>
          </Col>
          <Col>
            <Row>
              <h4>List Folders</h4>
              {classdata && section && subject ? (
                isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>Error: {error.message}</p>
                ) : filteredFolders && filteredFolders.length > 0 ? (
                  filteredFolders.map((folder) => (
                    <Col key={folder._id} className="align-items-center">
                      <LinkContainer to={`/resource/${folder.folderName}`}>
                        <Col
                          xs="auto"
                          className="text-center"
                          onClick={() => handleAccessData(folder)}
                        >
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
                  ))
                ) : (
                  <p>No folders found for the selected combination</p>
                )
              ) : null}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default TeacherDashboard
