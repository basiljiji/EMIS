import React, { useState } from "react"
import { useGetAllPeriodsQuery } from "../slices/periodApiSlice"
import AdminLayout from "../components/AdminLayout"
import { Table, Form, Button, Row, Col, Container } from "react-bootstrap"
import jsPDF from "jspdf"
import { useGetTeachersQuery } from "../slices/teacherApiSlice"
import autoTable from "jspdf-autotable"
import Loader from "../components/Loader"
import Message from "../components/Message"
import { useParams } from 'react-router-dom'
import Paginate from "../components/Paginate"

const AdminPeriod = () => {
  const { pageNumber } = useParams()
  const [teacherName, setTeacherName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [sortField, setSortField] = useState("name")
  
  const { data: teachers } = useGetTeachersQuery()
  const { data, isLoading, refetch, error } = useGetAllPeriodsQuery({ pageNumber })

  const periods = data?.periods || [];

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

    const columns = [
      "Name",
      "Date",
      "LoggedIn",
      "LoggedOut",
      "Filename",
      "Duration (min)",
      "From Time - To Time",
    ]
    const rows = filteredPeriods.flatMap((period) => {
      return period.accessedFiles.map((file, fileIndex) => {
        return [
          `${period.teacher.firstName} ${period.teacher.lastName}`,
          formatDate(period.day),
          formatTime(period.loggedIn),
          formatTime(period.loggedOut),
          file.portionTitle,
          (file.duration / 60000).toFixed(2),
          `${formatTime(file.fromTime)} - ${formatTime(file.toTime)}`,
        ]
      })
    })

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

  //Take fileName from URL
  // const getFileNameFromUrl = (url) => {
  //   if (!url) return ""

  //   const regex = /\/([^/]+)$/
  //   const match = url.match(regex)

  //   if (match && match[1]) {
  //     return match[1]
  //   } else {
  //     return url 
  //   }
  // }


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
      <Row className="my-3 text-end">
        <Button onClick={pdfHandler} className="mb-5">
          Generate Report
        </Button>
      </Row>
      {isLoading && <Loader />}
      {error && <Message>{error?.data?.message || error.error}</Message>}
      {periods && periods.length > 0 && (
        <Table striped bordered hover className="my-2">
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
              <th>Class</th>
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
                <td>
                  {period.classData.map((classData, classDataIndex) => (
                    <div key={classDataIndex}>
                      <div>{classData.class.class}</div>
                      <div>{classData.section.section}</div>
                      <div>{classData.subject.subject}</div>
                      {/* <div>{classData.folder.folderName}</div> */}
                    </div>
                  ))}
                </td>
                <td>{formatTime(period.loggedIn)}</td>
                <td>{formatTime(period.loggedOut)}</td>
                <td>
                  {period.accessedFiles.map((file, fileIndex) => (
                    <div key={fileIndex}>
                      {file.portionTitle}
                    </div>
                  ))}
                </td>
                <td>
                  {period.accessedFiles.map(
                    (access, accessIndex) =>
                      access.duration > 0 && (
                        <div key={accessIndex}>
                          {(access.duration / 60000).toFixed(2)} min
                        </div>
                      )
                  )}
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
      <Paginate pages={data?.pages} page={data?.page} />
      {periods && periods.length === 0 && <p>No periods found.</p>}
    </AdminLayout>
  )
}

export default AdminPeriod
