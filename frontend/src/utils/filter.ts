import type { CraftWork } from "../types/work";

export interface WorkFilter {
  keyword: string;
  type: string;
  difficulty: string;
  sort: "latest" | "hot" | "engagement";
  onlyCollected: boolean;
}

function engagementScore(work: CraftWork) {
  return work.likes * 1 + work.comments.length * 3;
}

export function filterWorks(works: CraftWork[], filter: WorkFilter) {
  return works.filter((work) => {
    const textMatch = `${work.title} ${work.description}`.toLowerCase().includes(filter.keyword.toLowerCase());
    const typeMatch = filter.type === "all" || work.type === filter.type;
    const diffMatch = filter.difficulty === "all" || work.difficulty === filter.difficulty;
    const collectMatch = !filter.onlyCollected || work.collected;
    return textMatch && typeMatch && diffMatch && collectMatch;
  }).sort((a, b) => {
    if (filter.sort === "hot") return b.likes - a.likes;
    if (filter.sort === "engagement") return engagementScore(b) - engagementScore(a);
    return b.createdAt.localeCompare(a.createdAt);
  });
}
