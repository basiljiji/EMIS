import React, { useState, useEffect } from "react"
import AdminLayout from "../components/AdminLayout"
import { useGetPeriodsReportAllQuery } from "../slices/periodApiSlice"
import { Form, Container, Table, Row, Col, Button } from "react-bootstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Loader from "../components/Loader"

const AdminDashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('en', { month: 'long' }))

  const { data: periodsData, isLoading: reportLoading, error: reportError, refetch } = useGetPeriodsReportAllQuery({ year: selectedYear, month: selectedMonth })

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

  const handleFetchReport = () => {
    refetch()
  }

  return (
    <AdminLayout>
      <Container>
        <div>
          <Row className="my-3">
            <Col>
              <h5>Periods Report</h5>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={pdfHandler}>
                Print Report
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="yearSelect">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {nextTenYearsOptions}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="monthSelect">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {monthsOptions}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleFetchReport}>
                Fetch Report
              </Button>
            </Col>
          </Row>
          {reportLoading ? (
            <Loader />
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
