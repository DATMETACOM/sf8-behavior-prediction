import { HourlyForecast } from "@/lib/data";

interface ForecastChartProps {
  hourlyForecast: HourlyForecast[];
  targetDate: string;
}

export function ForecastChart({ hourlyForecast, targetDate }: ForecastChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Dự báo lưu lượng hôm nay ({targetDate})
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
  );
}
