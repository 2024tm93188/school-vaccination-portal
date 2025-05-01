"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { studentService } from "../services/api.service"
import Spinner from "../components/Spinner"

const StudentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [student, setStudent] = useState({
    name: "",
    studentId: "",
    class: "",
    section: "",
    age: "",
    gender: "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setLoading(true)
          const response = await studentService.getById(id)
          const { name, studentId, class: studentClass, section, age, gender } = response.data

          setStudent({
            name,
            studentId,
            class: studentClass,
            section,
            age,
            gender,
          })
        } catch (err) {
          toast.error("Failed to load student data")
          console.error(err)
          navigate("/students")
        } finally {
          setLoading(false)
        }
      }

      fetchStudent()
    }
  }, [id, isEditMode, navigate])

  const validateForm = () => {
    const newErrors = {}

    if (!student.name.trim()) newErrors.name = "Name is required"
    if (!student.studentId.trim()) newErrors.studentId = "Student ID is required"
    if (!student.class) newErrors.class = "Class is required"
    if (!student.section) newErrors.section = "Section is required"

    if (!student.age) {
      newErrors.age = "Age is required"
    } else if (isNaN(student.age) || Number.parseInt(student.age) < 3 || Number.parseInt(student.age) > 20) {
      newErrors.age = "Age must be between 3 and 20"
    }

    if (!student.gender) newErrors.gender = "Gender is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    try {
      setSubmitting(true)

      if (isEditMode) {
        await studentService.update(id, student)
        toast.success("Student updated successfully")
      } else {
        await studentService.create(student)
        toast.success("Student added successfully")
      }

      navigate("/students")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Student" : "Add New Student"}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter student's full name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={student.studentId}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.studentId ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter student ID"
                disabled={isEditMode}
              />
              {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId}</p>}
              {isEditMode && <p className="mt-1 text-xs text-gray-500">Student ID cannot be changed</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                name="class"
                value={student.class}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.class ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString()}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
              {errors.class && <p className="mt-1 text-xs text-red-500">{errors.class}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                name="section"
                value={student.section}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.section ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              {errors.section && <p className="mt-1 text-xs text-red-500">{errors.section}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={student.age}
                onChange={handleChange}
                min="3"
                max="20"
                className={`block w-full px-3 py-2 border ${errors.age ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter age"
              />
              {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={student.gender}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : isEditMode ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm
