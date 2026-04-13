// SB10 - Qwen API Client

import { QwenPredictionRequest, HourlyForecast, Prediction } from "../types";

// Qwen API endpoint for DashScope INTL
const QWEN_API_URL = "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

export interface QwenPredictionResponse {
  hourly: HourlyForecast[];
  bestTimeToVisit: string;
  summary: string;
}

/**
 * Call Qwen API to predict branch traffic
 */
export async function predictTraffic(
  request: QwenPredictionRequest
): Promise<QwenPredictionResponse> {
  const apiKey = process.env.QWEN_API_KEY || "";

  if (!apiKey) {
    // Fallback to mock prediction for demo
    return mockPrediction(request);
  }

  try {
    const response = await fetch(QWEN_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen-plus",
        input: {
          messages: [
            {
              role: "system",
              content: "You are a bank branch traffic analyst. Predict customer traffic and wait times based on historical data."
            },
            {
              role: "user",
              content: buildPredictionPrompt(request)
            }
          ]
        },
        parameters: {
          result_format: "message",
          max_tokens: 2000
        }
      })
    });

    if (!response.ok) {
      console.error("Qwen API error:", response.status);
      return mockPrediction(request);
    }

    const data = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || "";

    return parsePredictionResponse(content);
  } catch (error) {
    console.error("Qwen API call failed:", error);
    return mockPrediction(request);
  }
}

/**
 * Build prediction prompt for Qwen
 */
function buildPredictionPrompt(request: QwenPredictionRequest): string {
  const { branchName, district, history, targetDate, currentCheckIns = 0 } = request;

  // Calculate recent averages
  const recentHistory = history.slice(-48); // Last 2 days
  const avgByHour = new Array(9).fill(0).map((_, i) => {
    const hourData = recentHistory.filter((h) => h.hour === i + 8);
    return {
      hour: i + 8,
      avgCustomers: hourData.reduce((sum, h) => sum + h.customerCount, 0) / (hourData.length || 1),
      avgWaitTime: hourData.reduce((sum, h) => sum + h.avgWaitTime, 0) / (hourData.length || 1)
    };
  });

  let prompt = `Analyze traffic for ${branchName} branch in ${district} district.\n\n`;
  prompt += `Target date: ${targetDate}\n`;
  prompt += `Current check-ins today: ${currentCheckIns}\n\n`;

  prompt += `Recent hourly averages (last 2 days):\n`;
  avgByHour.forEach((h) => {
    prompt += `  ${h.hour}:00 - ${h.avgCustomers.toFixed(1)} customers, ${h.avgWaitTime.toFixed(1)}min wait\n`;
  });

  prompt += `\nTraffic patterns:\n`;
  prompt += `- Lunch rush: 11:00-13:00 typically 2-3x busier\n`;
  prompt += `- End of month: 25th-30th typically higher\n`;
  prompt += `- Weekends: 30-50% less traffic\n\n`;

  prompt += `Predict for ${targetDate} (hours 8:00-16:00):\n`;
  prompt += `Return JSON format:\n`;
  prompt += `{\n`;
  prompt += `  "hourly": [\n`;
  prompt += `    {"hour": 8, "predictedCustomers": 5, "predictedWaitTime": 8, "congestionLevel": "low"},\n`;
  prompt += `    ...\n`;
  prompt += `  ],\n`;
  prompt += `  "bestTimeToVisit": "9:00 AM or 3:00 PM",\n`;
  prompt += `  "summary": "Brief analysis of the day"\n`;
  prompt += `}\n\n`;

  prompt += `Congestion levels: low (<10min wait), medium (10-20min), high (>20min)`;

  return prompt;
}

/**
 * Parse Qwen JSON response
 */
function parsePredictionResponse(content: string): QwenPredictionResponse {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Failed to parse Qwen response:", error);
  }

  // Fallback to mock
  return {
    hourly: [],
    bestTimeToVisit: "9:00 AM",
    summary: content.substring(0, 200)
  };
}

/**
 * Mock prediction for demo/fallback
 */
function mockPrediction(request: QwenPredictionRequest): QwenPredictionResponse {
  const { branchId, targetDate } = request;
  const targetDateObj = new Date(targetDate);
  const dayOfWeek = targetDateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isEndOfMonth = targetDateObj.getDate() >= 25;

  const hourly: HourlyForecast[] = [];

  for (let hour = 8; hour < 17; hour++) {
    let customers = isWeekend ? 3 : 5;

    // Lunch rush
    if (hour >= 11 && hour <= 13) {
      customers += isWeekend ? 8 : 20;
    }

    // End of month
    if (isEndOfMonth) {
      customers += 5;
    }

    // Afternoon dip
    if (hour >= 14 && hour <= 15) {
      customers = Math.max(5, customers - 8);
    }

    const waitTime = Math.max(5, Math.floor(customers * 1.3));
    let congestionLevel: "low" | "medium" | "high" = "low";

    if (waitTime > 20) congestionLevel = "high";
    else if (waitTime > 10) congestionLevel = "medium";

    hourly.push({
      hour,
      predictedCustomers: customers,
      predictedWaitTime: waitTime,
      congestionLevel
    });
  }

  // Find best time (lowest wait time, exclude first/last hour)
  const bestHour = hourly.slice(1, -1).reduce((best, h) =>
    h.predictedWaitTime < best.predictedWaitTime ? h : best
  );

  return {
    hourly,
    bestTimeToVisit: `${bestHour.hour}:00 AM or ${bestHour.hour + 1}:00 PM`,
    summary: `${isWeekend ? "Weekend traffic" : "Weekday traffic"} - ${isEndOfMonth ? "End of month busy" : "Normal volume"}. Peak expected at 11:00-13:00.`
  };
}

/**
 * Get traffic description in Vietnamese
 */
export function getCongestionLabel(level: "low" | "medium" | "high"): string {
  const labels = {
    low: "Thấp - Đến ngay",
    medium: "Trung bình",
    high: "Cao - Nên tránh"
  };
  return labels[level];
}

/**
 * Get congestion color for UI
 */
export function getCongestionColor(level: "low" | "medium" | "high"): string {
  const colors = {
    low: "#22c55e", // green
    medium: "#eab308", // yellow
    high: "#ef4444" // red
  };
  return colors[level];
}
