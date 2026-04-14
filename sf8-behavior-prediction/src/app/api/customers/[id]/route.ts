import { NextResponse } from "next/server";
import { getCustomer, getAlternativeData, getEligibleProducts } from "@/lib/data";
import { predictBehavior } from "@/lib/qwen";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customer = getCustomer(params.id);

  if (!customer) {
    return NextResponse.json(
      { error: { code: "CUSTOMER_NOT_FOUND", message: `Customer with ID '${params.id}' not found` } },
      { status: 404 }
    );
  }

  const alternativeData = getAlternativeData(params.id);
  const eligibleProducts = getEligibleProducts(customer.income);

  return NextResponse.json({
    customer,
    alternativeData,
    eligibleProducts,
  });
}
