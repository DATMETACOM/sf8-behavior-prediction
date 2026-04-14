import { BRANCHES } from "@/lib/data";
import { BranchCard } from "@/components";

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
            <BranchCard key={branch.id} branch={branch} />
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
