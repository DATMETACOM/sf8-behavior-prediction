import fs from "node:fs";
import path from "node:path";

let cachedCustomers = null;
let cachedCatalog = null;

function readJson(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

export function loadCustomers() {
  if (!cachedCustomers) {
    cachedCustomers = readJson("backend/customers_data.json");
  }
  return cachedCustomers;
}

export function loadProductCatalog() {
  if (!cachedCatalog) {
    cachedCatalog = readJson("backend/Product_Catalog.json");
  }
  return cachedCatalog;
}

export function findCustomer(customerId) {
  return loadCustomers().find((item) => item.customer_id === customerId) || null;
}

