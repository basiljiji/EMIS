import React from "react"
import { Table, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"

const FixtureTable = ({ fixtures, deleteHandler }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Class</th>
          <th>Section</th>
          <th>Subject</th>
          <th>Hour</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {fixtures.map((fixture, index) => (
          <tr key={index}>
            <td>{fixture.class.class}</td>
            <td>{fixture.section.section}</td>
            <td>{fixture.subject.subject}</td>
            <td>{fixture.hour.hour}</td>
            <td>
              <LinkContainer
                to={`/fixture/edit/${fixture._id}`}
                className="me-2"
              >
                <Button variant="primary">Edit</Button>
              </LinkContainer>
              <Button
                variant="danger"
                onClick={() => deleteHandler(fixture._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default FixtureTable
