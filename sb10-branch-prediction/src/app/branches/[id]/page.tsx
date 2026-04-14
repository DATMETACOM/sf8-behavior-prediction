import { notFound } from "next/navigation";
import Link from "next/link";
import { BRANCHES, getBranchTraffic, generateHourlyForecast } from "@/lib/data";
import { BranchInfoCard, BestTimeBadge, ForecastChart, CheckInButton } from "@/components";

interface PageProps {
  params: { id: string };
}

export default function BranchDetailPage({ params }: PageProps) {
  const branch = BRANCHES.find((b) => b.id === params.id);

  if (!branch) {
    notFound();
  }

  const trafficHistory = getBranchTraffic(branch.id, 7);
  const today = new Date().toISOString().split("T")[0];

  // Mock hourly forecast
  const hourlyForecast = generateHourlyForecast();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-blue-200 hover:text-white mb-2 inline-block">
            ← Quay lại Dashboard
          </Link>
          <h1 className="text-xl font-bold">{branch.name}</h1>
          <p className="text-blue-200 text-sm">{branch.address}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Branch Info Card */}
        <BranchInfoCard branch={branch} />

        {/* Best Time Recommendation */}
        <BestTimeBadge hourlyForecast={hourlyForecast} />

        {/* Hourly Forecast Chart */}
        <ForecastChart hourlyForecast={hourlyForecast} targetDate={today} />

        {/* Check-in Simulation */}
        <CheckInButton branchId={branch.id} />

        {/* Qwen AI Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm">
            <span className="text-lg">🤖</span>
            <span>Dự báo được cung cấp bởi <strong>Qwen AI</strong></span>
          </div>
        </div>
      </main>
    </div>
  );
}
