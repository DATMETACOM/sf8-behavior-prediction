import { NextResponse } from "next/server";
import { BRANCHES } from "@/lib/data";

// Simulated check-in storage (in-memory, resets on restart)
const checkIns: Map<string, any[]> = new Map();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { branchId, customerName, serviceType } = body;

    // Validate branch exists
    const branch = BRANCHES.find((b) => b.id === branchId);
    if (!branch) {
      return NextResponse.json(
        { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${branchId}' not found` } },
        { status: 404 }
      );
    }

    // Create check-in record
    const checkInId = `ci-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const currentHour = now.getHours();

    // Get existing check-ins for today
    const today = now.toISOString().split("T")[0];
    const todayKey = `${branchId}-${today}`;
    const existingCheckIns = checkIns.get(todayKey) || [];
    const positionInQueue = existingCheckIns.length + 1;

    // Estimate wait time based on branch staff and current queue
    const baseWaitTime = 5; // 5 minutes base
    const staffCapacity = branch.staffCount * 2; // Each staff can handle 2 customers/hour
    const estimatedWaitTime = Math.max(baseWaitTime, Math.ceil(positionInQueue * (60 / staffCapacity)));

    const checkIn = {
      checkInId,
      branchId,
      customerName: customerName || "Khách vãng lai",
      serviceType: serviceType || "Khác",
      checkInTime: now.toISOString(),
      positionInQueue,
      estimatedWaitTime,
      status: "waiting",
    };

    // Store check-in
    checkIns.set(todayKey, [...existingCheckIns, checkIn]);

    return NextResponse.json(checkIn);
  } catch (error) {
    return NextResponse.json(
      { error: { code: "CHECKIN_ERROR", message: "Failed to process check-in" } },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current queue
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branchId = searchParams.get("branchId");

  if (!branchId) {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "branchId query parameter is required" } },
      { status: 400 }
    );
  }

  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) {
    return NextResponse.json(
      { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${branchId}' not found` } },
      { status: 404 }
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayKey = `${branchId}-${today}`;
  const todayCheckIns = checkIns.get(todayKey) || [];

  const waiting = todayCheckIns.filter((c) => c.status === "waiting").length;
  const serving = todayCheckIns.filter((c) => c.status === "serving").length;
  const averageWaitTime = waiting > 0
    ? todayCheckIns.reduce((sum, c) => sum + c.estimatedWaitTime, 0) / todayCheckIns.length
    : 0;
  const estimatedTimeForNew = Math.ceil(averageWaitTime * (1 + waiting * 0.2));

  return NextResponse.json({
    branchId,
    waiting,
    serving,
    averageWaitTime: Math.ceil(averageWaitTime),
    estimatedTimeForNew,
    checkIns: todayCheckIns,
  });
}
