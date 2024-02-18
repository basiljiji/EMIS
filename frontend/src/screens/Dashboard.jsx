import React from "react"
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap"
import { useGetFixturesQuery } from "../slices/fixturesApiSlice"
import Loader from "../components/Loader"
import Message from '../components/Message'


const Dashboard = () => {
    const { data: fixtures, isLoading, error } = useGetFixturesQuery()
    const submitHandler = () => {
        console.log("submitted")
    }
    return (
        <>
            <Container>
                <Row>
                    <Col md={8}>
                        <h3>Today's Fixtures</h3>
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message />
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Subject</th>
                                        <th>Hour</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fixtures.map((fixture, index) => (
                                        <tr key={index}>
                                            <td>{fixture.class.class}</td>
                                            <td>{fixture.section.section}</td>
                                            <td>{fixture.subject.subject}</td>
                                            <td>{fixture.hour.hour}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                    <Col>
                        <h3>Add Fixture</h3>
                        <Form>
                            <Form.Group>
                                <Form.Label>Select Class</Form.Label>
                                <Form.Select aria-label="Select Class">
                                    <option disabled selected>
                                        -- Select Class --
                                    </option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Section</Form.Label>
                                <Form.Select aria-label="Select Section">
                                    <option disabled selected>
                                        -- Select Section --
                                    </option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Subject</Form.Label>
                                <Form.Select aria-label="Select Subject">
                                    <option disabled selected>
                                        -- Select Subject --
                                    </option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Hour</Form.Label>
                                <Form.Select aria-label="Select Hour">
                                    <option disabled selected>
                                        -- Select Hour --
                                    </option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Button className="mt-3" onClick={submitHandler}>
                                Add Fixture
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Dashboard
