import { cache } from "react";

export type ProjectLocale = "zh" | "en";

export type ProjectDefinition = {
  id: string;
  order: number;
  repo: string;
  status: "live" | "demo" | "coming-soon";
  featured?: boolean;
  title: Record<ProjectLocale, string>;
  description: Record<ProjectLocale, string>;
  tags: string[];
  demoUrl?: string;
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
    title: { zh: "互动游戏 Demo", en: "Interactive Game Demos" },
    description: {
      zh: "两个可直接游玩的实验性游戏，探索社死、规则与选择。",
      en: "Two playable experiments about social friction, rules, and choice.",
    },
    tags: ["HTML", "JavaScript", "Interactive Fiction"],
    caseStudyPath: "/projects/game-demos",
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
