"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { reportService } from "../services/api.service"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    vaccinatedStudents: 0,
    vaccinationRate: 0,
    upcomingDrives: []  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await reportService.getDashboardStats()

        // If API call is successful, update the stats
        if (response && response.data) {
          setStats({
            ...stats, // Keep default values as fallback
            ...response.data, // Override with API data
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Don't show error toast to user, just use the default data
        console.log("Using default dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>
  }

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon students-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="stat-details">
            <h3>Total Students</h3>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon vaccinated-icon">
            <i className="fas fa-syringe"></i>
          </div>
          <div className="stat-details">
            <h3>Vaccinated Students</h3>
            <p className="stat-value">{stats.vaccinatedStudents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon rate-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="stat-details">
            <h3>Vaccination Rate</h3>
            <p className="stat-value">{stats.vaccinationRate}%</p>
          </div>
        </div>
      </div>

      <div className="upcoming-drives">
        <div className="section-header">
          <h3>Upcoming Vaccination Drives</h3>
          <Link to="/drives/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Schedule New Drive
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Date</th>
                <th>Available Doses</th>
                <th>Applicable Classes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.upcomingDrives.map((drive) => (
                <tr key={drive.id || drive._id}>
                  <td>{drive.vaccineName}</td>
                  <td>{new Date(drive.date).toLocaleDateString()}</td>
                  <td>{drive.availableDoses}</td>
                  <td>{drive.applicableClasses.join(", ")}</td>
                  <td>
                    <Link to={`/drives/${drive.id || drive._id}`} className="btn btn-sm btn-info">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
