import React from "react"

export const FormActions = () => (
  <div className="pt-5">
    <div className="flex justify-end gap-3">
      <button
        type="button"
        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        Create Course
      </button>
    </div>
  </div>
)