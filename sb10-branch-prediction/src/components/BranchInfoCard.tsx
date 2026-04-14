import { Branch } from "@/lib/data";

interface BranchInfoCardProps {
  branch: Branch;
}

export function BranchInfoCard({ branch }: BranchInfoCardProps) {
  return (
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
          <p className="font-semibold text-lg mt-1">
            {branch.openTime} - {branch.closeTime}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">Nhân viên</p>
          <p className="font-semibold text-lg mt-1">{branch.staffCount} người</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">Thời gian chờ</p>
          <p
            className={`font-semibold text-lg mt-1 ${
              branch.congestionLevel === "high"
                ? "text-red-600"
                : branch.congestionLevel === "medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {branch.currentWaitTime} phút
          </p>
        </div>
      </div>
    </div>
  );
}
