// src/pages/FailurePage.js

import { Link } from "react-router-dom";

const FailurePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-red-700">Payment Failed!</h1>
        <p className="mt-4 text-gray-600">
          Unfortunately, your payment could not be processed. Please try again
          later.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-red-600 text-white rounded-lg px-4 py-2"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default FailurePage;
