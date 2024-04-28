import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import {  useGetAllPeriodsChartQuery, useGetAllPeriodsQuery, useGetPeriodsReportAllQuery } from "../slices/periodApiSlice"
import Chart from "chart.js/auto"
import { Form, Container, Table, Row, Col, Button } from "react-bootstrap"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import Loader from "../components/Loader"



const AdminDashboard = () => {

  const chartRef = useRef(null)
  const [filter, setFilter] = useState("monthly") // Default filter option
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedWeekday, setSelectedWeekday] = useState("")
  const [chartInstance, setChartInstance] = useState(null)


  const { data: periods, isLoading, error } = useGetAllPeriodsChartQuery()
  const { data: periodsData, isLoading: reportLoading, error: reportError } = useGetPeriodsReportAllQuery()

  // Array of colors for teachers
  const teacherColors = [
    "rgba(255, 99, 132, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(255, 206, 86, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 159, 64, 0.5)",
  ]

  // useEffect hook to render chart whenever there's a change in data or filters
  useEffect(() => {
    if (!periods || isLoading || error) return

    const teacherDurations = combineTeacherDuration()

    if (chartInstance) {
      // Destroy the existing Chart instance before rendering a new one
      chartInstance.destroy()
    }

    renderBarChart(teacherDurations)
  }, [
    periods,
    isLoading,
    error,
    filter,
    selectedYear,
    selectedMonth,
    selectedTeacher,
    selectedWeekday,
  ])

  // Function to calculate total duration in minutes with 2 decimal points
  const calculateTotalDuration = (period) => {
    let totalDuration = 0
    period.accessedFiles.forEach((file) => {
      totalDuration += file.duration
    })
    return totalDuration / 60000 // Convert milliseconds to minutes
  }

  // Function to combine total duration for a single teacher
  const combineTeacherDuration = () => {
    let filteredPeriods = periods // Initialize filteredPeriods with all periods

    // Filter periods data for the selected year and month
    if (selectedYear && selectedMonth) {
      const selectedMonthIndex = new Date(selectedMonth + " 1, 2000").getMonth() // Convert month name to index
      filteredPeriods = periods.filter((period) => {
        const createdAtMonth = new Date(period.createdAt).getMonth()
        const createdAtYear = new Date(period.createdAt).getFullYear()
        return (
          createdAtMonth === selectedMonthIndex &&
          createdAtYear === selectedYear
        )
      })
    }

    const teacherDurations = {}
    filteredPeriods.forEach((period) => {
      const teacherName = `${period.teacher.firstName} ${period.teacher.lastName}`
      const duration = calculateTotalDuration(period)
      if (teacherDurations.hasOwnProperty(teacherName)) {
        teacherDurations[teacherName] += duration
      } else {
        teacherDurations[teacherName] = duration
      }
    })

    // Convert object to array of entries and sort by total duration in descending order
    const sortedTeacherDurations = Object.entries(teacherDurations).sort(
      ([, durationA], [, durationB]) => durationB - durationA
    )

    return sortedTeacherDurations
  }

  // Function to render bar chart using Chart.js
  const renderBarChart = (teacherDurations) => {
    let filteredData
    if (selectedTeacher) {
      // Filter data for the selected teacher
      filteredData = teacherDurations.filter(
        ([teacherName]) => teacherName === selectedTeacher
      )
    } else {
      filteredData = teacherDurations
    }
    const labels = filteredData.map(([teacherName]) => teacherName)
    const durations = filteredData.map(([, totalDuration]) =>
      totalDuration.toFixed(2)
    )

    const backgroundColors = teacherColors.slice(0, labels.length) // Use colors for each teacher

    const chartConfig = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Duration (minutes)",
            data: durations,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("0.5", "1")
            ), // Darker border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y", // Display labels on y-axis for horizontal bar chart
        maintainAspectRatio: false, // Allow the chart to shrink and expand
        responsive: true, // Ensure the chart responds to changes in container size
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Total Duration (minutes)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Teacher",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    }

    const ctx = chartRef.current.getContext("2d")
    const newChartInstance = new Chart(ctx, chartConfig)
    setChartInstance(newChartInstance)
  }

  // Function to handle filter change
  const handleFilterChange = (value) => {
    setFilter(value)
  }

  // Function to handle year change
  const handleYearChange = (year) => {
    setSelectedYear(year)
  }

  // Function to handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month)
  }

  // Function to handle teacher change
  const handleTeacherChange = (teacher) => {
    setSelectedTeacher(teacher)
  }

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
  if (periods) {
    const uniqueTeachers = new Set(
      periods.map(
        (period) => `${period.teacher.firstName} ${period.teacher.lastName}`
      )
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

    // doc.save("periods_report.pdf")
    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)

    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank")
  }

  return (
    <AdminLayout>
      <Container>
        <Form>
          <Row className="d-flex my-2">
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  <option value="">Select Month</option>
                  {monthsOptions}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                >
                  <option value="">Select Year</option>
                  {nextTenYearsOptions}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Select
                  value={selectedTeacher}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                >
                  <option value="">Select Teacher</option>
                  {teachersOptions}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {isLoading && <Loader />}
        {error && <p>Error: {error?.data?.message || error.error}</p>}
        <canvas
          ref={chartRef}
          style={{ maxWidth: "600px", maxHeight: "400px" }}
        />

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
                <tr >
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
                    <td>{new Date(periodsData[personName].fromDate).toLocaleString()}</td>
                    <td>{new Date(periodsData[personName].toDate).toLocaleString()}</td>
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
