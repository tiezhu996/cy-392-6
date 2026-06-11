import { describe, expect, it } from "vitest";
import { migrateWork, type CraftWork, type Comment } from "../types/work";
import { filterWorks, type WorkFilter } from "../utils/filter";

const baseWork: CraftWork = {
  id: "work-test",
  title: "测试作品",
  type: "knit",
  difficulty: "beginner",
  materials: ["棉线"],
  durationHours: 2,
  images: ["https://example.com/img.jpg"],
  description: "测试描述",
  steps: ["步骤一"],
  author: { id: "a-1", name: "林木手作", bio: "简介", followed: false },
  likes: 10,
  collected: false,
  comments: [],
  createdAt: "2025-01-01T00:00:00.000Z"
};

describe("migrateWork", () => {
  it("完整数据通过迁移后保持不变", () => {
    const comment: Comment = { id: "c-1", author: "用户A", content: "很棒", createdAt: "2025-06-01T00:00:00.000Z" };
    const input = { ...baseWork, comments: [comment] };
    const result = migrateWork(input as Record<string, unknown>);
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].content).toBe("很棒");
    expect(result.id).toBe("work-test");
    expect(result.likes).toBe(10);
  });

  it("缺少 comments 字段时补全为空数组", () => {
    const { comments: _, ...withoutComments } = baseWork;
    const result = migrateWork(withoutComments as Record<string, unknown>);
    expect(result.comments).toEqual([]);
  });

  it("comments 为 undefined 时补全为空数组", () => {
    const input = { ...baseWork, comments: undefined };
    const result = migrateWork(input as Record<string, unknown>);
    expect(result.comments).toEqual([]);
  });

  it("comments 为 null 时补全为空数组", () => {
    const input = { ...baseWork, comments: null };
    const result = migrateWork(input as Record<string, unknown>);
    expect(result.comments).toEqual([]);
  });

  it("comments 为非数组值时补全为空数组", () => {
    const input = { ...baseWork, comments: "invalid" };
    const result = migrateWork(input as Record<string, unknown>);
    expect(result.comments).toEqual([]);
  });

  it("缺少其他可选字段时使用默认值", () => {
    const minimal = {
      id: "work-min",
      title: "最小作品",
      type: "knit",
      difficulty: "beginner",
      author: { id: "a-1", name: "林木手作", bio: "简介", followed: false }
    };
    const result = migrateWork(minimal as Record<string, unknown>);
    expect(result.comments).toEqual([]);
    expect(result.likes).toBe(0);
    expect(result.collected).toBe(false);
    expect(result.materials).toEqual([]);
    expect(result.images).toEqual([]);
    expect(result.steps).toEqual([]);
    expect(result.durationHours).toBe(0);
    expect(result.description).toBe("");
  });

  it("迁移后返回的对象可以直接访问 comments.length 不报错", () => {
    const { comments: _, ...withoutComments } = baseWork;
    const result = migrateWork(withoutComments as Record<string, unknown>);
    expect(() => result.comments.length).not.toThrow();
    expect(result.comments.length).toBe(0);
  });
});

describe("filterWorks - 互动热度排序", () => {
  const works: CraftWork[] = [
    { ...baseWork, id: "w-1", likes: 5, comments: Array(10).fill({ id: "c", author: "a", content: "x", createdAt: "2025-01-01T00:00:00.000Z" }), createdAt: "2025-01-01T00:00:00.000Z" },
    { ...baseWork, id: "w-2", likes: 100, comments: Array(1).fill({ id: "c", author: "a", content: "x", createdAt: "2025-01-01T00:00:00.000Z" }), createdAt: "2025-01-02T00:00:00.000Z" },
    { ...baseWork, id: "w-3", likes: 20, comments: [], createdAt: "2025-01-03T00:00:00.000Z" }
  ];

  it("engagement 排序按 likes*1 + comments.length*3 降序", () => {
    const filter: WorkFilter = { keyword: "", type: "all", difficulty: "all", sort: "engagement", onlyCollected: false };
    const result = filterWorks(works, filter);
    expect(result.map((w) => w.id)).toEqual(["w-2", "w-1", "w-3"]);
  });

  it("hot 排序仅按 likes 降序", () => {
    const filter: WorkFilter = { keyword: "", type: "all", difficulty: "all", sort: "hot", onlyCollected: false };
    const result = filterWorks(works, filter);
    expect(result.map((w) => w.id)).toEqual(["w-2", "w-3", "w-1"]);
  });

  it("latest 排序按 createdAt 降序", () => {
    const filter: WorkFilter = { keyword: "", type: "all", difficulty: "all", sort: "latest", onlyCollected: false };
    const result = filterWorks(works, filter);
    expect(result.map((w) => w.id)).toEqual(["w-3", "w-2", "w-1"]);
  });

  it("comments 为空的旧作品参与互动热度排序不报错", () => {
    const oldWorks: CraftWork[] = [
      { ...baseWork, id: "old-1", likes: 50, comments: [], createdAt: "2025-01-01T00:00:00.000Z" },
      { ...baseWork, id: "old-2", likes: 10, comments: [], createdAt: "2025-01-01T00:00:00.000Z" }
    ];
    const filter: WorkFilter = { keyword: "", type: "all", difficulty: "all", sort: "engagement", onlyCollected: false };
    expect(() => filterWorks(oldWorks, filter)).not.toThrow();
    const result = filterWorks(oldWorks, filter);
    expect(result[0].id).toBe("old-1");
    expect(result[1].id).toBe("old-2");
  });
});
