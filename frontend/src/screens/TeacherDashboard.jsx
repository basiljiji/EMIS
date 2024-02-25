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

const TeacherDashboard = () => {
  const [classdata, setClassdata] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")

  const {
    data: allFolders,
    isLoading,
    refetch,
    error,
  } = useGetAllFoldersQuery()

  const { data: classes } = useGetClassesQuery()
  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()

  const [fetchFolder] = useFetchFoldersMutation()

  // Filter folders based on selected class, section, and subject
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
      return classMatch && sectionMatch && subjectMatch
    })

  return (
    <>
      <Container>
        <Row>
          <Col>
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
              <h3>List Folders</h3>
              {classdata || section || subject ? (
                isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>Error: {error.message}</p>
                ) : filteredFolders && filteredFolders.length > 0 ? (
                  filteredFolders.map((folder) => (
                    <Col key={folder._id} className="align-items-center">
                      <LinkContainer to={`/resource/${folder.folderName}`}>
                        <Col xs="auto" className="text-center">
                          <FaFolder style={{ width: "80px", height: "80px" }} />
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
        <Row></Row>
      </Container>
    </>
  )
}

export default TeacherDashboard
