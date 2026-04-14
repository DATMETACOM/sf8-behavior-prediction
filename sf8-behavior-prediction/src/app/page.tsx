import Link from "next/link";
import { CUSTOMERS } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🏦 Shinhan Finance Behavior Prediction</h1>
              <p className="text-red-200 text-sm mt-1">
                Phân tích hành vi khách hàng & Đề xuất sản phẩm bằng AI
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-red-200">Powered by</p>
              <p className="font-semibold">Qwen AI 🤖</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Danh sách khách hàng ({CUSTOMERS.length} customers)
          </h2>
          <p className="text-gray-600">
            Chọn khách hàng để xem phân tích hành vi và đề xuất sản phẩm phù hợp
          </p>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CUSTOMERS.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-5 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">
                  {customer.name.split(" ").pop()?.[0] || "?"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-xs text-gray-500">{customer.occupation}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tuổi:</span>
                  <span className="font-medium">{customer.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thu nhập:</span>
                  <span className="font-medium">
                    {(customer.income / 1000000).toFixed(0)}M VNĐ
                  </span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <span className="text-red-600 text-sm font-medium hover:underline">
                  Xem phân tích →
                </span>
              </div>
            </Link>
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
