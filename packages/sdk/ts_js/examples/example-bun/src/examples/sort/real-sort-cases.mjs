import { insertSorted, orderBy, quickSort, stableSortBy } from "@zuccadev-labs/barrits";

import { incidents, packageWeights, releaseCandidates } from "../data/operational-data.mjs";

export const createSortExamples = () => {
  const sortedWeights = quickSort(packageWeights);
  const sortedIncidentQueue = orderBy(incidents, [
    { project: (incident) => incident.severity, direction: "desc" },
    { project: (incident) => incident.clientsAffected, direction: "desc" },
    { project: (incident) => incident.latencyMs, direction: "desc" },
  ]);
  const stableCandidates = stableSortBy(releaseCandidates, (candidate) => candidate.team);

  return {
    sortedWeights,
    sortedIncidentQueue: sortedIncidentQueue.map((incident) => incident.id),
    stableCandidatesByTeam: stableCandidates.map((candidate) => `${candidate.team}:${candidate.service}`),
    insertedWeight: insertSorted(sortedWeights, 35),
  };
};
