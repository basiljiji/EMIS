import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Form, Button } from "react-bootstrap"
import { toast } from "react-toastify"
import {
  useEditFixtureMutation,
  useGetFixtureDetailsQuery,
} from "../slices/fixturesApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"
import { useGetHoursQuery } from "../slices/hourApiSlice"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EditFixture = () => {
  const { id: fixtureId } = useParams()

  const [classdata, setClassdata] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")
  const [hour, setHour] = useState("")
  const [portions, setPortions] = useState("")

  const {
    data: fixture,
    isLoading,
    error,
    refetch,
  } = useGetFixtureDetailsQuery(fixtureId)

  const [editFixture, { isLoading: loadingFixture }] = useEditFixtureMutation()

  const { data: hours } = useGetHoursQuery()
  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()

  const navigate = useNavigate()

  useEffect(() => {
    if (fixture) {
      setClassdata(fixture.class._id)
      setSection(fixture.section._id)
      setSubject(fixture.subject._id)
      setHour(fixture.hour._id)
      setPortions(fixture.portions)
    }
  }, [fixture])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      if (classdata || section || subject || hour || portions) {
        const result = await editFixture({
          fixtureId,
          classdata,
          section,
          subject,
          hour,
          portions,
        })
        refetch()
        navigate("/dashboard")
        toast.success("Fixture Updated")
      } else {
        toast.error("Oops !!")
      }
    } catch (err) {
      if (err.data && err.data.message === "Already Class Assigned") {
        toast.error("Fixture already exists")
      } else {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <>
      <Container>
        <h3>Edit Fixture</h3>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          fixture &&
          fixture.class &&
          fixture.section &&
          fixture.subject &&
          fixture.hour && (
            <Form>
              <Form.Group className="mt-2">
                <Form.Label>Select Class</Form.Label>
                <Form.Select
                  aria-label="Select Class"
                  onChange={(e) => setClassdata(e.target.value)}
                  value={classdata}
                >
                  {classes?.map((classData) => (
                    <option
                      key={classData._id}
                      value={classData._id}
                      selected={classData._id === fixture.class._id}
                    >
                      {classData.class}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Select Section</Form.Label>
                <Form.Select
                  aria-label="Select Section"
                  onChange={(e) => setSection(e.target.value)}
                  value={section}
                >
                  {sections?.map((section) => (
                    <option
                      key={section._id}
                      value={section._id}
                      selected={section._id === fixture.section._id}
                    >
                      {section.section}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Select Subject</Form.Label>
                <Form.Select
                  aria-label="Select Subject"
                  onChange={(e) => setSubject(e.target.value)}
                  value={subject}
                >
                  {subjects?.map((subject) => (
                    <option
                      key={subject._id}
                      value={subject._id}
                      selected={subject._id === fixture.subject._id}
                    >
                      {subject.subject}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Select Hour</Form.Label>
                <Form.Select
                  aria-label="Select Hour"
                  onChange={(e) => setHour(e.target.value)}
                  value={hour}
                >
                  {hours?.map((hour) => (
                    <option
                      key={hour._id}
                      value={hour._id}
                      selected={hour._id === fixture.hour._id}
                    >
                      {hour.hour}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                className="my-2"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Portions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={portions}
                  onChange={(e) => setPortions(e.target.value)}
                  maxLength={188}
                />
              </Form.Group>
              <Button className="mt-3 bg-secondary" onClick={submitHandler}>
                Update Fixture
              </Button>
            </Form>
          )
        )}
      </Container>
    </>
  )
}

export default EditFixture
