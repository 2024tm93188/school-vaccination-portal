"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaUpload, FaDownload, FaInfoCircle } from "react-icons/fa"
import { API_URL } from "../config"

const StudentImport = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [importResults, setImportResults] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]

    if (selectedFile && selectedFile.type !== "text/csv") {
      toast.error("Please select a CSV file")
      return
    }

    setFile(selectedFile)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      toast.error("Please select a CSV file")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post(`${API_URL}/api/students/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setImportResults(res.data)
      toast.success(res.data.message)
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred during import"
      toast.error(errorMessage)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    // Create CSV content
    const csvContent =
      "name,studentId,class,section,age,gender\nJohn Doe,STU001,5,A,10,Male\nJane Smith,STU002,7,B,12,Female"

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "student_import_template.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Import Students</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-md mb-6">
          <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">Import Instructions</h3>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
              <li>Upload a CSV file with student data</li>
              <li>The CSV must include headers: name, studentId, class, section, age, gender</li>
              <li>Student IDs must be unique</li>
              <li>Download the template below for the correct format</li>
            </ul>
            <button
              onClick={downloadTemplate}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaDownload className="mr-1.5" />
              Download Template
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">CSV File</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV up to 10MB</p>
              </div>
            </div>
            {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" />
                  Import Students
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Import Results</h2>

          <div className="mb-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700">{importResults.message}</p>
            </div>
          </div>

          {importResults.errors && importResults.errors.length > 0 && (
            <div>
              <h3 className="font-medium text-red-800 mb-2">Errors</h3>
              <div className="border border-red-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-red-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Row
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-red-200">
                    {importResults.errors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {JSON.stringify(error.row)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{error.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Students List
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentImport
