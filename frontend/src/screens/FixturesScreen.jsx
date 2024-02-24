import React, { useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { toast } from "react-toastify"
import {
  useAddFixtureMutation,
  useDeleteFixtureMutation,
  useGetFixturesQuery,
} from "../slices/fixturesApiSlice"
import { useGetHoursQuery } from "../slices/hourApiSlice"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import FixtureTable from "../components/FixtureTable"
import FixtureForm from "../components/FixtureForm"

const FixturesScreen = () => {
  const [classdata, setClassdata] = useState("")
  const [section, setSection] = useState("")
  const [subject, setSubject] = useState("")
  const [hour, setHour] = useState("")
  const [portions, setPortions] = useState("")

  const { data: fixtures, isLoading, error, refetch } = useGetFixturesQuery()
  const { data: hours } = useGetHoursQuery()
  const { data: sections } = useGetSectionsQuery()
  const { data: subjects } = useGetSubjectsQuery()
  const { data: classes } = useGetClassesQuery()

  const [addFixture, { isLoading: loadingFixture }] = useAddFixtureMutation()
  const [deleteFixture, { isLoading: loadingDelete }] =
    useDeleteFixtureMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      if (classdata && section && subject && hour) {
        const result = await addFixture({
          classdata,
          section,
          subject,
          hour,
          portions,
        })
        refetch()
        if (result && result.data.message) {
          toast.success(result.data.message)
        }
      } else {
        toast.error("Please Select All Fields")
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteFixture(id)
        toast.success("Fixture Deleted")
        refetch()
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <Container className="py-3">
      <Row>
        <Col md={8}>
          <h3>Today's Fixtures</h3>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <FixtureTable fixtures={fixtures} deleteHandler={deleteHandler} />
          )}
        </Col>
        <Col>
          <h3>Add Fixture</h3>
          <FixtureForm
            isLoading={isLoading}
            error={error}
            classes={classes}
            sections={sections}
            subjects={subjects}
            hours={hours}
            portions={portions}
            submitHandler={submitHandler}
            setClassdata={setClassdata}
            setSection={setSection}
            setSubject={setSubject}
            setHour={setHour}
            setPortions={setPortions}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default FixturesScreen
