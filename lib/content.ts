import type { Locale } from "./site";

export type Copy = {
  nav: {
    work: string;
    expertise: string;
    about: string;
    language: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primary: string;
    secondary: string;
    status: string;
  };
  stats: Array<{ value: string; label: string }>;
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    featured: string;
    openRppg: {
      title: string;
      subtitle: string;
      description: string;
      tags: string[];
      details: string;
      live: string;
      github: string;
      materials: string;
    };
  };
  expertise: {
    eyebrow: string;
    title: string;
    items: Array<{ number: string; title: string; description: string }>;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    contact: string;
  };
  footer: string;
  detail: {
    back: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    live: string;
    source: string;
    overviewTitle: string;
    overview: string;
    capabilityTitle: string;
    capabilities: Array<{ title: string; description: string }>;
    architectureTitle: string;
    architecture: Array<{ label: string; value: string }>;
    materialsTitle: string;
    materialsIntro: string;
    materials: Array<{ title: string; description: string }>;
    privacyTitle: string;
    privacy: string;
    visitGithub: string;
  };
};

const zh: Copy = {
  nav: {
    work: "项目",
    expertise: "能力",
    about: "关于",
    language: "EN",
  },
  hero: {
    eyebrow: "COMPUTATIONAL VISION · WEB ML",
    title: "让机器理解",
    accent: "生命的微弱信号",
    description:
      "聚焦远程生理信号感知、计算机视觉与浏览器端机器学习，把研究原型打磨成可体验、可解释的产品。",
    primary: "查看项目",
    secondary: "GitHub",
    status: "持续构建中",
  },
  stats: [
    { value: "01", label: "公开项目" },
    { value: "100%", label: "浏览器端体验" },
    { value: "∞", label: "探索空间" },
  ],
  projects: {
    eyebrow: "SELECTED WORK",
    title: "从研究到真实体验",
    intro: "每个项目都从一个清晰的问题开始，以可靠、克制的实现抵达用户。",
    featured: "FEATURED · 01",
    openRppg: {
      title: "Open‑rPPG",
      subtitle: "用普通摄像头感知心率",
      description:
        "一套面向浏览器的非接触式生理信号体验。通过摄像头捕捉面部细微颜色变化，结合 FacePhys 推理与 Worker 并行处理，实时估算心率。",
      tags: ["rPPG", "FacePhys", "Web Worker", "Computer Vision"],
      details: "查看详情",
      live: "在线体验",
      github: "GitHub",
      materials: "项目材料",
    },
  },
  expertise: {
    eyebrow: "EXPERTISE",
    title: "跨越算法、系统与交互",
    items: [
      {
        number: "01",
        title: "远程生理感知",
        description: "从面部视频中提取微弱的脉搏信号，关注稳定性、实时性与可解释性。",
      },
      {
        number: "02",
        title: "浏览器端机器学习",
        description: "让模型在用户设备上运行，减少数据传输并保留更直接的交互体验。",
      },
      {
        number: "03",
        title: "性能工程",
        description: "使用 Worker 和分层处理管线隔离计算压力，保持界面流畅与反馈及时。",
      },
    ],
  },
  about: {
    eyebrow: "ABOUT",
    title: "为值得理解的问题写代码",
    description:
      "我是 Blues‑berry。我的工作连接计算机视觉、健康感知与 Web 工程。我喜欢把复杂算法变成任何人都能打开、理解并亲自尝试的体验。",
    contact: "在 GitHub 上联系我",
  },
  footer: "为开放探索而构建。",
  detail: {
    back: "返回作品集",
    eyebrow: "PROJECT · REMOTE PHYSIOLOGY",
    title: "Open‑rPPG",
    subtitle:
      "把摄像头变成非接触式生理传感器，在浏览器中完成从视频采集到心率反馈的完整体验。",
    live: "启动在线体验",
    source: "查看源代码",
    overviewTitle: "项目概览",
    overview:
      "传统心率测量依赖接触式传感器。远程光电容积描记（rPPG）利用皮肤随血液容积变化产生的细微颜色波动，从普通视频中恢复脉搏信号。Open‑rPPG 将这条处理链带进浏览器，让访问者无需安装应用即可体验。",
    capabilityTitle: "核心能力",
    capabilities: [
      {
        title: "实时摄像头采集",
        description: "直接使用浏览器媒体接口获取画面，以明确的权限提示保护用户控制权。",
      },
      {
        title: "FacePhys 推理",
        description: "围绕面部区域提取与生理信号估计组织推理流程，输出直观的心率反馈。",
      },
      {
        title: "Worker 并行管线",
        description: "将高频计算移出主线程，降低模型推理对界面响应和视频预览的影响。",
      },
      {
        title: "本地优先",
        description: "核心体验在访问者设备上完成，作品集主页不加载或复制大型模型资源。",
      },
    ],
    architectureTitle: "体验路径",
    architecture: [
      { label: "01 · INPUT", value: "摄像头视频帧" },
      { label: "02 · DETECT", value: "面部区域定位" },
      { label: "03 · INFER", value: "FacePhys 信号估计" },
      { label: "04 · OUTPUT", value: "实时心率反馈" },
    ],
    materialsTitle: "项目材料",
    materialsIntro:
      "代码、实现说明与后续研究材料集中维护，避免演示站与项目资料出现版本偏差。",
    materials: [
      {
        title: "源代码",
        description: "查看完整实现、提交历史和技术说明。",
      },
      {
        title: "实现说明",
        description: "架构、运行方式与浏览器兼容信息随仓库持续更新。",
      },
      {
        title: "在线演示",
        description: "在支持摄像头与安全上下文的现代浏览器中体验。",
      },
    ],
    privacyTitle: "隐私说明",
    privacy:
      "摄像头权限只应在用户主动启动体验后请求。Open‑rPPG 是研究与展示项目，不构成医疗器械，也不应替代专业诊断。",
    visitGithub: "打开项目仓库",
  },
};

const en: Copy = {
  nav: {
    work: "Work",
    expertise: "Expertise",
    about: "About",
    language: "中文",
  },
  hero: {
    eyebrow: "COMPUTATIONAL VISION · WEB ML",
    title: "Teaching machines to read",
    accent: "the faint signals of life",
    description:
      "Exploring remote physiology, computer vision, and in-browser machine learning—turning research prototypes into experiences people can use and understand.",
    primary: "Explore work",
    secondary: "GitHub",
    status: "Always building",
  },
  stats: [
    { value: "01", label: "Public project" },
    { value: "100%", label: "In-browser experience" },
    { value: "∞", label: "Room to explore" },
  ],
  projects: {
    eyebrow: "SELECTED WORK",
    title: "From research to real experience",
    intro:
      "Each project starts with a focused question and arrives through a dependable, considered implementation.",
    featured: "FEATURED · 01",
    openRppg: {
      title: "Open‑rPPG",
      subtitle: "Sensing heart rate with an everyday camera",
      description:
        "A contactless physiology experience for the browser. It observes subtle facial color changes, combines FacePhys inference with Worker-based processing, and estimates heart rate in real time.",
      tags: ["rPPG", "FacePhys", "Web Worker", "Computer Vision"],
      details: "View case study",
      live: "Live demo",
      github: "GitHub",
      materials: "Materials",
    },
  },
  expertise: {
    eyebrow: "EXPERTISE",
    title: "Across algorithms, systems, and interaction",
    items: [
      {
        number: "01",
        title: "Remote physiology",
        description:
          "Recovering faint pulse signals from facial video with attention to stability, speed, and clarity.",
      },
      {
        number: "02",
        title: "In-browser ML",
        description:
          "Running models on the visitor's device to reduce data movement and create more direct interaction.",
      },
      {
        number: "03",
        title: "Performance engineering",
        description:
          "Using Workers and layered pipelines to isolate compute pressure and keep feedback fluid.",
      },
    ],
  },
  about: {
    eyebrow: "ABOUT",
    title: "Writing code for questions worth understanding",
    description:
      "I’m Blues‑berry. My work connects computer vision, health sensing, and web engineering. I enjoy turning complex algorithms into experiences anyone can open, understand, and try.",
    contact: "Find me on GitHub",
  },
  footer: "Built for open exploration.",
  detail: {
    back: "Back to portfolio",
    eyebrow: "PROJECT · REMOTE PHYSIOLOGY",
    title: "Open‑rPPG",
    subtitle:
      "Turning a camera into a contactless physiology sensor, with the full path from video capture to heart-rate feedback running in the browser.",
    live: "Launch live demo",
    source: "View source",
    overviewTitle: "Overview",
    overview:
      "Conventional heart-rate measurement relies on contact sensors. Remote photoplethysmography (rPPG) recovers a pulse signal from the tiny color variations created by blood-volume changes in the skin. Open‑rPPG brings this pipeline to the browser, with nothing to install.",
    capabilityTitle: "Core capabilities",
    capabilities: [
      {
        title: "Real-time camera capture",
        description:
          "Uses browser media APIs with explicit permission prompts that keep the visitor in control.",
      },
      {
        title: "FacePhys inference",
        description:
          "Organizes facial region extraction and physiological signal estimation into an understandable flow.",
      },
      {
        title: "Worker-based pipeline",
        description:
          "Moves frequent compute away from the main thread to protect video and interface responsiveness.",
      },
      {
        title: "Local first",
        description:
          "The core experience runs on the visitor's device; the portfolio never duplicates heavy model assets.",
      },
    ],
    architectureTitle: "Experience path",
    architecture: [
      { label: "01 · INPUT", value: "Camera video frames" },
      { label: "02 · DETECT", value: "Face region detection" },
      { label: "03 · INFER", value: "FacePhys signal estimate" },
      { label: "04 · OUTPUT", value: "Live heart-rate feedback" },
    ],
    materialsTitle: "Project materials",
    materialsIntro:
      "Code, implementation notes, and future research material stay together so the demo and documentation remain aligned.",
    materials: [
      {
        title: "Source code",
        description: "Browse the implementation, commit history, and technical notes.",
      },
      {
        title: "Implementation notes",
        description:
          "Architecture, setup, and browser compatibility evolve with the repository.",
      },
      {
        title: "Online demo",
        description:
          "Try the project in a modern browser with camera access and a secure context.",
      },
    ],
    privacyTitle: "Privacy note",
    privacy:
      "Camera access should only be requested after the visitor starts the experience. Open‑rPPG is a research and demonstration project—not a medical device or a substitute for professional diagnosis.",
    visitGithub: "Open project repository",
  },
};

export const copy: Record<Locale, Copy> = { zh, en };
