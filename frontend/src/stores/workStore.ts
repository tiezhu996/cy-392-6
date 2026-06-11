import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { mockWorks } from "../mock/works";
import { readWorks, writeWorks } from "../storage/indexedDb";
import type { Comment, CraftWork } from "../types/work";
import { filterWorks, type WorkFilter } from "../utils/filter";

export const useWorkStore = defineStore("works", () => {
  const works = ref<CraftWork[]>([]);
  const filter = ref<WorkFilter>({ keyword: "", type: "all", difficulty: "all", sort: "latest", onlyCollected: false });
  const selected = ref<CraftWork | null>(null);
  const displayed = computed(() => filterWorks(works.value, filter.value));
  async function hydrate() {
    const saved = await readWorks();
    works.value = saved.length ? saved : mockWorks;
    if (!saved.length) await writeWorks(works.value);
  }
  function persist() { writeWorks(works.value); }
  function like(id: string) { const item = works.value.find((w) => w.id === id); if (item) item.likes += 1; persist(); }
  function collect(id: string) { const item = works.value.find((w) => w.id === id); if (item) item.collected = !item.collected; persist(); }
  function follow(authorId: string) { works.value.forEach((w) => { if (w.author.id === authorId) w.author.followed = !w.author.followed; }); persist(); }
  function addWork(work: CraftWork) { works.value.unshift(work); persist(); }
  function addComment(workId: string, content: string, authorName = "我") {
    const item = works.value.find((w) => w.id === workId);
    if (item) {
      const comment: Comment = {
        id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        author: authorName,
        content,
        createdAt: new Date().toISOString()
      };
      item.comments.push(comment);
      persist();
    }
  }
  return { works, filter, selected, displayed, hydrate, like, collect, follow, addWork, addComment };
});
