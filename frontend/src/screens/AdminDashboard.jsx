import React, { useEffect, useRef, useState } from "react"
import AdminLayout from "../components/AdminLayout"
import { useGetAllPeriodsQuery } from "../slices/periodApiSlice"
import Chart from "chart.js/auto"
import { Form, Container } from "react-bootstrap"

const AdminDashboard = () => {
  const { data: periods, isLoading, error } = useGetAllPeriodsQuery()
  const chartRef = useRef(null)
  const [filter, setFilter] = useState("monthly") // Default filter option
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedWeekday, setSelectedWeekday] = useState("")
  const [chartInstance, setChartInstance] = useState(null)

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

  return (
    <AdminLayout>
      <Container>
        <Form>
          <Form.Group>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              <option value="">Select Month</option>
              {monthsOptions}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="">Select Year</option>
              {nextTenYearsOptions}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Select
              value={selectedTeacher}
              onChange={(e) => handleTeacherChange(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachersOptions}
            </Form.Select>
          </Form.Group>
        </Form>

        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error?.data?.message || error.error}</p>}
        <canvas
          ref={chartRef}
          style={{ maxWidth: "600px", maxHeight: "400px" }}
        />
      </Container>
    </AdminLayout>
  )
}

export default AdminDashboard
