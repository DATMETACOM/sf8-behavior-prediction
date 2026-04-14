import { NextResponse } from "next/server";
import { BRANCHES, getBranchTraffic } from "@/lib/data";
import { predictTraffic } from "@/lib/qwen";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const branch = BRANCHES.find((b) => b.id === params.id);

  if (!branch) {
    return NextResponse.json(
      { error: { code: "BRANCH_NOT_FOUND", message: `Branch with ID '${params.id}' not found` } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { targetDate, currentCheckIns = 0 } = body;

    if (!targetDate) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "targetDate is required" } },
        { status: 400 }
      );
    }

    // Get traffic history for prediction
    const trafficHistory = getBranchTraffic(branch.id, 30);

    // Call Qwen API (or use mock fallback)
    const prediction = await predictTraffic({
      branchId: branch.id,
      branchName: branch.name,
      district: branch.district,
      history: trafficHistory,
      targetDate,
      currentCheckIns,
    });

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json(
      { error: { code: "PREDICTION_ERROR", message: "Failed to generate prediction" } },
      { status: 500 }
    );
  }
}
