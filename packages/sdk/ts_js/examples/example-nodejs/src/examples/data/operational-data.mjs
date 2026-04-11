export const incidents = [
  { id: "inc-102", severity: 5, latencyMs: 930, clientsAffected: 350, squad: "core-payments", status: "open" },
  { id: "inc-118", severity: 3, latencyMs: 410, clientsAffected: 45, squad: "risk", status: "open" },
  { id: "inc-121", severity: 4, latencyMs: 780, clientsAffected: 210, squad: "catalog", status: "mitigating" },
  { id: "inc-130", severity: 2, latencyMs: 190, clientsAffected: 12, squad: "core-payments", status: "open" },
  { id: "inc-135", severity: 4, latencyMs: 760, clientsAffected: 210, squad: "catalog", status: "open" },
];

export const customers = [
  { id: "cus-01", name: "Mercado Norte", tier: "enterprise", region: "mx", mrr: 9500 },
  { id: "cus-02", name: "Nova Retail", tier: "growth", region: "co", mrr: 2200 },
  { id: "cus-03", name: "Atlas Health", tier: "enterprise", region: "mx", mrr: 14000 },
  { id: "cus-04", name: "Nova Retail", tier: "growth", region: "co", mrr: 2200 },
  { id: "cus-05", name: "Signal Foods", tier: "mid-market", region: "ar", mrr: 4100 },
  { id: "cus-06", name: "Zen Logistics", tier: "enterprise", region: "cl", mrr: 10300 },
];

export const releaseCandidates = [
  { service: "checkout", risk: 0.08, coverage: 92, leadTimeHours: 18, team: "payments" },
  { service: "risk-engine", risk: 0.19, coverage: 98, leadTimeHours: 26, team: "risk" },
  { service: "catalog", risk: 0.04, coverage: 88, leadTimeHours: 10, team: "catalog" },
  { service: "fulfillment", risk: 0.12, coverage: 95, leadTimeHours: 14, team: "ops" },
  { service: "identity", risk: 0.05, coverage: 99, leadTimeHours: 8, team: "platform" },
];

export const packageWeights = [1, 2, 2, 2, 3, 5, 8, 13, 21, 34, 34, 55, 89];

export const inventoryMovements = [
  { sku: "KB-100", region: "mx", available: 120, demandPerDay: 20 },
  { sku: "KB-120", region: "mx", available: 45, demandPerDay: 15 },
  { sku: "KB-200", region: "co", available: 80, demandPerDay: 10 },
  { sku: "KB-350", region: "ar", available: 12, demandPerDay: 6 },
  { sku: "KB-410", region: "cl", available: 220, demandPerDay: 20 },
];