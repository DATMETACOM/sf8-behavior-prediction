import { findCustomer, loadProductCatalog } from "../_shared/data.js";
import { analyzeWithQwen } from "../_shared/qwen.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ detail: "Method not allowed" });
  }

  const customerId = String(req.query.customerId || "").trim();
  if (!customerId) return res.status(400).json({ detail: "Missing customerId" });

  const customer = findCustomer(customerId);
  if (!customer) return res.status(404).json({ detail: `Customer ${customerId} not found` });

  const maskedPayload = {
    behavioral_tags: customer.behavioral_tags,
    deterministic_stats: customer.deterministic_stats,
  };

  try {
    const analysis = await analyzeWithQwen(maskedPayload, loadProductCatalog());
    return res.status(200).json({
      customer_id: customer.customer_id,
      full_name: customer.pii_data.full_name,
      job_title: customer.pii_data.job_title,
      deterministic_stats: customer.deterministic_stats,
      recommended_product: analysis.recommended_product,
      behavioral_rationale: analysis.behavioral_rationale,
      statistical_evidence: analysis.statistical_evidence,
      sales_pitch_script: analysis.sales_pitch_script,
      risk_warning_and_upsell: analysis.risk_warning_and_upsell,
    });
  } catch (error) {
    return res.status(502).json({ detail: `Qwen analyze failed: ${error.message}` });
  }
}

