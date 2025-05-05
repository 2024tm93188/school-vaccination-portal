"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaCalendarAlt, FaEye, FaEdit, FaSyringe } from "react-icons/fa"
import Spinner from "../components/Spinner"

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: "",
    upcoming: false,
  })

  useEffect(() => {
    // Simulate API call to fetch vaccination drives
    setTimeout(() => {
      const mockDrives = [
        {
          id: 1,
          vaccineName: "Polio",
          date: "2023-06-15",
          availableDoses: 500,
          applicableClasses: ["1", "2", "3"],
          status: "Scheduled",
        },
        {
          id: 2,
          vaccineName: "MMR",
          date: "2023-06-22",
          availableDoses: 300,
          applicableClasses: ["4", "5", "6"],
          status: "Scheduled",
        },
        {
          id: 3,
          vaccineName: "Hepatitis B",
          date: "2023-07-05",
          availableDoses: 400,
          applicableClasses: ["7", "8", "9"],
          status: "Scheduled",
        },
        {
          id: 4,
          vaccineName: "Tetanus",
          date: "2023-05-10",
          availableDoses: 0,
          applicableClasses: ["10", "11", "12"],
          status: "Completed",
        },
        {
          id: 5,
          vaccineName: "Influenza",
          date: "2023-05-20",
          availableDoses: 0,
          applicableClasses: ["1", "2", "3", "4"],
          status: "Cancelled",
        },
      ]
      setDrives(mockDrives)
      setLoading(false)
    }, 1000)
  }, [])

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

  const filteredDrives = drives.filter((drive) => {
    // Filter by status
    const matchesStatus = filter.status ? drive.status === filter.status : true

    // Filter by upcoming
    const isUpcoming = new Date(drive.date) > new Date()
    const matchesUpcoming = filter.upcoming ? isUpcoming && drive.status === "Scheduled" : true

    return matchesStatus && matchesUpcoming
  })

  const getDriveStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Vaccination Drives</h2>
        <Link to="/drives/add" className="btn btn-primary">
          <FaPlus className="mr-2" /> Schedule New Drive
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
              <FaCalendarAlt className="mr-2" /> {filter.upcoming ? "Showing Upcoming" : "Show Upcoming"}
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        {filteredDrives.length > 0 ? (
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
              {filteredDrives.map((drive) => (
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
                      <Link to={`/drives/${drive.id}`} className="btn btn-sm btn-info" title="View Details">
                        <FaEye />
                      </Link>
                      {drive.status === "Scheduled" && (
                        <Link to={`/drives/edit/${drive.id}`} className="btn btn-sm btn-edit" title="Edit Drive">
                          <FaEdit />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaSyringe size={48} />
            </div>
            <h3 className="empty-state-title">No Vaccination Drives Found</h3>
            <p className="empty-state-message">No vaccination drives match your current filters.</p>
            <div className="empty-state-actions">
              <Link to="/drives/add" className="btn btn-primary">
                <FaPlus className="mr-2" /> Schedule New Drive
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VaccinationDrives
