"use client";

export default function Error() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-red-600">
          Something went wrong!
        </h1>
        <p className="mt-2 text-gray-600">
          An unexpected error has occurred. Please try again later.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
