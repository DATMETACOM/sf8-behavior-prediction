import { BRANCHES } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🏦 Shinhan Branch Traffic Prediction</h1>
              <p className="text-blue-200 text-sm mt-1">Dự đoán lưu lượng chi nhánh & Quản lý hàng đợi thông minh</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-blue-200">Powered by</p>
              <p className="font-semibold">Qwen AI 🤖</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Danh sách chi nhánh (5 branches)
          </h2>
          <p className="text-gray-600">
            Chọn chi nhánh để xem dự báo lưu lượng và thời gian chờ ước tính
          </p>
        </div>

        {/* Branch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANCHES.map((branch) => (
            <a
              key={branch.id}
              href={`/branches/${branch.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  branch.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {branch.status === "open" ? "🟢 Mở cửa" : "🔴 Đóng cửa"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giờ mở cửa:</span>
                  <span className="font-medium">{branch.openTime} - {branch.closeTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nhân viên:</span>
                  <span className="font-medium">{branch.staffCount} người</span>
                </div>
                {branch.currentWaitTime !== undefined && (
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Thời gian chờ:</span>
                    <span className={`font-bold ${
                      branch.congestionLevel === "high"
                        ? "text-red-600"
                        : branch.congestionLevel === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                      {branch.currentWaitTime} phút
                      {branch.congestionLevel === "high" && " 🔴"}
                      {branch.congestionLevel === "medium" && " 🟡"}
                      {branch.congestionLevel === "low" && " 🟢"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-blue-600 text-sm font-medium hover:underline">
                  Xem dự báo →
                </span>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PoC for Shinhan InnoBoost 2026 | Built with Qwen AI</p>
        </div>
      </footer>
    </div>
  );
}
