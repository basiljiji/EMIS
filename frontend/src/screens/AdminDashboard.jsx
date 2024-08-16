import React, { useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { useGetPeriodsReportAllQuery } from "../slices/periodApiSlice"
import { Form, Container, Table, Row, Col, Button } from "react-bootstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Loader from "../components/Loader"

const AdminDashboard = () => {
  const { data: periodsData, isLoading: reportLoading, error: reportError } = useGetPeriodsReportAllQuery()


  // Generate options for months dropdown
  const monthsOptions = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(null, index + 1, 1).toLocaleDateString("en", {
      month: "long",
    })
    return (
      <option key={month} value={month}>
        {month}
      </option>
    )
  })

  // Generate options for next 10 years dropdown
  const currentYear = new Date().getFullYear()
  const nextTenYearsOptions = Array.from({ length: 10 }, (_, index) => {
    const year = currentYear + index
    return (
      <option key={year} value={year}>
        {year}
      </option>
    )
  })

  // Generate options for teachers dropdown
  let teachersOptions = []
  if (periodsData) {
    const uniqueTeachers = new Set(
      Object.keys(periodsData).map((personName) => personName)
    )
    teachersOptions = Array.from(uniqueTeachers).map((teacher, index) => (
      <option key={index} value={teacher}>
        {teacher}
      </option>
    ))
  }

  // Function to handle printing the table as PDF
  const pdfHandler = () => {
    const doc = new jsPDF()

    const columns = [
      "Sl No.",
      "Name",
      "Total Duration(hr)",
      "Total Logged-in Time(hr)",
      "Total Resource Time(hr)",
      "From Date",
      "To Date",
    ]

    const rows = Object.keys(periodsData).map((personName, index) => [
      index + 1,
      personName,
      periodsData[personName].totalDuration,
      periodsData[personName].totalLoggedInTime,
      periodsData[personName].totalResourceTime,
      new Date(periodsData[personName].fromDate).toLocaleString(),
      new Date(periodsData[personName].toDate).toLocaleString(),
    ])

    doc.text("St.Mary's Public School", 10, 10)
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      headStyles: { fillColor: [100, 100, 255] },
    })

    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)

    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank")
  }

  return (
    <AdminLayout>
      <Container>

        {reportLoading && <Loader />}
        {reportError && <p>Error: {reportError.message}</p>}
        <div>
          <Row>
            <Col>
              <h1>Periods Report</h1>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={pdfHandler}>
                Print Report
              </Button>
            </Col>
          </Row>
          {reportLoading ? (
            <div><Loader /></div>
          ) : reportError ? (
            <div>Error: {reportError.message}</div>
          ) : !periodsData || Object.keys(periodsData).length === 0 ? (
            <div>No periods data available</div>
          ) : (
            <Table striped bordered hover>
              <thead className="bg-success">
                <tr>
                  <th>Sl No.</th>
                  <th>Name</th>
                  <th>Total Duration(hr)</th>
                  <th>Total Logged-in Time(hr)</th>
                  <th>Total Resource Time(hr)</th>
                  <th>From Date</th>
                  <th>To Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(periodsData).map((personName, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{personName}</td>
                    <td>{periodsData[personName].totalDuration}</td>
                    <td>{periodsData[personName].totalLoggedInTime}</td>
                    <td>{periodsData[personName].totalResourceTime}</td>
                    <td>{new Date(periodsData[personName].fromDate).toLocaleDateString()}</td>
                    <td>{new Date(periodsData[personName].toDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </AdminLayout>
  )
}

export default AdminDashboard
