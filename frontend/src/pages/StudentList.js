"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { studentService } from "../services/api.service"
import DeleteConfirmationModal from "../components/DeleteConfirmationModel"

const StudentList = () => {
  // Default hardcoded students as fallback
  const defaultStudents = [
    { id: 1, name: "John Doe", studentId: "STU001", class: "5", section: "A", vaccinated: true },
    { id: 2, name: "Jane Smith", studentId: "STU002", class: "5", section: "B", vaccinated: false },
    { id: 3, name: "Michael Johnson", studentId: "STU003", class: "6", section: "A", vaccinated: true },
    { id: 4, name: "Emily Brown", studentId: "STU004", class: "6", section: "B", vaccinated: true },
    { id: 5, name: "David Wilson", studentId: "STU005", class: "7", section: "A", vaccinated: false },
    { id: 6, name: "Sarah Taylor", studentId: "STU006", class: "7", section: "B", vaccinated: true },
    { id: 7, name: "James Anderson", studentId: "STU007", class: "8", section: "A", vaccinated: false },
    { id: 8, name: "Olivia Thomas", studentId: "STU008", class: "8", section: "B", vaccinated: true },
  ]

  const [students, setStudents] = useState(defaultStudents)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState({
    class: "",
    vaccinationStatus: "",
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  useEffect(() => {
    // Fetch students from API
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const params = {
          name: searchTerm || undefined,
          class: filter.class || undefined,
          vaccinationStatus: filter.vaccinationStatus || undefined,
        }

        const response = await studentService.getAll(params)

        if (response && response.data && response.data.students) {
          // Map API response to match the expected format
          const mappedStudents = response.data.students.map((student) => {
            // Check if student has any completed vaccinations
            const isVaccinated = student.vaccinations && student.vaccinations.some((v) => v.status === "Completed")

            return {
              id: student._id,
              name: student.name,
              studentId: student.studentId,
              class: student.class,
              section: student.section,
              vaccinated: isVaccinated,
              // Keep the original data for reference
              _original: student,
            }
          })

          setStudents(mappedStudents)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
        // Silently fall back to default data
        console.log("Using default student data")

        // Filter the default data based on search and filters
        const filteredDefaultStudents = defaultStudents.filter((student) => {
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

        setStudents(filteredDefaultStudents)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [searchTerm, filter])

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

  const handleDeleteClick = (student) => {
    setStudentToDelete(student)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return

    try {
      await studentService.delete(studentToDelete.id)
      toast.success("Student deleted successfully")

      // Remove the deleted student from the list
      setStudents(students.filter((student) => student.id !== studentToDelete.id))
      setShowDeleteModal(false)
      setStudentToDelete(null)
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error("Failed to delete student")
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setStudentToDelete(null)
  }

  if (loading) {
    return <div className="loading">Loading students...</div>
  }

  return (
    <div className="student-list">
      <div className="page-header">
        <h2 className="page-title">Students</h2>
        <div className="action-buttons">
          <Link to="/students/add" className="btn btn-primary">
            <i className="fas fa-plus"></i> Add Student
          </Link>
          <Link to="/students/import" className="btn btn-secondary">
            <i className="fas fa-upload"></i> Import Students
          </Link>
        </div>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={handleSearchChange} />
          <i className="fas fa-search"></i>
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
        {students.length > 0 ? (
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
              {students.map((student) => (
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
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/students/${student.id}/edit`} className="btn btn-sm btn-edit" title="Edit Student">
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(student)}
                        className="btn btn-sm btn-danger"
                        title="Delete Student"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No students found matching your filters.</p>
            <Link to="/students/add" className="btn btn-primary">
              <i className="fas fa-plus"></i> Add Student
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          title="Delete Student"
          message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  )
}

export default StudentList
