import { cache } from "react";

export type ProjectLocale = "zh" | "en";

export type ProjectDefinition = {
  id: string;
  order: number;
  repo: string;
  status: "live" | "demo" | "snapshot" | "collection";
  presentation: "featured" | "demo" | "snapshot" | "collection";
  featured?: boolean;
  title: Record<ProjectLocale, string>;
  description: Record<ProjectLocale, string>;
  tags: string[];
  demoUrl?: string;
  demoPath?: string;
  previewImage?: string;
  caseStudyPath?: string;
};

export type GitHubRepository = {
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string | null;
  updated_at: string;
  archived: boolean;
  default_branch: string;
};

/**
 * The only file that needs editing when a new GitHub project is added.
 * Keep presentation copy here; repository facts are fetched from GitHub.
 */
export const projectRegistry: ProjectDefinition[] = [
  {
    id: "open-rppg",
    order: 1,
    repo: "Blues-berry/open-rppg",
    status: "live",
    presentation: "featured",
    featured: true,
    title: { zh: "Open‑rPPG", en: "Open‑rPPG" },
    description: {
      zh: "用普通摄像头感知心率",
      en: "Sensing heart rate with an everyday camera",
    },
    tags: ["rPPG", "FacePhys", "Web Worker", "Computer Vision"],
    demoUrl: "https://open-rppg-nu.vercel.app/#experience",
    caseStudyPath: "/projects/open-rppg/case-study",
  },
  {
    id: "game-demos",
    order: 2,
    repo: "Blues-berry/game",
    status: "demo",
    presentation: "demo",
    title: { zh: "互动游戏 Demo", en: "Interactive Game Demos" },
    description: {
      zh: "两个可直接游玩的实验性游戏，探索社死、规则与选择。",
      en: "Two playable experiments about social friction, rules, and choice.",
    },
    tags: ["HTML", "JavaScript", "Interactive Fiction"],
    caseStudyPath: "/projects/game-demos",
  },
  {
    id: "xiulian",
    order: 3,
    repo: "Blues-berry/xiulian",
    status: "demo",
    presentation: "demo",
    title: { zh: "修炼：规则协议", en: "Xiu Lian: Protocol" },
    description: {
      zh: "一款规则怪谈视觉小说，围绕调查、推理与多结局选择展开。",
      en: "A rules-horror visual novel about investigation, deduction, and branching endings.",
    },
    tags: ["React", "Vite", "Visual Novel", "Interactive Fiction"],
    demoPath: "/project-demos/xiulian/index.html",
    previewImage: "/projects/previews/protocol-endgame.svg",
  },
  {
    id: "game1",
    order: 4,
    repo: "Blues-berry/game1",
    status: "demo",
    presentation: "demo",
    title: { zh: "进化战场", en: "Evolution Arena" },
    description: {
      zh: "浏览器里的波次战斗实验，包含技能、遗物、商店与成长选择。",
      en: "A browser combat experiment with waves, skills, relics, shops, and progression choices.",
    },
    tags: ["React", "Vite", "Game", "Canvas"],
    demoPath: "/project-demos/game1/index.html",
    previewImage: "/projects/previews/evolution-arena.svg",
  },
  {
    id: "game0",
    order: 5,
    repo: "local/game0",
    status: "demo",
    presentation: "demo",
    title: { zh: "Game 0 · HTML 实验", en: "Game 0 · HTML Experiment" },
    description: {
      zh: "单文件 HTML 游戏原型，保留原始演示形态，打开即可体验。",
      en: "A single-file HTML game prototype kept in its original, instantly playable form.",
    },
    tags: ["HTML", "JavaScript", "Prototype"],
    demoPath: "/project-demos/game0/index.html",
    previewImage: "/projects/previews/game0.svg",
  },
  {
    id: "qifei",
    order: 6,
    repo: "local/qifei",
    status: "snapshot",
    presentation: "snapshot",
    title: { zh: "终焉协议", en: "Protocol: Endgame" },
    description: {
      zh: "规则怪谈交互式视觉小说，探索信任、生存点与六种结局。",
      en: "An interactive rules-horror visual novel built around trust, survival points, and six endings.",
    },
    tags: ["Next.js", "Visual Novel", "Branching Story"],
    caseStudyPath: "/projects/qifei",
    previewImage: "/projects/previews/protocol-endgame.svg",
  },
  {
    id: "fde",
    order: 7,
    repo: "local/fde-radar",
    status: "snapshot",
    presentation: "snapshot",
    title: { zh: "Amazon FDE 运营异常雷达", en: "Amazon FDE Operations Radar" },
    description: {
      zh: "本地优先的运营诊断与任务闭环工具，覆盖异常、证据、审批与复盘。",
      en: "A local-first operations diagnosis tool connecting anomalies, evidence, approvals, and review.",
    },
    tags: ["Python", "Analytics", "Operations", "Local-first"],
    caseStudyPath: "/projects/fde",
    previewImage: "/projects/previews/fde-opportunity.png",
  },
  {
    id: "workflow",
    order: 8,
    repo: "local/workflow",
    status: "collection",
    presentation: "collection",
    title: { zh: "Workflow · Agent 项目集", en: "Workflow · Agent Collection" },
    description: {
      zh: "六个面向餐饮、医疗、物业、家政、财务与内容工作的 Agent 实验集合。",
      en: "A collection of six Agent experiments for restaurants, clinics, property, home services, finance, and publishing.",
    },
    tags: ["Agents", "Automation", "Python", "Workflow"],
    caseStudyPath: "/projects/workflow",
    previewImage: "/projects/previews/workflow-agent.png",
  },
];

const githubHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

export const getGitHubRepository = cache(
  async (repo: string): Promise<GitHubRepository | null> => {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: githubHeaders,
        next: { revalidate: 3600, tags: ["github-projects"] },
      });

      if (!response.ok) return null;
      return (await response.json()) as GitHubRepository;
    } catch {
      // A GitHub outage must not take down the portfolio.
      return null;
    }
  },
);

export const getProjectRegistry = cache(async () =>
  Promise.all(
    projectRegistry.map(async (project) => ({
      ...project,
      github: await getGitHubRepository(project.repo),
    })),
  ),
);
