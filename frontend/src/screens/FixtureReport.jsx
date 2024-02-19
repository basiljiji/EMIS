import React, { useRef, useState } from "react"
import { Table, Button } from "react-bootstrap"
import AdminLayout from "../components/AdminLayout"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useGetReportQuery } from "../slices/reportApiSlice"

const FixtureReport = () => {
  const { data: fixtures, isLoading, error, refetch } = useGetReportQuery()

  const [pdfUrl, setPdfUrl] = useState("")
  const contentRef = useRef(null)

  const formatDate = (dateString) => {
    // Create a new Date object from the dateString
    const date = new Date(dateString)

    // Extract day, month, and year
    const day = date.getDate()
    const month = date.getMonth() + 1 // Months are zero-based
    const year = date.getFullYear()

    // Pad single-digit day and month with leading zero
    const formattedDay = day < 10 ? `0${day}` : day
    const formattedMonth = month < 10 ? `0${month}` : month

    // Return formatted date string in "dd-mm-yyyy" format
    return `${formattedDay}-${formattedMonth}-${year}`
  }

  const pdfHandler = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF()

    // Define columns for the table
    const columns = ["Teacher", "Class", "Section", "Subject", "Hour", "Date"]

    // Define rows for the table
    const rows = fixtures.map((fixture, index) => {
      const teacherName = `${fixture.teacher.firstName || ""} ${
        fixture.teacher.middleName || ""
      } ${fixture.teacher.lastName || ""}`
      return [
        teacherName,
        fixture.class.class,
        fixture.section.section,
        fixture.subject.subject,
        fixture.hour.hour,
        formatDate(fixture.date),
      ]
    })

    // Add a title to the PDF
    doc.setFontSize(16)
    doc.text("Fixture Reports", 10, 20)

    // Add a table to the PDF
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30, // Start y position for the table
      headStyles: { fillColor: [100, 100, 255] },
    })

    // Generate the PDF as a data URI
    const pdfDataUri = doc.output("datauristring")

    // Open the PDF in a new tab
    window.open(pdfDataUri, "_blank")
  }

  return (
    <AdminLayout>
      <>
        <h3>Fixture Reports</h3>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <div ref={contentRef}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Teacher</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Hour</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {fixtures.map((fixture, index) => (
                  <tr key={fixture._id}>
                    <td>{index + 1}</td>
                    <td>
                      {`${fixture.teacher.firstName || ""} ${
                        fixture.teacher.middleName || ""
                      } ${fixture.teacher.lastName || ""}`}
                    </td>
                    <td>{fixture.class.class}</td>
                    <td>{fixture.section.section}</td>
                    <td>{fixture.subject.subject}</td>
                    <td>{fixture.hour.hour}</td>
                    <td>{formatDate(fixture.date)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        <Button onClick={pdfHandler}>Generate PDF</Button>
      </>
    </AdminLayout>
  )
}

export default FixtureReport
