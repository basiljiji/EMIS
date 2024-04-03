import React, { useState, useEffect } from "react"
import { Container, Col, Row, Form, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"
import {
  useEditFolderAccessMutation,
  useGetSingleFolderDataQuery,
} from "../slices/resourceAdminSlice"

const AdminEditAccessScreen = () => {
  const { id: folderId } = useParams()

  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()

  const [editFolderAccess] = useEditFolderAccessMutation()

  const {
    data: folder,
    isLoading,
    refetch,
    error,
  } = useGetSingleFolderDataQuery(folderId)

  console.log(folder, "foldd")

  const [accessTo, setAccessTo] = useState({
    classAccess: [],
    sectionAccess: [],
    subjectAccess: [],
  })

  useEffect(() => {
    if (folder && folder.accessTo) {
      setAccessTo(folder.accessTo)
    }
  }, [folder])

  const [checkedItems, setCheckedItems] = useState({
    classes: {},
    sections: {},
    subjects: {},
  })

  useEffect(() => {
    const newCheckedItems = {
      classes: {},
      sections: {},
      subjects: {},
    }

    if (classes) {
      classes.forEach((classItem) => {
        newCheckedItems.classes[classItem._id] = accessTo.classAccess.includes(
          classItem._id
        )
      })
    }

    if (sections) {
      sections.forEach((section) => {
        newCheckedItems.sections[section._id] = accessTo.sectionAccess.includes(
          section._id
        )
      })
    }

    if (subjects) {
      subjects.forEach((subject) => {
        newCheckedItems.subjects[subject._id] = accessTo.subjectAccess.includes(
          subject._id
        )
      })
    }

    setCheckedItems(newCheckedItems)
  }, [classes, sections, subjects, accessTo])

  const handleCheckboxChange = (type, id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        [id]: !prevState[type][id],
      },
    }))
  }

  const handleUpdate = async () => {
    try {
      // Gather checked IDs for classes, sections, and subjects
      const checkedClassIds = Object.keys(checkedItems.classes).filter(
        (id) => checkedItems.classes[id]
      )
      const checkedSectionIds = Object.keys(checkedItems.sections).filter(
        (id) => checkedItems.sections[id]
      )
      const checkedSubjectIds = Object.keys(checkedItems.subjects).filter(
        (id) => checkedItems.subjects[id]
      )

      // Prepare data object to be sent to the editFolderAccess mutation
      const data = {
        folderId: folder._id,
        accessTo: {
          classdata: checkedClassIds,
          sectiondata: checkedSectionIds,
          subjectdata: checkedSubjectIds,
        },
      }

      // Call the editFolderAccess mutation with the data object
      const result = await editFolderAccess(data)

      // Refetch data after successful update
      refetch()
      toast.success("Access Updated")
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <AdminLayout>
        <Container>
          <Row>
            <Col md={4}>
              <h4 className="mt-3">Edit Access</h4>
            </Col>
            <Col md={{ span: 4, offset: 4 }}></Col>
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
                    checked={checkedItems.classes[classItem._id]}
                    onChange={() =>
                      handleCheckboxChange("classes", classItem._id)
                    }
                  />
                ))}
            </Col>
            <Col>
              <h5>Sections:</h5>
              {sections &&
                sections.map((section) => (
                  <Form.Check
                    key={section._id}
                    type="checkbox"
                    label={section.section}
                    checked={checkedItems.sections[section._id]}
                    onChange={() =>
                      handleCheckboxChange("sections", section._id)
                    }
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
                    checked={checkedItems.subjects[subject._id]}
                    onChange={() =>
                      handleCheckboxChange("subjects", subject._id)
                    }
                  />
                ))}
            </Col>
          </Row>
          <Button onClick={() => handleUpdate(folder._id)}>
            Update Access
          </Button>
        </Container>
      </AdminLayout>
    </>
  )
}

export default AdminEditAccessScreen
