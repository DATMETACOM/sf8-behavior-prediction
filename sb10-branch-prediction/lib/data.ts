// SB10 - Mock Data Generator

import { Branch, TrafficRecord } from "../types";

// 5 Branches in HCMC
export const BRANCHES: Branch[] = [
  {
    id: "bn-001",
    name: "Chi nhánh Quận Tân Bình",
    address: "135 Nguyễn Thái Học, P.4, Q.Tân Bình",
    district: "TanBinh",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 8,
    services: ["Tiền gửi", "Tín dụng", "Thẻ", "Chuyển tiền"],
    status: "open",
    currentWaitTime: 12,
    congestionLevel: "low"
  },
  {
    id: "bn-002",
    name: "Chi nhánh Quận 1",
    address: "45 Lê Lợi, P.Bến Nghé, Q.1",
    district: "Quan1",
    openTime: "08:00",
    closeTime: "17:30",
    staffCount: 12,
    services: ["Tiền gửi", "Tín dụng", "Thẻ", "Chuyển tiền", "Ngoại hối"],
    status: "open",
    currentWaitTime: 28,
    congestionLevel: "high"
  },
  {
    id: "bn-003",
    name: "Chi nhánh Quận 3",
    address: "56 Nguyễn Đình Chiểu, P.6, Q.3",
    district: "Quan3",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 6,
    services: ["Tiền gửi", "Tín dụng", "Thẻ"],
    status: "open",
    currentWaitTime: 8,
    congestionLevel: "low"
  },
  {
    id: "bn-004",
    name: "Chi nhánh Bình Thạnh",
    address: "78 Đinh Tiên Hoàng, P.1, Q.Bình Thạnh",
    district: "BinhThanh",
    openTime: "07:30",
    closeTime: "16:30",
    staffCount: 7,
    services: ["Tiền gửi", "Tín dụng", "Chuyển tiền"],
    status: "open",
    currentWaitTime: 18,
    congestionLevel: "medium"
  },
  {
    id: "bn-005",
    name: "Chi nhánh Gò Vấp",
    address: "234 Phan Văn Trị, P.7, Q.Gò Vấp",
    district: "GoVap",
    openTime: "08:00",
    closeTime: "17:00",
    staffCount: 5,
    services: ["Tiền gửi", "Tín dụng", "Thẻ"],
    status: "open",
    currentWaitTime: 5,
    congestionLevel: "low"
  }
];

// Generate 30 days of traffic data for each branch
export function generateTrafficData(): TrafficRecord[] {
  const records: TrafficRecord[] = [];
  const today = new Date();

  for (const branch of BRANCHES) {
    for (let day = 30; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();

      // Lunch rush pattern (11-13h) and end of month
      const isEndOfMonth = date.getDate() >= 25;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      for (let hour = 8; hour < 17; hour++) {
        let baseCustomers = isWeekend ? 3 : 5;

        // Lunch rush
        if (hour >= 11 && hour <= 13) {
          baseCustomers += isWeekend ? 5 : 15;
        }

        // End of month spike
        if (isEndOfMonth) {
          baseCustomers += 8;
        }

        // Add randomness
        const customers = baseCustomers + Math.floor(Math.random() * 5);
        const waitTime = Math.max(2, Math.floor(customers * 1.5));

        records.push({
          id: `tr-${branch.id}-${dateStr}-${hour}`,
          branchId: branch.id,
          date: dateStr,
          hour,
          dayOfWeek,
          customerCount: customers,
          avgWaitTime: waitTime,
          serviceTypes: branch.services.slice(0, Math.floor(Math.random() * 3) + 1),
          staffOnDuty: branch.staffCount
        });
      }
    }
  }

  return records;
}

// Pre-generated data for PoC
export const TRAFFIC_DATA = generateTrafficData();

// Get traffic history for a branch
export function getBranchTraffic(branchId: string, days = 7): TrafficRecord[] {
  return TRAFFIC_DATA.filter(
    (r) => r.branchId === branchId && new Date(r.date) >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  );
}

// Get today's traffic so far
export function getTodayTraffic(branchId: string): TrafficRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return TRAFFIC_DATA.filter((r) => r.branchId === branchId && r.date === today);
}

// Simulate real-time check-ins
export const SIMULATED_CHECK_INS = [
  { branchId: "bn-001", count: 2 },
  { branchId: "bn-002", count: 5 },
  { branchId: "bn-003", count: 1 },
  { branchId: "bn-004", count: 3 },
  { branchId: "bn-005", count: 0 }
];
