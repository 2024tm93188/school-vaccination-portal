"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { driveService } from "../services/api.service"

const VaccinationDrives = () => {
  // Default hardcoded drives as fallback
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: "",
    upcoming: false,
  })

  useEffect(() => {
    // Fetch vaccination drives from API
    const fetchDrives = async () => {
      try {
        setLoading(true)
        const params = {
          status: filter.status || undefined,
          upcoming: filter.upcoming || undefined,
        }

        const response = await driveService.getAll(params)

        if (response && response.data && response.data.drives) {
          // Map API response to match the expected format
          const mappedDrives = response.data.drives.map((drive) => ({
            id: drive._id,
            vaccineName: drive.vaccineName,
            date: drive.date,
            availableDoses: drive.availableDoses,
            applicableClasses: drive.applicableClasses,
            status: drive.status,
            // Keep the original data for reference
            _original: drive,
          }))

          setDrives(mappedDrives)
        }
      } catch (error) {
        console.error("Error fetching vaccination drives:", error)
        // Silently fall back to default data
        console.log("Using default drive data")

        // Filter the default data based on filters
        const filteredDefaultDrives = defaultDrives.filter((drive) => {
          // Filter by status
          const matchesStatus = filter.status ? drive.status === filter.status : true

          // Filter by upcoming
          const matchesUpcoming = filter.upcoming
            ? new Date(drive.date) > new Date() && drive.status === "Scheduled"
            : true

          return matchesStatus && matchesUpcoming
        })

        setDrives(filteredDefaultDrives)
      } finally {
        setLoading(false)
      }
    }

    fetchDrives()
  }, [filter])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUpcomingToggle = () => {
    setFilter((prev) => ({
      ...prev,
      upcoming: !prev.upcoming,
    }))
  }

  const getDriveStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "vaccinated"
      case "Completed":
        return "vaccinated"
      case "Cancelled":
        return "not-vaccinated"
      default:
        return ""
    }
  }

  if (loading) {
    return <div className="loading">Loading vaccination drives...</div>
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Vaccination Drives</h2>
        <Link to="/drives/add" className="btn btn-primary">
          <i className="fas fa-plus"></i> Schedule New Drive
        </Link>
      </div>

      <div className="filters-container">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Status:</label>
            <select name="status" value={filter.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <button
              onClick={handleUpcomingToggle}
              className={`btn ${filter.upcoming ? "btn-primary" : "btn-secondary"}`}
            >
              <i className="fas fa-calendar-alt"></i> {filter.upcoming ? "Showing Upcoming" : "Show Upcoming"}
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        {drives.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Date</th>
                <th>Available Doses</th>
                <th>Applicable Classes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.id}>
                  <td>{drive.vaccineName}</td>
                  <td>{new Date(drive.date).toLocaleDateString()}</td>
                  <td>{drive.availableDoses}</td>
                  <td>{drive.applicableClasses.join(", ")}</td>
                  <td>
                    <span className={`status-badge ${getDriveStatusClass(drive.status)}`}>{drive.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/drives/${drive.id}`} className="btn btn-sm btn-info">
                        <i className="fas fa-eye"></i>
                      </Link>
                      {drive.status === "Scheduled" && (
                        <Link to={`/drives/edit/${drive.id}`} className="btn btn-sm btn-edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No vaccination drives found matching your filters.</p>
            <Link to="/drives/add" className="btn btn-primary">
              <i className="fas fa-plus"></i> Schedule New Drive
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VaccinationDrives
