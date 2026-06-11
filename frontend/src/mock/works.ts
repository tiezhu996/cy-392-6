import type { CraftWork } from "../types/work";

const author = { id: "a-1", name: "林木手作", bio: "喜欢把日常材料变成温暖物件。", followed: false };

const sampleComments = [
  [
    { id: "c-1", author: "小手作", content: "步骤写得很清楚，跟着做成功了！", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "c-2", author: "慢生活", content: "成品比想象中好看，材料包配得很用心。", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() }
  ],
  [
    { id: "c-3", author: "木艺新人", content: "请教一下，打磨到多少目比较合适？", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() }
  ],
  [
    { id: "c-4", author: "陶艺爱好者", content: "第一次做没开裂，开心！", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: "c-5", author: "陶艺爱好者", content: "烧完颜色比原图深一点，不过也很好看。", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "c-6", author: "新手小白", content: "请问用的是什么土？", createdAt: new Date(Date.now() - 6 * 3600000).toISOString() }
  ],
  [],
  [
    { id: "c-7", author: "纸艺控", content: "光影效果绝了，放床头超有氛围。", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() }
  ],
  [
    { id: "c-8", author: "绣娘阿花", content: "针脚很细腻，学习了～", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "c-9", author: "DIY达人", content: "送给闺蜜当生日礼物，她超喜欢！", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() }
  ]
];

export const mockWorks: CraftWork[] = Array.from({ length: 18 }).map((_, index) => ({
  id: `work-${index + 1}`,
  title: ["羊毛杯垫", "樱桃木托盘", "陶土花器", "植鞣革卡包", "纸雕灯罩", "刺绣胸针"][index % 6],
  type: ["knit", "wood", "pottery", "leather", "paper", "embroidery"][index % 6] as CraftWork["type"],
  difficulty: ["beginner", "intermediate", "advanced"][index % 3] as CraftWork["difficulty"],
  materials: ["棉线", "木蜡油", "手缝针", "环保胶"].slice(0, (index % 4) + 1),
  durationHours: 2 + index,
  images: [`https://picsum.photos/seed/craft-${index}/520/${620 + (index % 5) * 90}`, `https://picsum.photos/seed/craft-extra-${index}/520/620`],
  description: "适合周末完成的手工作品，材料易得，步骤清晰，成品可以自用或送礼。",
  steps: ["准备材料并裁切", "按教程组装主体", "打磨边缘并整理细节", "拍照记录成品"],
  tutorialUrl: "https://example.com/tutorial",
  author,
  likes: 12 + index * 3,
  collected: index % 5 === 0,
  comments: sampleComments[index % 6].map((c, i) => ({ ...c, id: `c-${index}-${i}` })),
  createdAt: new Date(Date.now() - index * 86400000).toISOString()
}));
