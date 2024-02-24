import React from "react"
import { Form, Button } from "react-bootstrap"

const FixtureForm = ({
  isLoading,
  error,
  classes,
  sections,
  subjects,
  hours,
  portions,
  submitHandler,
  setClassdata,
  setSection,
  setSubject,
  setHour,
  setPortions,
}) => {
  return (
    <>
      <Form>
        <Form.Group>
          <Form.Label>Select Class</Form.Label>
          <Form.Select
            aria-label="Select Class"
            defaultValue=""
            onChange={(e) => setClassdata(e.target.value)}
          >
            <option disabled value="">
              -- Select Class --
            </option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error fetching classes</option>
            ) : (
              classes?.map((classdata) => (
                <option key={classdata._id} value={classdata._id}>
                  {classdata.class}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Select Section</Form.Label>
          <Form.Select
            aria-label="Select Class"
            defaultValue=""
            onChange={(e) => setSection(e.target.value)}
          >
            <option disabled value="">
              -- Select Section --
            </option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error fetching sections</option>
            ) : (
              sections?.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.section}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Select Subject</Form.Label>
          <Form.Select
            aria-label="Select Class"
            defaultValue=""
            onChange={(e) => setSubject(e.target.value)}
          >
            <option disabled value="">
              -- Select Subject --
            </option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error fetching subjects</option>
            ) : (
              subjects?.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subject}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Label>Select Hour</Form.Label>
          <Form.Select
            aria-label="Select Class"
            defaultValue=""
            onChange={(e) => setHour(e.target.value)}
          >
            <option disabled value="">
              -- Select Hour --
            </option>
            {isLoading ? (
              <option disabled>Loading...</option>
            ) : error ? (
              <option disabled>Error fetching hours</option>
            ) : (
              hours?.map((hour) => (
                <option key={hour._id} value={hour._id}>
                  {hour.hour}
                </option>
              ))
            )}
          </Form.Select>
        </Form.Group>
        <Form.Group className="my-2" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Portions</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={portions}
            onChange={(e) => setPortions(e.target.value)}
            maxLength={188}
          />
        </Form.Group>
        <Button className="mt-3" onClick={submitHandler}>
          Open
        </Button>
      </Form>
    </>
  )
}

export default FixtureForm
