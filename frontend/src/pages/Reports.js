"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

const Reports = () => {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState([])
  const [filter, setFilter] = useState({
    vaccineName: "",
    fromDate: "",
    toDate: "",
    class: "",
  })
  const [errors, setErrors] = useState({})
  const [vaccines, setVaccines] = useState([])

  useEffect(() => {
    // Fetch available vaccines for filter dropdown
    // This will be replaced with an actual API call
    setTimeout(() => {
      setVaccines(["Polio", "MMR", "Hepatitis B", "Tetanus", "Influenza"])
    }, 500)
  }, [])

  const validateForm = () => {
    const newErrors = {}

    // Validate date range if both dates are provided
    if (filter.fromDate && filter.toDate) {
      const fromDate = new Date(filter.fromDate)
      const toDate = new Date(filter.toDate)

      if (fromDate > toDate) {
        newErrors.dateRange = "From Date cannot be after To Date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user changes input
    if (errors[name] || errors.dateRange) {
      setErrors({})
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      generateReport()
    } else {
      toast.error("Please fix the errors in the form")
    }
  }

  const generateReport = () => {
    setLoading(true)

    // This will be replaced with an actual API call
    setTimeout(() => {
      const mockReport = [
        {
          id: 1,
          name: "John Doe",
          studentId: "STU001",
          class: "5",
          section: "A",
          vaccineName: "Polio",
          dateAdministered: "2023-05-15",
        },
        {
          id: 2,
          name: "Emily Brown",
          studentId: "STU004",
          class: "6",
          section: "B",
          vaccineName: "MMR",
          dateAdministered: "2023-05-18",
        },
        {
          id: 3,
          name: "Sarah Taylor",
          studentId: "STU006",
          class: "7",
          section: "B",
          vaccineName: "Hepatitis B",
          dateAdministered: "2023-05-20",
        },
        {
          id: 4,
          name: "Olivia Thomas",
          studentId: "STU008",
          class: "8",
          section: "B",
          vaccineName: "Tetanus",
          dateAdministered: "2023-05-10",
        },
      ]

      // Apply filters
      const filteredReport = mockReport.filter((record) => {
        const matchesVaccine = filter.vaccineName ? record.vaccineName === filter.vaccineName : true
        const matchesClass = filter.class ? record.class === filter.class : true

        let matchesDateRange = true
        if (filter.fromDate || filter.toDate) {
          const recordDate = new Date(record.dateAdministered)

          if (filter.fromDate) {
            const fromDate = new Date(filter.fromDate)
            if (recordDate < fromDate) matchesDateRange = false
          }

          if (filter.toDate) {
            const toDate = new Date(filter.toDate)
            if (recordDate > toDate) matchesDateRange = false
          }
        }

        return matchesVaccine && matchesClass && matchesDateRange
      })

      setReport(filteredReport)
      setLoading(false)

      if (filteredReport.length === 0) {
        toast.info("No records found matching your criteria")
      } else {
        toast.success(`Generated report with ${filteredReport.length} records`)
      }
    }, 1000)
  }

  const downloadCSV = () => {
    if (report.length === 0) {
      toast.error("No data to download")
      return
    }

    // Create CSV header
    let csv = "Name,Student ID,Class,Section,Vaccine Name,Date Administered\n"

    // Add data rows
    report.forEach((row) => {
      const dateAdministered = new Date(row.dateAdministered).toLocaleDateString()
      csv += `${row.name},${row.studentId},${row.class},${row.section},${row.vaccineName},${dateAdministered}\n`
    })

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "vaccination_report.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    toast.success("Report downloaded successfully")
  }

  return (
    <div>
      <h2 className="page-title">Vaccination Reports</h2>

      <div className="filters-container">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="report-form-row">
            <div className="filter-group">
              <label>Vaccine Name</label>
              <select
                name="vaccineName"
                value={filter.vaccineName}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">All Vaccines</option>
                {vaccines.map((vaccine) => (
                  <option key={vaccine} value={vaccine}>
                    {vaccine}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filter.fromDate}
                onChange={handleFilterChange}
                className={`form-control ${errors.dateRange ? "input-error" : ""}`}
              />
            </div>

            <div className="filter-group">
              <label>To Date</label>
              <input
                type="date"
                name="toDate"
                value={filter.toDate}
                onChange={handleFilterChange}
                className={`form-control ${errors.dateRange ? "input-error" : ""}`}
              />
            </div>

            <div className="filter-group">
              <label>Class</label>
              <select name="class" value={filter.class} onChange={handleFilterChange} className="form-control">
                <option value="">All Classes</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errors.dateRange && <div className="error-message">{errors.dateRange}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-generate-report" disabled={loading}>
              <i className="fas fa-search"></i> Generate Report
            </button>
          </div>
        </form>
      </div>

      <div className="upcoming-drives">
        <div className="section-header">
          <h3>Vaccination Report</h3>
          {report.length > 0 && (
            <button onClick={downloadCSV} className="btn btn-secondary">
              <i className="fas fa-download"></i> Download CSV
            </button>
          )}
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <span>Generating report...</span>
            </div>
          ) : report.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Class</th>
                  <th>Section</th>
                  <th>Vaccine Name</th>
                  <th>Date Administered</th>
                </tr>
              </thead>
              <tbody>
                {report.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.studentId}</td>
                    <td>Class {row.class}</td>
                    <td>{row.section}</td>
                    <td>{row.vaccineName}</td>
                    <td>{new Date(row.dateAdministered).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              <p>No report data available</p>
              <p className="text-sm text-gray-400">Use the filters above to generate a report</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
