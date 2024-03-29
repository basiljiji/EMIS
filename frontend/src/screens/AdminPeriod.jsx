import React, { useState } from "react"
import { useGetAllPeriodsQuery } from "../slices/periodApiSlice"
import AdminLayout from "../components/AdminLayout"
import { Table, Form, Button, Row, Col, Container } from "react-bootstrap"
import jsPDF from "jspdf"
import { useGetTeachersQuery } from "../slices/teacherApiSlice"
import autoTable from "jspdf-autotable"

const AdminPeriod = () => {
  const { data: periods, isLoading, refetch, error } = useGetAllPeriodsQuery()
  const [teacherName, setTeacherName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortField, setSortField] = useState("name")

  const { data: teachers } = useGetTeachersQuery()

  // Function to format date as dd-mm-yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const formattedDate = date.toLocaleDateString("en-GB")
    return formattedDate
  }

  // Function to format time as HH:MM AM/PM
  const formatTime = (timeString) => {
    const time = new Date(timeString)
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    return formattedTime
  }

  const handleFilterChange = () => {

    if (!periods) return []

    const filteredPeriods = periods.filter((period) => {
      const teacherMatch = teacherName
        ? `${period.teacher.firstName} ${period.teacher.lastName}` ===
          teacherName
        : true
      const dateRangeMatch =
        startDate && endDate
          ? period.day >= startDate && period.day <= endDate
          : true
      return teacherMatch && dateRangeMatch
    })
    return filteredPeriods
  }

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortOrder("asc")
    }
    setSortField(field)
  }

  const sortedPeriods = handleFilterChange().sort((a, b) => {
    if (sortField === "name") {
      const nameA = `${a.teacher.firstName} ${a.teacher.lastName}`
      const nameB = `${b.teacher.firstName} ${b.teacher.lastName}`
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    } else if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.day) - new Date(b.day)
        : new Date(b.day) - new Date(a.day)
    }
  })

  const pdfHandler = () => {
    const doc = new jsPDF()

    const filteredPeriods = handleFilterChange()

    const columns = ["Name", "Date", "LoggedIn", "LoggedOut"]
    const rows = filteredPeriods.map((period) => [
      `${period.teacher.firstName} ${period.teacher.lastName}`,
      formatDate(period.day),
      period.loggedIn,
      period.loggedOut,
    ])

    doc.setFontSize(16)
    doc.text("Teacher Report", 10, 20)

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      headStyles: { fillColor: [100, 100, 255] },
    })

    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)

    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank")
  }

  const getFileNameFromUrl = (url) => {
    if (!url) return "" // Check if url is undefined or null

    const regex = /\/([^/]+)$/ // Match the last part of the URL after the last '/'
    const match = url.match(regex)

    if (match && match[1]) {
      return match[1]
    } else {
      return url // If no match found, return the original URL
    }
  }

  return (
    <AdminLayout>
      <h4 className="mt-3">Periods</h4>
      <Container>
        <Form>
          <Row className="justify-content-between">
            <Col md={5} xs="auto">
              <Form.Group controlId="teacherName">
                <Form.Label>Teacher Name</Form.Label>
                <Form.Control
                  as="select"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                >
                  <option value="">All</option>
                  {/* Populate dropdown with teacher names */}
                  {teachers &&
                    teachers.map((teacher, index) => (
                      <option
                        key={`${teacher.firstName}-${teacher.lastName}-${index}`}
                      >
                        {`${teacher.firstName} ${teacher.lastName}`}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs="auto">
              <Form.Group controlId="dateRange">
                <Row>
                  <Form.Label>Date Range</Form.Label>
                  <Col>
                    <Form.Control
                      type="date"
                      placeholder="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      placeholder="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Container>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {periods && periods.length > 0 && (
        <Table striped bordered hover className="my-4">
          <thead>
            <tr>
              <th>
                Name
                <Button variant="link" onClick={() => handleSort("name")}>
                  {sortField === "name" && sortOrder === "asc" ? "▲" : "▼"}
                </Button>
              </th>
              <th>
                Date
                <Button variant="link" onClick={() => handleSort("date")}>
                  {sortField === "date" && sortOrder === "asc" ? "▲" : "▼"}
                </Button>
              </th>
              <th>LoggedIn</th>
              <th>LoggedOut</th>
              <th>File Name</th>
              <th>Duration(in Mins)</th>
              <th>From Time to To Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedPeriods.map((period, index) => (
              <tr key={index}>
                <td>{`${period.teacher.firstName} ${period.teacher.lastName}`}</td>
                <td>{formatDate(period.day)}</td>
                <td>{formatTime(period.loggedIn)}</td>
                <td>{formatTime(period.loggedOut)}</td>
                <td>
                  {period.accessedFiles.map((file, fileIndex) => (
                    <div key={fileIndex}>
                      {getFileNameFromUrl(file.fileUrl)}
                    </div>
                  ))}
                </td>
                <td>
                  {period.accessedFiles.map((access, accessIndex) => (
                    <div key={accessIndex}>
                      {(access.duration / 60000).toFixed(2)} min
                    </div>
                  ))}
                </td>
                <td>
                  {period.accessedFiles.map((fromtime, fromtimeIndex) => (
                    <div key={fromtimeIndex}>
                      {formatTime(fromtime.fromTime)} to{" "}
                      {formatTime(fromtime.toTime)}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {periods && periods.length === 0 && <p>No periods found.</p>}

      <Button onClick={pdfHandler} className="mb-5">
        Generate Report
      </Button>
    </AdminLayout>
  )
}

export default AdminPeriod
