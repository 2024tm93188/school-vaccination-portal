"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const DriveForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [drive, setDrive] = useState({
    vaccineName: "",
    date: "",
    availableDoses: "",
    applicableClasses: [],
  })
  const [errors, setErrors] = useState({})

  // List of available classes
  const availableClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

  useEffect(() => {
    if (isEditMode) {
      // Simulate API call to fetch drive data
      setTimeout(() => {
        // Mock data for editing
        const mockDrive = {
          id: Number.parseInt(id),
          vaccineName: "Polio",
          date: "2023-06-15",
          availableDoses: 500,
          applicableClasses: ["1", "2", "3"],
          status: "Scheduled",
        }

        setDrive({
          vaccineName: mockDrive.vaccineName,
          date: mockDrive.date,
          availableDoses: mockDrive.availableDoses.toString(),
          applicableClasses: mockDrive.applicableClasses,
        })

        setLoading(false)
      }, 1000)
    }
  }, [id, isEditMode])

  const validateForm = () => {
    const newErrors = {}

    if (!drive.vaccineName.trim()) newErrors.vaccineName = "Vaccine name is required"

    if (!drive.date) {
      newErrors.date = "Date is required"
    } else {
      // Check if date is at least 15 days in the future
      const selectedDate = new Date(drive.date)
      const minDate = new Date()
      minDate.setDate(minDate.getDate() + 15)

      if (selectedDate < minDate) {
        newErrors.date = "Vaccination drive must be scheduled at least 15 days in advance"
      }
    }

    if (!drive.availableDoses) {
      newErrors.availableDoses = "Available doses is required"
    } else if (isNaN(drive.availableDoses) || Number.parseInt(drive.availableDoses) < 1) {
      newErrors.availableDoses = "Available doses must be at least 1"
    }

    if (drive.applicableClasses.length === 0) {
      newErrors.applicableClasses = "At least one class must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDrive((prev) => ({
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

  const handleClassToggle = (classValue) => {
    setDrive((prev) => {
      const isSelected = prev.applicableClasses.includes(classValue)

      if (isSelected) {
        // Remove class if already selected
        return {
          ...prev,
          applicableClasses: prev.applicableClasses.filter((c) => c !== classValue),
        }
      } else {
        // Add class if not selected
        return {
          ...prev,
          applicableClasses: [...prev.applicableClasses, classValue],
        }
      }
    })

    // Clear applicable classes error if any class is selected
    if (errors.applicableClasses) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.applicableClasses
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(isEditMode ? "Vaccination drive updated successfully" : "Vaccination drive scheduled successfully")
      navigate("/drives")
    } catch (err) {
      toast.error("An error occurred")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading drive data...</div>
  }

  return (
    <div>
      <h1 className="page-title">{isEditMode ? "Edit Vaccination Drive" : "Schedule New Vaccination Drive"}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vaccineName">Vaccine Name</label>
            <input
              type="text"
              id="vaccineName"
              name="vaccineName"
              value={drive.vaccineName}
              onChange={handleChange}
              className={errors.vaccineName ? "input-error" : ""}
              placeholder="Enter vaccine name"
            />
            {errors.vaccineName && <div className="error-message">{errors.vaccineName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={drive.date}
              onChange={handleChange}
              className={errors.date ? "input-error" : ""}
              min={(() => {
                const minDate = new Date()
                minDate.setDate(minDate.getDate() + 15) // 15 days in advance
                return minDate.toISOString().split("T")[0]
              })()}
            />
            {errors.date ? (
              <div className="error-message">{errors.date}</div>
            ) : (
              <div className="help-text">Vaccination drives must be scheduled at least 15 days in advance</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="availableDoses">Available Doses</label>
            <input
              type="number"
              id="availableDoses"
              name="availableDoses"
              value={drive.availableDoses}
              onChange={handleChange}
              className={errors.availableDoses ? "input-error" : ""}
              min="1"
              placeholder="Enter number of available doses"
            />
            {errors.availableDoses && <div className="error-message">{errors.availableDoses}</div>}
          </div>

          <div className="form-group">
            <label>Applicable Classes</label>
            <div className="class-selection">
              {availableClasses.map((classValue) => (
                <button
                  key={classValue}
                  type="button"
                  onClick={() => handleClassToggle(classValue)}
                  className={`class-button ${drive.applicableClasses.includes(classValue) ? "selected" : ""}`}
                >
                  Class {classValue}
                </button>
              ))}
            </div>
            {errors.applicableClasses && <div className="error-message">{errors.applicableClasses}</div>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/drives")}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : isEditMode ? "Update Drive" : "Schedule Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DriveForm
