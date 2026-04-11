import { chunk, groupBy, indexBy, uniqueBy } from "@zuccadev-labs/barrits";

import { customers, inventoryMovements } from "../data/operational-data.mjs";

export const createCollectionExamples = () => {
  const uniqueCustomers = uniqueBy(customers, (customer) => `${customer.region}:${customer.name}`);
  const customersByRegion = groupBy(uniqueCustomers, (customer) => customer.region);
  const inventoryBySku = indexBy(inventoryMovements, (movement) => movement.sku);
  const customerBatches = chunk(uniqueCustomers, 2);

  return {
    uniqueCustomers: uniqueCustomers.map((customer) => customer.id),
    customersByRegion: Object.fromEntries(Array.from(customersByRegion.entries()).map(([region, regionCustomers]) => [
      region,
      regionCustomers.map((customer) => customer.name),
    ])),
    inventoryBySku: Object.fromEntries(Array.from(inventoryBySku.entries())),
    customerBatches: customerBatches.map((batch) => batch.map((customer) => customer.id)),
  };
};