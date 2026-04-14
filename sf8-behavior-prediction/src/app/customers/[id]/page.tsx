import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomer, getAlternativeData, getEligibleProducts } from "@/lib/data";
import { predictBehavior, getConfidenceLabel, getConfidenceColor } from "@/lib/qwen";

interface PageProps {
  params: { id: string };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const customer = getCustomer(params.id);

  if (!customer) {
    notFound();
  }

  const alternativeData = getAlternativeData(params.id);
  const eligibleProducts = getEligibleProducts(customer.income);

  // Generate mock prediction (will call Qwen API when key available)
  const prediction = await predictBehavior({
    customer,
    alternativeData: alternativeData!,
    availableProducts: eligibleProducts,
  });

  const confidencePercent = Math.round(prediction.confidence * 100);
  const confidenceColor = getConfidenceColor(prediction.confidence);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-red-900 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-red-200 hover:text-white mb-2 inline-block">
            ← Quay lại Dashboard
          </Link>
          <h1 className="text-xl font-bold">{customer.name}</h1>
          <p className="text-red-200 text-sm">
            {customer.occupation} • {customer.age} tuổi •{" "}
            {(customer.income / 1000000).toFixed(0)}M VNĐ/tháng
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Customer Info & Alternative Data */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">👤 Hồ sơ khách hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mã KH</span>
                  <span className="font-medium">{customer.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Họ tên</span>
                  <span className="font-medium">{customer.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tuổi</span>
                  <span className="font-medium">{customer.age}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Nghề nghiệp</span>
                  <span className="font-medium">{customer.occupation}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Thu nhập</span>
                  <span className="font-bold text-red-600">
                    {(customer.income / 1000000).toFixed(0)}M VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Data Card */}
            {alternativeData && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Alternative Data</h2>

                {/* Telco */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <span className="font-medium text-gray-700">Viễn thông</span>
                  </div>
                  <div className="pl-7 text-sm space-y-1">
                    <p className="text-gray-600">
                      Chi tiêu: {(alternativeData.telco.monthlySpend / 1000).toFixed(0)}K VNĐ/tháng
                    </p>
                    <p className="text-gray-600">Thâm niên: {alternativeData.telco.tenure} tháng</p>
                    <p className="text-gray-600">Dữ liệu: {alternativeData.telco.dataUsage} GB/tháng</p>
                  </div>
                </div>

                {/* E-Wallet */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💳</span>
                    <span className="font-medium text-gray-700">E-Wallet</span>
                  </div>
                  <div className="pl-7 text-sm space-y-1">
                    <p className="text-gray-600">
                      Mức dùng:{" "}
                      <span
                        className={`font-medium ${
                          alternativeData.eWallet.usage === "high"
                            ? "text-red-600"
                            : alternativeData.eWallet.usage === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {alternativeData.eWallet.usage === "high"
                          ? "Cao"
                          : alternativeData.eWallet.usage === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      GD/tháng: {alternativeData.eWallet.monthlyTransactions} lần
                    </p>
                    <p className="text-gray-600">
                      Danh mục: {alternativeData.eWallet.categories.join(", ")}
                    </p>
                  </div>
                </div>

                {/* E-commerce */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛒</span>
                    <span className="font-medium text-gray-700">E-commerce</span>
                  </div>
                  <div className="pl-7 text-sm space-y-1">
                    <p className="text-gray-600">
                      Đơn hàng: {alternativeData.ecommerce.monthlyOrders} đơn/tháng
                    </p>
                    <p className="text-gray-600">
                      Giá trị TB: {(alternativeData.ecommerce.avgOrderValue / 1000000).toFixed(1)}M VNĐ
                    </p>
                    <p className="text-gray-600">
                      Danh mục: {alternativeData.ecommerce.categories.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">👥</span>
                    <span className="font-medium text-gray-700">Social</span>
                  </div>
                  <div className="pl-7 text-sm space-y-1">
                    <p className="text-gray-600">
                      Sở thích: {alternativeData.social.interests.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      Hoạt động:{" "}
                      <span
                        className={`font-medium ${
                          alternativeData.social.activity === "high"
                            ? "text-red-600"
                            : alternativeData.social.activity === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {alternativeData.social.activity === "high"
                          ? "Cao"
                          : alternativeData.social.activity === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Recommendation */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Recommendation Card */}
            <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🤖 Đề xuất AI</h2>
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium bg-white/20"
                  style={{ backgroundColor: `${confidenceColor}40` }}
                >
                  Độ tin cậy: {confidencePercent}% ({getConfidenceLabel(prediction.confidence)})
                </div>
              </div>

              {/* Recommended Product */}
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-red-100 text-sm mb-1">Sản phẩm đề xuất:</p>
                <h3 className="text-2xl font-bold">{prediction.recommendedProduct.name}</h3>
                <p className="text-red-100 text-sm mt-1">
                  Loại sản phẩm:{" "}
                  {
                    {
                      credit_card: "Thẻ tín dụng",
                      personal_loan: "Vay cá nhân",
                      sme_loan: "Vay SME",
                      insurance: "Bảo hiểm",
                      bnpl: "Mua trước trả sau",
                    }[prediction.recommendedProduct.type]
                  }
                </p>
              </div>

              {/* Reason */}
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-red-100 text-sm mb-2">💡 Lý do:</p>
                <p className="text-white">{prediction.reason}</p>
              </div>

              {/* Offer Details */}
              <div className="bg-white rounded-lg p-4 text-gray-900">
                <p className="text-gray-600 text-sm mb-2">🎁 Chi tiết ưu đãi:</p>
                <div className="grid grid-cols-2 gap-3">
                  {prediction.offerDetails.limit && (
                    <div>
                      <p className="text-gray-500 text-xs">Hạn mức</p>
                      <p className="font-bold">{prediction.offerDetails.limit}</p>
                    </div>
                  )}
                  {prediction.offerDetails.rate && (
                    <div>
                      <p className="text-gray-500 text-xs">Lãi suất</p>
                      <p className="font-bold">{prediction.offerDetails.rate}</p>
                    </div>
                  )}
                  {prediction.offerDetails.promo && (
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs">Khuyến mãi</p>
                      <p className="font-bold text-red-600">{prediction.offerDetails.promo}</p>
                    </div>
                  )}
                  {prediction.offerDetails.timeline && (
                    <div>
                      <p className="text-gray-500 text-xs">Thời gian</p>
                      <p className="font-bold">{prediction.offerDetails.timeline}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Action */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-red-100">
                  ➡️ {prediction.nextAction}
                </p>
                <button className="bg-white text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Liên hệ khách hàng
                </button>
              </div>
            </div>

            {/* Eligible Products */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Sản phẩm phù hợp khác ({eligibleProducts.length - 1})
              </h2>
              <div className="space-y-3">
                {eligibleProducts
                  .filter((p) => p.id !== prediction.recommendedProduct.id)
                  .slice(0, 3)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Thu nhập tối thiểu: {(product.minIncome / 1000000).toFixed(0)}M VNĐ
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                        {
                          {
                            credit_card: "Thẻ",
                            personal_loan: "Vay",
                            sme_loan: "SME",
                            insurance: "BH",
                            bnpl: "BNPL",
                          }[product.type]
                        }
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Qwen AI Badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm">
                <span className="text-lg">🤖</span>
                <span>
                  Phân tích hành vi bởi <strong>Qwen AI</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
