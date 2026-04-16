const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.detail) detail = payload.detail;
    } catch {
      // Keep status detail only.
    }
    throw new Error(detail);
  }
  return response.json();
}

export function fetchCustomers() {
  return request("/api/customers");
}

export function fetchAnalysis(customerId) {
  return request(`/api/analyze/${customerId}`);
}

export function sendCopilotMessage(customerId, message, history) {
  return request(`/api/copilot/${customerId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
}
