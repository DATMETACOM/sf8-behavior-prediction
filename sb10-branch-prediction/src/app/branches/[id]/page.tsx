import { notFound } from "next/navigation";
import Link from "next/link";
import { BRANCHES, getBranchTraffic } from "@/lib/data";

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

  // Find best time to visit
  const bestHour = hourlyForecast
    .filter((h) => h.hour >= 9 && h.hour <= 16)
    .reduce((best, h) => (h.predictedWaitTime < best.predictedWaitTime ? h : best));

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
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Trạng thái</p>
              <p className="font-semibold text-lg mt-1">
                {branch.status === "open" ? "🟢 Mở cửa" : "🔴 Đóng cửa"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Giờ mở cửa</p>
              <p className="font-semibold text-lg mt-1">{branch.openTime} - {branch.closeTime}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Nhân viên</p>
              <p className="font-semibold text-lg mt-1">{branch.staffCount} người</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Thời gian chờ</p>
              <p className={`font-semibold text-lg mt-1 ${
                branch.congestionLevel === "high" ? "text-red-600" :
                branch.congestionLevel === "medium" ? "text-yellow-600" :
                "text-green-600"
              }`}>
                {branch.currentWaitTime} phút
              </p>
            </div>
          </div>
        </div>

        {/* Best Time Recommendation */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">⏰ Giờ vàng để đến</h2>
              <p className="text-green-100">
                Khung giờ thấp nhất: <span className="font-bold text-white text-xl">
                  {bestHour.hour}:00 - {bestHour.hour + 1}:00
                </span>
              </p>
              <p className="text-green-100 text-sm mt-1">
                Thời gian chờ ước tính: ~{bestHour.predictedWaitTime} phút
              </p>
            </div>
            <div className="text-5xl">✨</div>
          </div>
        </div>

        {/* Hourly Forecast Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Dự báo lưu lượng hôm nay ({today})
          </h2>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {hourlyForecast.map((hour) => (
              <div key={hour.hour} className="flex items-center gap-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {hour.hour}:00
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full rounded-full flex items-center justify-end pr-3 text-sm font-medium ${
                      hour.congestionLevel === "high"
                        ? "bg-red-500 text-white"
                        : hour.congestionLevel === "medium"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    style={{ width: `${Math.min(hour.predictedCustomers * 3, 100)}%` }}
                  >
                    {hour.predictedCustomers} khách
                  </div>
                </div>
                <div className="w-24 text-sm text-gray-600 text-right">
                  {hour.predictedWaitTime} phút
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm text-gray-600">Thấp (&lt;10 phút)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Trung bình (10-20 phút)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm text-gray-600">Cao (&gt;20 phút)</span>
            </div>
          </div>
        </div>

        {/* Check-in Simulation */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Check-in mô phỏng
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Thêm khách check-in để xem dự báo cập nhật (PoC feature)
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => alert("PoC: Tính năng check-in sẽ được triển khai với Qwen API")}
          >
            + Check-in mới
          </button>
        </div>

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

// Generate mock hourly forecast
function generateHourlyForecast() {
  const forecast = [];
  for (let hour = 8; hour < 17; hour++) {
    let customers = 5;
    let congestionLevel: "low" | "medium" | "high" = "low";

    // Lunch rush
    if (hour >= 11 && hour <= 13) {
      customers = 25 + Math.floor(Math.random() * 10);
      congestionLevel = "high";
    } else if (hour >= 14 && hour <= 15) {
      customers = 10 + Math.floor(Math.random() * 5);
      congestionLevel = "medium";
    } else if (hour === 16) {
      customers = 8 + Math.floor(Math.random() * 4);
      congestionLevel = "low";
    }

    const waitTime = Math.max(5, Math.floor(customers * 1.3));

    forecast.push({
      hour,
      predictedCustomers: customers,
      predictedWaitTime: waitTime,
      congestionLevel: waitTime > 20 ? "high" : waitTime > 10 ? "medium" : "low",
    });
  }
  return forecast;
}
