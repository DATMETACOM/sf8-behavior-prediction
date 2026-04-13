// SB10 - Branch Traffic Prediction Types

export interface Branch {
  id: string;
  name: string;
  address: string;
  district: string;
  openTime: string;
  closeTime: string;
  staffCount: number;
  services: string[];
  status: "open" | "closed";
  currentWaitTime?: number;
  congestionLevel?: "low" | "medium" | "high";
}

export interface TrafficRecord {
  id: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  dayOfWeek: number; // 0-6
  customerCount: number;
  avgWaitTime: number; // minutes
  serviceTypes: string[];
  staffOnDuty: number;
}

export interface CheckIn {
  id: string;
  branchId: string;
  customerName: string;
  checkInTime: Date;
  estimatedWait: number;
  serviceType: string;
  status: "waiting" | "serving" | "completed";
}

export interface HourlyForecast {
  hour: number;
  predictedCustomers: number;
  predictedWaitTime: number;
  congestionLevel: "low" | "medium" | "high";
}

export interface Prediction {
  branchId: string;
  date: string;
  hourly: HourlyForecast[];
  bestTimeToVisit: string;
  summary: string;
}

export interface QwenPredictionRequest {
  branchId: string;
  branchName: string;
  district: string;
  history: TrafficRecord[];
  targetDate: string;
  currentCheckIns?: number;
}
