import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export function Dashboard() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <OnboardingLayout />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feed Categories */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Feed Categories</h2>
            {/* Category content */}
          </div>
  
          {/* Latest Articles */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Latest Articles</h2>
            {/* Articles content */}
          </div>
  
          {/* Integrations */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            {/* Integrations content */}
          </div>
        </div>
      </div>
    );
  }