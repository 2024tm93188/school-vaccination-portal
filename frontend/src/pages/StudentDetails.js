"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FaEdit, FaSyringe, FaArrowLeft } from "react-icons/fa"
import { studentService, driveService } from "../services/api.service"
import Spinner from "../components/Spinner"

const StudentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upcomingDrives, setUpcomingDrives] = useState([])
  const [loadingDrives, setLoadingDrives] = useState(true)
  const [selectedDrive, setSelectedDrive] = useState("")
  const [vaccinating, setVaccinating] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await studentService.getById(id)
        setStudent(response.data)
      } catch (err) {
        toast.error("Failed to load student data")
        console.error(err)
        navigate("/students")
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id, navigate])

  useEffect(() => {
    const fetchUpcomingDrives = async () => {
      if (!student) return

      try {
        setLoadingDrives(true)
        const response = await driveService.getAll({ upcoming: true })

        // Filter drives applicable to student's class
        const applicableDrives = response.data.drives.filter((drive) => drive.applicableClasses.includes(student.class))

        setUpcomingDrives(applicableDrives)
      } catch (err) {
        console.error("Failed to load upcoming drives:", err)
      } finally {
        setLoadingDrives(false)
      }
    }

    if (student) {
      fetchUpcomingDrives()
    }
  }, [student])

  const handleVaccinate = async () => {
    if (!selectedDrive) {
      toast.error("Please select a vaccination drive")
      return
    }

    try {
      setVaccinating(true)
      await studentService.vaccinate(id, selectedDrive)
      toast.success("Student vaccinated successfully")

      // Refresh student data
      const response = await studentService.getById(id)
      setStudent(response.data)

      // Reset selection
      setSelectedDrive("")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to vaccinate student"
      toast.error(errorMessage)
    } finally {
      setVaccinating(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (!student) {
    return <div>Student not found</div>
  }

  // Check if student has any vaccinations
  const hasVaccinations = student.vaccinations && student.vaccinations.length > 0

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate("/students")}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Students
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Details</h1>

        <Link
          to={`/students/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaEdit className="mr-2" />
          Edit Student
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-sm text-gray-900">{student.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Student ID</p>
                <p className="mt-1 text-sm text-gray-900">{student.studentId}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p className="mt-1 text-sm text-gray-900">{student.age} years</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Class</p>
                <p className="mt-1 text-sm text-gray-900">Class {student.class}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Section</p>
                <p className="mt-1 text-sm text-gray-900">{student.section}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination History */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Vaccination History</h2>
        </div>

        {hasVaccinations ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vaccine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Administered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.vaccinations.map((vaccination, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vaccination.vaccineName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vaccination.dateAdministered
                          ? new Date(vaccination.dateAdministered).toLocaleDateString()
                          : "Not administered yet"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vaccination.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : vaccination.status === "Missed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {vaccination.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No vaccination records found for this student</p>
          </div>
        )}
      </div>

      {/* Vaccinate Student */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Vaccinate Student</h2>

        {loadingDrives ? (
          <div className="text-center py-4">
            <div className="spinner"></div>
            <p className="mt-2 text-gray-500">Loading available vaccination drives...</p>
          </div>
        ) : upcomingDrives.length > 0 ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Vaccination Drive</label>
              <select
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a drive</option>
                {upcomingDrives.map((drive) => (
                  <option key={drive._id} value={drive._id}>
                    {drive.vaccineName} - {new Date(drive.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleVaccinate}
              disabled={!selectedDrive || vaccinating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSyringe className="mr-2" />
              {vaccinating ? "Vaccinating..." : "Vaccinate Student"}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No upcoming vaccination drives available for this student's class</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentDetails