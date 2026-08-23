import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "./icons";
import { SiteHeader } from "./site-header";
import { localePath, type Locale } from "@/lib/site";
import { projectRegistry } from "@/lib/projects";

export function ProjectShowcase({ id, locale }: { id: string; locale: Locale }) {
  const project = projectRegistry.find((item) => item.id === id);
  if (!project) return null;

  const title = project.title[locale];
  const description = project.description[locale];
  const isEnglish = locale === "en";

  return (
    <>
      <SiteHeader locale={locale} projectPage />
      <main className="showcase-main" lang={isEnglish ? "en" : "zh-CN"}>
        <section className="showcase-hero page-shell">
          <Link className="back-link" href={`${localePath(locale)}#project-directory`}>
            <ArrowIcon />
            {isEnglish ? "Back to project index" : "返回项目目录"}
          </Link>
          <p className="eyebrow"><span />{project.tags.join(" · ")}</p>
          <h1>{title}</h1>
          <p className="showcase-description">{description}</p>
          <div className="showcase-tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>
        <section className="showcase-content page-shell">
          <div className="showcase-preview">
            {project.previewImage ? <Image src={project.previewImage} alt="" fill sizes="(max-width: 760px) 92vw, 760px" priority /> : null}
          </div>
          <div className="showcase-note">
            <span className="detail-number">01</span>
            <div>
              <h2>{isEnglish ? "Project note" : "项目说明"}</h2>
              <p>{isEnglish ? "This entry preserves the original project boundary. The portfolio presents the interface, implementation direction, and available preview without pretending a local-only service is a hosted product." : "本条目保留原项目边界：作品集展示界面、实现方向与可用预览，不把只能在本地运行的服务包装成已上线产品。"}</p>
              {project.demoPath ? (
                <a className="button button-primary" href={project.demoPath} target="_blank" rel="noopener noreferrer">
                  {isEnglish ? "Open demo" : "打开演示"}<ArrowIcon />
                </a>
              ) : null}
              <a className="button button-ghost" href={`https://github.com/${project.repo}`} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowIcon />
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
