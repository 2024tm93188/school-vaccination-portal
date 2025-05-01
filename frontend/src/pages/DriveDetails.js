"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FaEdit, FaCheckCircle, FaTimes, FaSyringe, FaArrowLeft, FaEye } from "react-icons/fa"
import Spinner from "../components/Spinner"

const DriveDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [drive, setDrive] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [studentLoading, setStudentLoading] = useState(true)
  const [filter, setFilter] = useState({
    status: "",
  })

  useEffect(() => {
    // Simulate API call to fetch drive details
    setTimeout(() => {
      const mockDrive = {
        id: Number.parseInt(id),
        vaccineName: "Polio",
        date: "2023-06-15",
        availableDoses: 500,
        applicableClasses: ["1", "2", "3"],
        status: "Scheduled",
        createdBy: { username: "admin" },
        createdAt: "2023-05-01T12:00:00Z",
      }

      setDrive(mockDrive)
      setLoading(false)

      // Simulate API call to fetch students for this drive
      setTimeout(() => {
        const mockStudents = [
          {
            id: 1,
            name: "John Doe",
            studentId: "STU001",
            class: "1",
            section: "A",
            vaccinations: [{ drive: Number.parseInt(id), status: "Completed" }],
          },
          {
            id: 2,
            name: "Jane Smith",
            studentId: "STU002",
            class: "1",
            section: "B",
            vaccinations: [{ drive: Number.parseInt(id), status: "Scheduled" }],
          },
          {
            id: 3,
            name: "Michael Johnson",
            studentId: "STU003",
            class: "2",
            section: "A",
            vaccinations: [{ drive: Number.parseInt(id), status: "Missed" }],
          },
          {
            id: 4,
            name: "Emily Brown",
            studentId: "STU004",
            class: "3",
            section: "B",
            vaccinations: [{ drive: Number.parseInt(id), status: "Scheduled" }],
          },
        ]

        setStudents(mockStudents)
        setStudentLoading(false)
      }, 500)
    }, 1000)
  }, [id])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCompleteDrive = async () => {
    if (!window.confirm("Are you sure you want to mark this drive as completed? This action cannot be undone.")) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDrive((prev) => ({
        ...prev,
        status: "Completed",
      }))

      toast.success("Vaccination drive marked as completed")
    } catch (err) {
      toast.error("An error occurred")
      console.error(err)
    }
  }

  const handleCancelDrive = async () => {
    if (!window.confirm("Are you sure you want to cancel this drive? This action cannot be undone.")) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDrive((prev) => ({
        ...prev,
        status: "Cancelled",
      }))

      toast.success("Vaccination drive cancelled")
    } catch (err) {
      toast.error("An error occurred")
      console.error(err)
    }
  }

  const handleVaccinateStudent = async (studentId) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update student vaccination status
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id === studentId) {
            return {
              ...student,
              vaccinations: student.vaccinations.map((v) => {
                if (v.drive === Number.parseInt(id)) {
                  return { ...v, status: "Completed" }
                }
                return v
              }),
            }
          }
          return student
        }),
      )

      // Update available doses
      setDrive((prev) => ({
        ...prev,
        availableDoses: prev.availableDoses - 1,
      }))

      toast.success("Student vaccinated successfully")
    } catch (err) {
      toast.error("An error occurred")
      console.error(err)
    }
  }

  const filteredStudents = students.filter((student) => {
    if (!filter.status) return true

    const vaccinationRecord = student.vaccinations.find((v) => v.drive === Number.parseInt(id))
    return vaccinationRecord && vaccinationRecord.status === filter.status
  })

  if (loading) {
    return <Spinner />
  }

  if (!drive) {
    return <div className="no-data">Drive not found</div>
  }

  const isScheduled = drive.status === "Scheduled"
  const isPastDrive = new Date(drive.date) < new Date()
  const canEdit = isScheduled && !isPastDrive

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => navigate("/drives")} className="btn btn-secondary">
          <FaArrowLeft className="mr-2" /> Back to Drives
        </button>
      </div>

      <div className="page-header">
        <h2 className="page-title">Vaccination Drive Details</h2>
        <div className="action-buttons">
          {canEdit && (
            <Link to={`/drives/edit/${id}`} className="btn btn-primary">
              <FaEdit className="mr-2" /> Edit Drive
            </Link>
          )}
          {isScheduled && (
            <>
              <button onClick={handleCompleteDrive} className="btn btn-success">
                <FaCheckCircle className="mr-2" /> Mark as Completed
              </button>
              <button onClick={handleCancelDrive} className="btn btn-danger">
                <FaTimes className="mr-2" /> Cancel Drive
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Drive Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Vaccine Name</p>
                <p className="mt-1 text-sm text-gray-900">{drive.vaccineName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(drive.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1">
                  <span
                    className={`status-badge ${
                      drive.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : drive.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {drive.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Available Doses</p>
                <p className="mt-1 text-sm text-gray-900">{drive.availableDoses}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>
            <div>
              <p className="text-sm font-medium text-gray-500">Applicable Classes</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {drive.applicableClasses.map((classValue) => (
                  <span
                    key={classValue}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    Class {classValue}
                  </span>
                ))}
              </div>
            </div>
            {drive.createdBy && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Created By</p>
                <p className="mt-1 text-sm text-gray-900">{drive.createdBy.username}</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-sm text-gray-900">{new Date(drive.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label>Vaccination Status:</label>
          <select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="Completed">Vaccinated</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {studentLoading ? (
          <div className="loading">Loading students...</div>
        ) : filteredStudents.length > 0 ? (
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
              {filteredStudents.map((student) => {
                // Find vaccination record for this drive
                const vaccinationRecord = student.vaccinations.find((v) => v.drive === Number.parseInt(id))
                const vaccinationStatus = vaccinationRecord ? vaccinationRecord.status : "Not Scheduled"

                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.studentId}</td>
                    <td>Class {student.class}</td>
                    <td>{student.section}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          vaccinationStatus === "Completed"
                            ? "vaccinated"
                            : vaccinationStatus === "Missed"
                              ? "not-vaccinated"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vaccinationStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/students/${student.id}`} className="btn btn-sm btn-info">
                          <FaEye />
                        </Link>
                        {isScheduled && vaccinationStatus !== "Completed" && drive.availableDoses > 0 && (
                          <button
                            onClick={() => handleVaccinateStudent(student.id)}
                            className="btn btn-sm btn-vaccinate"
                            title="Vaccinate Student"
                          >
                            <FaSyringe />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <p>No students found for this vaccination drive.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DriveDetails
