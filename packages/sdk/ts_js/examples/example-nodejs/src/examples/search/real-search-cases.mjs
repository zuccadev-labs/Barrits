import { binarySearch, findSortedRange, linearSearch, lowerBound, upperBound } from "@zuccadev-labs/barrits";

import { incidents, packageWeights } from "../data/operational-data.mjs";

export const createSearchExamples = () => {
  const incidentsBySeverity = [...incidents].sort((left, right) => left.severity - right.severity);
  const firstCatalogIncidentIndex = linearSearch(incidents, (incident) => incident.squad === "catalog");
  const firstPackageAbove21 = lowerBound(packageWeights, 21);
  const package34Range = findSortedRange(packageWeights, 34);

  return {
    firstCatalogIncident: incidents[firstCatalogIncidentIndex],
    exactPackageWeightIndex: binarySearch(packageWeights, 34),
    insertionPointForWeight21: firstPackageAbove21,
    nextInsertionPointAfterWeight21: upperBound(packageWeights, 21),
    duplicatePackage34Range: package34Range,
    lightestCriticalIncident: incidentsBySeverity.at(-1),
  };
};