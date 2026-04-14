import { NextResponse } from "next/server";
import { getCustomer, getAlternativeData, getEligibleProducts } from "@/lib/data";
import { predictBehavior } from "@/lib/qwen";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: "customerId is required" } },
        { status: 400 }
      );
    }

    const customer = getCustomer(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: { code: "CUSTOMER_NOT_FOUND", message: `Customer with ID '${customerId}' not found` } },
        { status: 404 }
      );
    }

    const alternativeData = getAlternativeData(customerId);
    if (!alternativeData) {
      return NextResponse.json(
        { error: { code: "NO_ALTERNATIVE_DATA", message: `No alternative data found for customer '${customerId}'` } },
        { status: 404 }
      );
    }

    const eligibleProducts = getEligibleProducts(customer.income);

    const prediction = await predictBehavior({
      customer,
      alternativeData,
      availableProducts: eligibleProducts,
    });

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json(
      { error: { code: "PREDICTION_ERROR", message: "Failed to generate prediction" } },
      { status: 500 }
    );
  }
}
