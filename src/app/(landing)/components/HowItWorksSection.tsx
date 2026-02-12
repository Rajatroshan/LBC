'use client';

const steps = [
  {
    number: '01',
    title: 'Admin Creates Festival',
    description: 'Set up a new festival with dates and contribution amounts',
    icon: '🎪',
    color: 'from-primary-500 to-primary-600',
  },
  {
    number: '02',
    title: 'Families Contribute',
    description: 'Community members make their festival contributions',
    icon: '💵',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '03',
    title: 'Amount is Recorded',
    description: 'All payments are logged in real-time with timestamps',
    icon: '📝',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: '04',
    title: 'Receipts Generated',
    description: 'Instant digital receipts for every transaction',
    icon: '🧾',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    number: '05',
    title: 'Everyone Can View',
    description: 'Full transparency with accessible reports for all',
    icon: '👀',
    color: 'from-green-500 to-green-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple steps to digital festival management
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-300 via-secondary-300 to-green-300 -z-10"></div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Number Badge */}
                    <div
                      className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="text-5xl mb-4 text-center">
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for Mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <svg
                        className="w-6 h-6 text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
