// src/pages/SuccessPage.js

import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-green-700">
          Payment Successful!
        </h1>
        <p className="mt-4 text-gray-600">
          Your payment was processed successfully. Thank you for your
          transaction!
        </p>
        <Link
          to="/"
          className="mt-6 inline-block bg-green-600 text-white rounded-lg px-4 py-2"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
