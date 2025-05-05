"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaPlus, FaUpload, FaSearch, FaEdit, FaEye, FaUserGraduate } from "react-icons/fa"
import Spinner from "../components/Spinner"

const StudentList = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState({
    class: "",
    vaccinationStatus: "",
  })

  useEffect(() => {
    // Simulate API call to fetch students
    setTimeout(() => {
      const mockStudents = [
        { id: 1, name: "John Doe", studentId: "STU001", class: "5", section: "A", vaccinated: true },
        { id: 2, name: "Jane Smith", studentId: "STU002", class: "5", section: "B", vaccinated: false },
        { id: 3, name: "Michael Johnson", studentId: "STU003", class: "6", section: "A", vaccinated: true },
        { id: 4, name: "Emily Brown", studentId: "STU004", class: "6", section: "B", vaccinated: true },
        { id: 5, name: "David Wilson", studentId: "STU005", class: "7", section: "A", vaccinated: false },
        { id: 6, name: "Sarah Taylor", studentId: "STU006", class: "7", section: "B", vaccinated: true },
        { id: 7, name: "James Anderson", studentId: "STU007", class: "8", section: "A", vaccinated: false },
        { id: 8, name: "Olivia Thomas", studentId: "STU008", class: "8", section: "B", vaccinated: true },
      ]
      setStudents(mockStudents)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filteredStudents = students.filter((student) => {
    // Filter by search term
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by class
    const matchesClass = filter.class ? student.class === filter.class : true

    // Filter by vaccination status
    const matchesVaccinationStatus =
      filter.vaccinationStatus === ""
        ? true
        : filter.vaccinationStatus === "vaccinated"
          ? student.vaccinated
          : !student.vaccinated

    return matchesSearch && matchesClass && matchesVaccinationStatus
  })

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="student-list">
      <div className="page-header">
        <h2 className="page-title">Students</h2>
        <div className="action-buttons">
          <Link to="/students/add" className="btn btn-primary">
            <FaPlus className="mr-2" /> Add Student
          </Link>
          <Link to="/students/import" className="btn btn-secondary">
            <FaUpload className="mr-2" /> Import Students
          </Link>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={handleSearchChange} />
          <FaSearch className="search-icon" />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Class:</label>
            <select name="class" value={filter.class} onChange={handleFilterChange}>
              <option value="">All Classes</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Vaccination Status:</label>
            <select name="vaccinationStatus" value={filter.vaccinationStatus} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="vaccinated">Vaccinated</option>
              <option value="not-vaccinated">Not Vaccinated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        {filteredStudents.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Class</th>
                <th>Section</th>
                <th>Vaccination Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                  <td>Class {student.class}</td>
                  <td>{student.section}</td>
                  <td>
                    <span className={`status-badge ${student.vaccinated ? "vaccinated" : "not-vaccinated"}`}>
                      {student.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/students/${student.id}`} className="btn btn-sm btn-info" title="View Details">
                        <FaEye />
                      </Link>
                      <Link to={`/students/${student.id}/edit`} className="btn btn-sm btn-edit" title="Edit Student">
                        <FaEdit />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaUserGraduate size={48} />
            </div>
            <h3 className="empty-state-title">No Students Found</h3>
            <p className="empty-state-message">No students match your current filters.</p>
            <div className="empty-state-actions">
              <Link to="/students/add" className="btn btn-primary">
                <FaPlus className="mr-2" /> Add Student
              </Link>
              <Link to="/students/import" className="btn btn-secondary ml-3">
                <FaUpload className="mr-2" /> Import Students
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentList
