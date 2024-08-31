import React, { useState, useEffect } from "react"
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
import "../index.css" // Make sure to import your CSS

const AdminPeriod = () => {
  const { pageNumber } = useParams()
  const [teacherName, setTeacherName] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [fetchData, setFetchData] = useState(false)

  const { data: teachers } = useGetTeachersQuery()
  const { data, isLoading, refetch, error } = useGetAllPeriodsQuery(
    { pageNumber, startDate, endDate, teacherId },
    { skip: !fetchData }
  )

  const periods = data?.periods || []


  useEffect(() => {
    if (fetchData) {
      refetch()
    }
  }, [fetchData, refetch])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  const formatTime = (timeString) => {
    const time = new Date(timeString)
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (fromTime, toTime) => {
    if (!fromTime || !toTime) return "N/A"
    const from = new Date(fromTime)
    const to = new Date(toTime)
    return ((to - from) / 3600000).toFixed(2) // Duration in hours
  }

  const handleFilterChange = () => {
    const filteredPeriods = periods.filter((period) => {
      const teacherMatch = teacherName
        ? `${period.teacher.firstName} ${period.teacher.lastName}` === teacherName
        : true
      const dateRangeMatch =
        startDate && endDate
          ? period.day >= startDate && period.day <= endDate
          : true
      return teacherMatch && dateRangeMatch
    })
    return filteredPeriods
  }

  const pdfHandler = () => {
    const doc = new jsPDF()

    // Use pre-calculated totals from the response data
    const totalLoginTimeSum = data?.totalLoginTimeSum || 0
    const totalDurationSum = data?.totalDurationSum || 0
    const totalResourceTimeSum = data?.totalResourceTimeSum || 0

    const filteredPeriods = handleFilterChange()

    const columns = [
      { header: "Date", dataKey: "date" },
      { header: "LogIn", dataKey: "loggedIn" },
      { header: "LogOut", dataKey: "loggedOut" },
      { header: "Filename", dataKey: "filename" },
      { header: "Duration (min)", dataKey: "duration" },
      { header: "Resource", dataKey: "resource" },
    ]

    const rows = filteredPeriods.flatMap((period) => {
      return period.accessedFiles.map((file) => {
        return {
          date: formatDate(period.day),
          loggedIn: formatTime(period.loggedIn),
          loggedOut: formatTime(period.loggedOut),
          filename: file.portionTitle || "N/A",
          duration: (file.duration / 60000).toFixed(2) || "N/A",
          resource: calculateDuration(file.fromTime, file.toTime) || "N/A",
        }
      })
    })

    const selectedTeacher = teachers?.find(
      (teacher) => teacher._id === teacherId
    )

    const teacherFullName = selectedTeacher
      ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}`
      : "All Teachers"

    doc.setFontSize(16)

    // Center "St Marys School"
    const pageWidth = doc.internal.pageSize.getWidth()
    const textWidth = doc.getTextWidth("ST MARYS SCHOOL")
    doc.text("ST MARYS SCHOOL", (pageWidth - textWidth) / 2, 20)

    doc.setFontSize(12)

    // Teacher on one line and Date Range below it
    const headerMargin = 30
    const teacherText = `Teacher: ${teacherFullName}`
    const dateRangeText = `Date Range: ${startDate} to ${endDate}`

    doc.text(teacherText, 15, headerMargin)
    doc.text(dateRangeText, 15, headerMargin + 10)

    // Convert totals from minutes to hours and format them
    const totalLoginTimeHours = (totalLoginTimeSum / 60).toFixed(2)
    const totalDurationHours = (totalDurationSum / 60).toFixed(2)
    const totalResourceTimeHours = (totalResourceTimeSum / 60).toFixed(2)

    // Total Sums
    const totalText = `Total Login Time: ${totalLoginTimeHours} hours  |  Total Duration: ${totalDurationHours} hours  |  Total Resource Time: ${totalResourceTimeHours} hours`
    const totalTextWidth = doc.getTextWidth(totalText)
    doc.text(totalText, (pageWidth - totalTextWidth) / 2, headerMargin + 20)

    // First Page Table
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: headerMargin + 30,
      headStyles: { fillColor: [100, 100, 255] },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'auto',
        valign: 'top',
        fontSize: 10,
      },
      columnStyles: {
        filename: { cellWidth: 50 },
        duration: { cellWidth: 30 },
        resource: { cellWidth: 40 },
      },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(`Continued from page ${data.pageNumber - 1}`, data.settings.margin.left, data.settings.margin.top - 10)
        }
      },
    })

    // Generate the PDF filename with the teacher's name
    const formattedTeacherName = teacherFullName.replace(/ /g, "_") // Replace spaces with underscores
    const pdfFilename = `${formattedTeacherName}_Report.pdf`

    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)

    window.open(pdfUrl, "_blank")
  }




  const handleFetch = () => {
    const selectedTeacher = teachers?.find(
      (teacher) => `${teacher.firstName} ${teacher.lastName}` === teacherName
    )
    setTeacherId(selectedTeacher?._id || "")
    setFetchData(true)
  }

  return (
    <AdminLayout>
      <>
        <Container>
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
                      {teachers &&
                        teachers
                          .slice()
                          .sort((a, b) => {
                            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase()
                            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase()
                            if (nameA < nameB) return -1
                            if (nameA > nameB) return 1
                            return 0
                          })
                          .map((teacher, index) => (
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
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="date"
                          placeholder="End Date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Container>
          <Row className="my-3 text-end">
            <Button onClick={handleFetch} className="mb-5">
              Fetch Periods
            </Button>
            <Button onClick={pdfHandler} className="mb-5">
              Generate Report
            </Button>
          </Row>
          {teacherName && (
            <h5 className="mb-3">Teacher: {teacherName}</h5>
          )}
          {isLoading && <Loader />}
          {error && <Message>{error?.data?.message || error.error}</Message>}
          {periods && periods.length > 0 && (
            <Table striped bordered hover className="my-2">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Class</th>
                  <th>LoggedIn</th>
                  <th>LoggedOut</th>
                  <th>File Name</th>
                  <th>Duration(in Hrs)</th>
                  <th>Resource</th>
                </tr>
              </thead>
              <tbody>
                {handleFilterChange().map((period, index) => (
                  <tr key={index}>
                    <td>{formatDate(period.day)}</td>
                    <td>
                      {period.classData.map((classData, classDataIndex) => (
                        <div key={classDataIndex}>
                          <div>{classData.class.class}</div>
                          <div>{classData.section.section}</div>
                          <div>{classData.subject.subject}</div>
                        </div>
                      ))}
                    </td>
                    <td>{formatTime(period.loggedIn)}</td>
                    <td>{formatTime(period.loggedOut)}</td>
                    <td className="word-wrap">
                      {period.accessedFiles.length > 0 ? (
                        period.accessedFiles.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            {file.portionTitle || "N/A"}
                          </div>
                        ))
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {period.accessedFiles.length > 0 ? (
                        period.accessedFiles.map(
                          (access, accessIndex) =>
                            access.duration > 0 && (
                              <div key={accessIndex}>
                                {(access.duration / 60000).toFixed(2)} min
                              </div>
                            )
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {period.accessedFiles.length > 0 ? (
                        period.accessedFiles.map((file, fileIndex) => (
                          <div key={fileIndex}>
                            {calculateDuration(file.fromTime, file.toTime)} min
                          </div>
                        ))
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          <Paginate pages={data?.pages} page={data?.page} />
          {periods && periods.length === 0 && <p>No periods found.</p>}
        </Container>
      </>
    </AdminLayout>
  )
}

export default AdminPeriod
