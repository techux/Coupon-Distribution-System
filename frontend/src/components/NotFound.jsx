import React from 'react'

const NotFound = () => {
  return (
    <div className="flex justify-center items-center mt-28 mb-72">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404: Page Not Found</h1>
        <h3 className="text-xl text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</h3>
        <p className="text-sm text-gray-500">You can go back to the homepage </p>
      </div>
    </div>
  )
}

export default NotFound
