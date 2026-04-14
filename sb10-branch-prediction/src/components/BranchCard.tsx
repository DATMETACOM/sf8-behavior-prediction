import { Branch } from "@/lib/data";

interface BranchCardProps {
  branch: Branch;
}

export function BranchCard({ branch }: BranchCardProps) {
  return (
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
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            branch.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {branch.status === "open" ? "🟢 Mở cửa" : "🔴 Đóng cửa"}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Giờ mở cửa:</span>
          <span className="font-medium">
            {branch.openTime} - {branch.closeTime}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Nhân viên:</span>
          <span className="font-medium">{branch.staffCount} người</span>
        </div>
        {branch.currentWaitTime !== undefined && (
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-gray-600">Thời gian chờ:</span>
            <span
              className={`font-bold ${
                branch.congestionLevel === "high"
                  ? "text-red-600"
                  : branch.congestionLevel === "medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
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
  );
}
