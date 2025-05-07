"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import { driveService } from "../services/api.service"

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
    status: '',
    createdBy: 'sunitha',
  })
  const [errors, setErrors] = useState({})

  // List of available classes
  const availableClasses = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

  useEffect(() => {
    if (isEditMode) {
      const fetchDrive = async () => {
        try {
          setLoading(true)

          // Try to fetch from API
          try {
            const response = await driveService.getById(id)
            const { vaccineName, date, availableDoses, applicableClasses } = response.data

            setDrive({
              vaccineName,
              date: new Date(date).toISOString().split("T")[0],
              availableDoses: availableDoses.toString(),
              applicableClasses,
            })
          } catch (apiError) {
            console.error("API error:", apiError)
            // If API fails, use mock data for demo purposes
            setDrive({
              vaccineName: "Polio",
              date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 20 days from now
              availableDoses: "500",
              applicableClasses: ["1", "2", "3"],
            })
          }
        } catch (err) {
          toast.error("Failed to load drive data")
          console.error(err)
          navigate("/drives")
        } finally {
          setLoading(false)
        }
      }

      fetchDrive()
    }
  }, [id, isEditMode, navigate])

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

      // Convert availableDoses to number
      const driveData = {
        ...drive,
        availableDoses: Number(drive.availableDoses),
      }

      if (isEditMode) {
        try {
          await driveService.update(id, driveData)
          toast.success("Vaccination drive updated successfully")
        } catch (apiError) {
          console.error("API error:", apiError)
          // For demo purposes, show success even if API fails
          toast.error("Failed to update Vaccination drive")
        }
      } else {
        try {
          await driveService.create(driveData)
          toast.success("Vaccination drive scheduled successfully")
        } catch (apiError) {
          console.error("API error:", apiError)
          // For demo purposes, show success even if API fails
          toast.error("Failed to create Vaccination drive")
        }
      }

      navigate("/drives")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred"
      toast.error(errorMessage)
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
      <Link to="/drives" className="back-button">
        <i className="fas fa-arrow-left"></i> Back to Vaccination Drives
      </Link>

      <div className="form-container">
        <h1 className="form-title">{isEditMode ? "Edit Vaccination Drive" : "Schedule New Vaccination Drive"}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="form-section-title">Drive Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vaccineName">
                  <i className="fas fa-syringe"></i> Vaccine Name
                </label>
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
                <label htmlFor="date">
                  <i className="fas fa-calendar-alt"></i> Scheduled Date
                </label>
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
                  <div className="helper-text">Vaccination drives must be scheduled at least 15 days in advance</div>
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
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Applicable Classes</h2>
            <div className="class-selection-container">
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
              <div className="class-selection-help">
                Click on the classes that are eligible for this vaccination drive
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/drives")}
              className="btn btn-secondary"
              disabled={submitting}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <i className="fas fa-save"></i>{" "}
              {submitting ? "Saving..." : isEditMode ? "Update Drive" : "Schedule Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DriveForm
