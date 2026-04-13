// SF8 - Customer Behavior Prediction Mock Data

import { Customer, AlternativeData, ShinhanProduct } from "../types";

// 20 Sample customers with alternative data
export const CUSTOMERS: Customer[] = [
  { id: "c001", name: "Nguyễn Văn An", age: 28, income: 15000000, occupation: "Kỹ sư phần mềm" },
  { id: "c002", name: "Trần Thị Bình", age: 32, income: 22000000, occupation: "Marketing Manager" },
  { id: "c003", name: "Lê Hoàng Cường", age: 25, income: 8000000, occupation: "Freelancer" },
  { id: "c004", name: "Phạm Minh Dung", age: 35, income: 35000000, occupation: "Giám đốc" },
  { id: "c005", name: "Hoàng Văn Em", age: 29, income: 12000000, occupation: "Sale" },
  { id: "c006", name: "Đỗ Thị Loan", age: 27, income: 10000000, occupation: "Nhân viên văn phòng" },
  { id: "c007", name: "Vũ Quốc Huy", age: 41, income: 45000000, occupation: "Kinh doanh tự do" },
  { id: "c008", name: "Bùi Thị Hương", age: 30, income: 18000000, occupation: "Giáo viên" },
  { id: "c009", name: "Đinh Văn Kiên", age: 26, income: 9500000, occupation: "Giao hàng" },
  { id: "c010", name: "Ngô Thị Lan", age: 38, income: 28000000, occupation: "Kế toán" },
  { id: "c011", name: "Dương Văn Mạnh", age: 33, income: 25000000, occupation: "Bác sĩ" },
  { id: "c012", name: "Võ Thị Nga", age: 24, income: 7000000, occupation: "Sinh viên" },
  { id: "c013", name: "Lý Văn Phong", age: 36, income: 32000000, occupation: "Luật sư" },
  { id: "c014", name: "Hoàng Thị Quỳnh", age: 31, income: 20000000, occupation: "HR" },
  { id: "c015", name: "Trương Văn Sang", age: 28, income: 13000000, occupation: "IT Support" },
  { id: "c016", name: "Lê Thị Thảo", age: 34, income: 27000000, occupation: "Pharmacist" },
  { id: "c017", name: "Nguyễn Văn Tú", age: 29, income: 16000000, occupation: "Graphic Designer" },
  { id: "c018", name: "Phạm Thị Uyên", age: 40, income: 40000000, occupation: "CEO" },
  { id: "c019", name: "Võ Văn Vinh", age: 27, income: 11000000, occupation: "Content Creator" },
  { id: "c020", name: "Lê Thị Xuân", age: 37, income: 30000000, occupation: "Banker" }
];

// Alternative data for each customer
export const ALTERNATIVE_DATA: Record<string, AlternativeData> = {
  c001: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 15 },
    eWallet: { usage: "high", monthlyTransactions: 45, categories: ["food", "transport", "shopping"] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 500000, categories: ["electronics", "books"] },
    social: { interests: ["technology", "gaming", "travel"], activity: "high" }
  },
  c002: {
    telco: { monthlySpend: 450000, tenure: 48, dataUsage: 25 },
    eWallet: { usage: "high", monthlyTransactions: 60, categories: ["food", "travel", "shopping", "beauty"] },
    ecommerce: { monthlyOrders: 15, avgOrderValue: 800000, categories: ["fashion", "cosmetics", "home"] },
    social: { interests: ["fashion", "travel", "food"], activity: "high" }
  },
  c003: {
    telco: { monthlySpend: 200000, tenure: 12, dataUsage: 20 },
    eWallet: { usage: "medium", monthlyTransactions: 25, categories: ["food", "transport"] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 300000, categories: ["electronics", "tools"] },
    social: { interests: ["technology", "freelancing"], activity: "medium" }
  },
  c004: {
    telco: { monthlySpend: 600000, tenure: 72, dataUsage: 30 },
    eWallet: { usage: "high", monthlyTransactions: 80, categories: ["all"] },
    ecommerce: { monthlyOrders: 20, avgOrderValue: 2000000, categories: ["luxury", "electronics", "travel"] },
    social: { interests: ["business", "golf", "luxury"], activity: "low" }
  },
  c005: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 10 },
    eWallet: { usage: "medium", monthlyTransactions: 30, categories: ["food", "transport"] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 400000, categories: ["fashion", "sport"] },
    social: { interests: ["sport", "football"], activity: "medium" }
  },
  c006: {
    telco: { monthlySpend: 200000, tenure: 36, dataUsage: 8 },
    eWallet: { usage: "low", monthlyTransactions: 15, categories: ["food", "transport"] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 350000, categories: ["books", "home"] },
    social: { interests: ["books", "movies"], activity: "low" }
  },
  c007: {
    telco: { monthlySpend: 500000, tenure: 60, dataUsage: 20 },
    eWallet: { usage: "high", monthlyTransactions: 50, categories: ["business", "transport"] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 1500000, categories: ["electronics", "office"] },
    social: { interests: ["business", "investment"], activity: "medium" }
  },
  c008: {
    telco: { monthlySpend: 300000, tenure: 48, dataUsage: 12 },
    eWallet: { usage: "medium", monthlyTransactions: 35, categories: ["food", "education", "books"] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ["books", "education", "home"] },
    social: { interests: ["education", "books", "children"], activity: "medium" }
  },
  c009: {
    telco: { monthlySpend: 200000, tenure: 18, dataUsage: 15 },
    eWallet: { usage: "high", monthlyTransactions: 55, categories: ["food", "transport", "shopping"] },
    ecommerce: { monthlyOrders: 4, avgOrderValue: 250000, categories: ["fashion", "sport"] },
    social: { interests: ["sport", "music", "games"], activity: "high" }
  },
  c010: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 10 },
    eWallet: { usage: "medium", monthlyTransactions: 30, categories: ["food", "shopping"] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 600000, categories: ["home", "fashion"] },
    social: { interests: ["cooking", "home"], activity: "low" }
  },
  c011: {
    telco: { monthlySpend: 400000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: "low", monthlyTransactions: 20, categories: ["food", "health"] },
    ecommerce: { monthlyOrders: 3, avgOrderValue: 800000, categories: ["health", "books"] },
    social: { interests: ["health", "medicine"], activity: "low" }
  },
  c012: {
    telco: { monthlySpend: 150000, tenure: 12, dataUsage: 25 },
    eWallet: { usage: "high", monthlyTransactions: 40, categories: ["food", "transport", "fashion"] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 300000, categories: ["fashion", "beauty"] },
    social: { interests: ["fashion", "beauty", "kpop"], activity: "high" }
  },
  c013: {
    telco: { monthlySpend: 500000, tenure: 72, dataUsage: 15 },
    eWallet: { usage: "medium", monthlyTransactions: 35, categories: ["business", "food", "transport"] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 2500000, categories: ["electronics", "luxury"] },
    social: { interests: ["law", "business", "golf"], activity: "low" }
  },
  c014: {
    telco: { monthlySpend: 350000, tenure: 60, dataUsage: 12 },
    eWallet: { usage: "medium", monthlyTransactions: 40, categories: ["food", "shopping", "travel"] },
    ecommerce: { monthlyOrders: 10, avgOrderValue: 700000, categories: ["fashion", "home", "beauty"] },
    social: { interests: ["hr", "psychology", "self-help"], activity: "medium" }
  },
  c015: {
    telco: { monthlySpend: 280000, tenure: 36, dataUsage: 20 },
    eWallet: { usage: "high", monthlyTransactions: 50, categories: ["food", "tech", "gaming"] },
    ecommerce: { monthlyOrders: 6, avgOrderValue: 550000, categories: ["electronics", "gaming"] },
    social: { interests: ["technology", "gaming", "anime"], activity: "high" }
  },
  c016: {
    telco: { monthlySpend: 320000, tenure: 48, dataUsage: 8 },
    eWallet: { usage: "medium", monthlyTransactions: 30, categories: ["food", "health", "family"] },
    ecommerce: { monthlyOrders: 5, avgOrderValue: 500000, categories: ["health", "family"] },
    social: { interests: ["health", "family"], activity: "low" }
  },
  c017: {
    telco: { monthlySpend: 300000, tenure: 36, dataUsage: 18 },
    eWallet: { usage: "high", monthlyTransactions: 45, categories: ["food", "tech", "art"] },
    ecommerce: { monthlyOrders: 9, avgOrderValue: 650000, categories: ["electronics", "art", "design"] },
    social: { interests: ["design", "art", "photography"], activity: "high" }
  },
  c018: {
    telco: { monthlySpend: 700000, tenure: 96, dataUsage: 25 },
    eWallet: { usage: "high", monthlyTransactions: 100, categories: ["all"] },
    ecommerce: { monthlyOrders: 25, avgOrderValue: 3000000, categories: ["luxury", "travel", "business"] },
    social: { interests: ["business", "luxury", "travel"], activity: "medium" }
  },
  c019: {
    telco: { monthlySpend: 250000, tenure: 24, dataUsage: 22 },
    eWallet: { usage: "high", monthlyTransactions: 55, categories: ["food", "entertainment", "tech"] },
    ecommerce: { monthlyOrders: 7, avgOrderValue: 450000, categories: ["electronics", "camera"] },
    social: { interests: ["content", "video", "tech"], activity: "high" }
  },
  c020: {
    telco: { monthlySpend: 400000, tenure: 84, dataUsage: 10 },
    eWallet: { usage: "medium", monthlyTransactions: 35, categories: ["business", "food", "transport"] },
    ecommerce: { monthlyOrders: 8, avgOrderValue: 900000, categories: ["business", "finance"] },
    social: { interests: ["finance", "investment", "business"], activity: "low" }
  }
};

// Available Shinhan Finance products
export const PRODUCTS: ShinhanProduct[] = [
  {
    id: "cc-platinum",
    name: "Thẻ tín dụng Platinum",
    type: "credit_card",
    minIncome: 10000000,
    targetSegment: ["office", "it", "professional", "young_professional"]
  },
  {
    id: "cc-cashback",
    name: "Thẻ tín dụng Cashback",
    type: "credit_card",
    minIncome: 8000000,
    targetSegment: ["shopping", "ecommerce", "young"]
  },
  {
    id: "pl-salary",
    name: "Vay thỏa thuận lương",
    type: "personal_loan",
    minIncome: 8000000,
    targetSegment: ["salaried", "office", "stable_income"]
  },
  {
    id: "pl-fast",
    name: "Vay nhanh trong ngày",
    type: "personal_loan",
    minIncome: 5000000,
    targetSegment: ["freelancer", "gig", "urgent"]
  },
  {
    id: "sme-micro",
    name: "Vay SME Micro",
    type: "sme_loan",
    minIncome: 15000000,
    targetSegment: ["business", "entrepreneur", "sme"]
  },
  {
    id: "ins-health",
    name: "Bảo hiểm sức khỏe",
    type: "insurance",
    minIncome: 10000000,
    targetSegment: ["family", "health_conscious", "mid_age"]
  },
  {
    id: "bnpl-shop",
    name: "Mua trước trả sau Shopping",
    type: "bnpl",
    minIncome: 7000000,
    targetSegment: ["shopping", "ecommerce", "young"]
  }
];

// Get customer by ID
export function getCustomer(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}

// Get alternative data by customer ID
export function getAlternativeData(id: string): AlternativeData | undefined {
  return ALTERNATIVE_DATA[id];
}

// Get products eligible for customer income
export function getEligibleProducts(income: number): ShinhanProduct[] {
  return PRODUCTS.filter((p) => p.minIncome <= income);
}
