import React from "react"
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap"
import { useGetFixturesQuery } from "../slices/fixturesApiSlice"
import Loader from "../components/Loader"
import Message from '../components/Message'
import { useGetHoursQuery } from "../slices/hourApiSlice"
import { useGetSectionsQuery } from "../slices/sectionApiSlice"
import { useGetSubjectsQuery } from "../slices/subjectApiSlice"
import { useGetClassesQuery } from "../slices/classApiSlice"


const Dashboard = () => {
    const { data: fixtures, isLoading, error } = useGetFixturesQuery()
    const { data: hours } = useGetHoursQuery()
    const { data: sections } = useGetSectionsQuery()
    const { data: subjects } = useGetSubjectsQuery()
    const { data: classes } = useGetClassesQuery()

    
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
                                <Form.Select aria-label="Select Class" defaultValue="">
                                    <option disabled value="">
                                        -- Select Class --
                                    </option>
                                    {isLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : error ? (
                                        <option disabled>Error fetching hours</option>
                                    ) : (
                                        classes?.map((classdata) => (
                                            <option key={classdata._id} value={classdata._id}>{classdata.class}</option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Section</Form.Label>
                                <Form.Select aria-label="Select Class" defaultValue="">
                                    <option disabled value="">
                                        -- Select Section --
                                    </option>
                                    {isLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : error ? (
                                        <option disabled>Error fetching sections</option>
                                    ) : (
                                        sections?.map((section) => (
                                            <option key={section._id} value={section._id}>{section.section}</option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Subject</Form.Label>
                               <Form.Select aria-label="Select Class" defaultValue="">
                                    <option disabled value="">
                                        -- Select Subject --
                                    </option>
                                    {isLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : error ? (
                                        <option disabled>Error fetching subjects</option>
                                    ) : (
                                        subjects?.map((subject) => (
                                            <option key={subject._id} value={subject._id}>{subject.subject}</option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Hour</Form.Label>
                                <Form.Select aria-label="Select Class" defaultValue="">
                                    <option disabled value="">
                                        -- Select Hour --
                                    </option>
                                    {isLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : error ? (
                                        <option disabled>Error fetching hours</option>
                                    ) : (
                                        hours?.map((hour) => (
                                            <option key={hour._id} value={hour._id}>{hour.hour}</option>
                                        ))
                                    )}
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
