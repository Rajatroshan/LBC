'use client';

export default function WhoIsThisForSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-green-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Who Is This For?
          </h2>
          <p className="text-xl text-gray-600">
            Designed for both administrators and community members
          </p>
        </div>

        {/* Split Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Admin */}
          <div className="bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-6xl shadow-lg">
                👤
              </div>
            </div>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Admin
            </h3>
            <p className="text-lg text-gray-600 text-center mb-6">
              Manage families, festivals, and payments with ease
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Create and manage family records
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Track contributions and payments
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Generate reports and receipts
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-primary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Manage festival schedules
                </span>
              </li>
            </ul>
          </div>

          {/* Community Members */}
          <div className="bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center text-6xl shadow-lg">
                👥
              </div>
            </div>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Community Members
            </h3>
            <p className="text-lg text-gray-600 text-center mb-6">
              View contributions and stay informed transparently
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  View family contribution history
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Access payment receipts anytime
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Check festival calendars
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-secondary-500 mr-3 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Stay updated with notifications
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
