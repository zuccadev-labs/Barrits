import { paginate, partitionBy, rankBy, topK } from "barrits";

import { incidents, releaseCandidates } from "../data/operational-data.mjs";

export const createSelectionExamples = () => {
  const releaseRanking = rankBy(releaseCandidates, [
    { project: (candidate) => candidate.risk, direction: "asc" },
    { project: (candidate) => candidate.coverage, direction: "desc" },
  ]);
  const criticalWindow = topK(incidents, 3, (left, right) => {
    const leftPriority = (left.severity * 1000) + left.clientsAffected;
    const rightPriority = (right.severity * 1000) + right.clientsAffected;
    return leftPriority - rightPriority;
  });
  const pagedReleaseWindow = paginate(releaseCandidates, { page: 1, pageSize: 2 });
  const partitionedIncidents = partitionBy(incidents, (incident) => incident.severity >= 4);

  return {
    releaseRanking: releaseRanking.map((entry) => ({
      service: entry.value.service,
      rank: entry.rank,
      ordinal: entry.ordinal,
    })),
    criticalWindow: criticalWindow.map((incident) => incident.id),
    pagedReleaseWindow,
    partitionedIncidents: {
      escalated: partitionedIncidents.matched.map((incident) => incident.id),
      regular: partitionedIncidents.rejected.map((incident) => incident.id),
    },
  };
};