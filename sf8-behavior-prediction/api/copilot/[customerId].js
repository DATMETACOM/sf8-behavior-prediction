import { findCustomer, loadProductCatalog } from "../_shared/data.js";
import { analyzeWithQwen, copilotWithQwen } from "../_shared/qwen.js";

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Method not allowed" });
  }

  const customerId = String(req.query.customerId || "").trim();
  if (!customerId) return res.status(400).json({ detail: "Missing customerId" });

  const customer = findCustomer(customerId);
  if (!customer) return res.status(404).json({ detail: `Customer ${customerId} not found` });

  const body = parseBody(req);
  const message = String(body.message || "").trim();
  if (!message) return res.status(400).json({ detail: "Missing message" });

  const history = Array.isArray(body.history) ? body.history : [];
  const maskedPayload = {
    behavioral_tags: customer.behavioral_tags,
    deterministic_stats: customer.deterministic_stats,
  };

  try {
    const analysis = await analyzeWithQwen(maskedPayload, loadProductCatalog());
    const reply = await copilotWithQwen({
      customer,
      analysis,
      message,
      history,
    });
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(502).json({ detail: `Qwen copilot failed: ${error.message}` });
  }
}

