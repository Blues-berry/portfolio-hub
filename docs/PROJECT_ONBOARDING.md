# 项目接入与自动同步指南

本文用于将新的子项目接入作品集网站，并让 GitHub 更新后自动刷新网站数据。

## 一、接入前准备

准备以下信息：

- GitHub 仓库，例如 `Blues-berry/my-project`
- 中文名、英文名、简介和标签
- 在线演示地址（如果有）
- 作品集内部路径（如果有）
- GitHub Webhook Secret

密钥不要写入本文档、源码、截图或提交记录。

## 二、登记项目

打开 `lib/projects.ts`，在 `projectRegistry` 中增加一项：

```ts
{
  id: "my-project",
  order: 3,
  repo: "Blues-berry/my-project",
  status: "demo", // live | demo | coming-soon
  title: { zh: "我的项目", en: "My Project" },
  description: {
    zh: "项目的一句话介绍。",
    en: "A one-line description of the project.",
  },
  tags: ["Web", "JavaScript"],
  demoUrl: "https://my-project.vercel.app",
  caseStudyPath: "/projects/my-project",
},
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 唯一 ID，只使用小写字母和短横线 |
| `order` | 是 | 项目排序编号 |
| `repo` | 是 | GitHub 的 `owner/repository` |
| `status` | 是 | `live`、`demo` 或 `coming-soon` |
| `title` | 是 | 中英文标题 |
| `description` | 是 | 中英文简介 |
| `tags` | 是 | 技术或项目标签 |
| `demoUrl` | 否 | 在线演示地址 |
| `caseStudyPath` | 否 | 作品集内部项目详情路径 |

GitHub 只能同步仓库元数据，不能自动推断标题、文案、路由和视觉样式；所以新项目仍需登记一次。

## 三、配置 GitHub Webhook

进入 GitHub 项目：`Settings` → `Webhooks` → `Add webhook`。

```text
Payload URL: https://你的作品集域名/api/github/webhook
Content type: application/json
Secret: 使用 GITHUB_WEBHOOK_SECRET 的值
Events: Just the push event
Active: 开启
```

收到合法 `push` 事件后，网站会清理 GitHub 项目缓存和作品集页面缓存；下一次访问时读取最新数据。

## 四、安全保存密钥

### 本地开发

项目根目录的 `.env.local` 是本地密钥位置，并且已被 `.gitignore` 忽略。不要提交它。

```env
GITHUB_TOKEN=
GITHUB_WEBHOOK_SECRET=
SYNC_SECRET=
```

本项目的 [`.env.example`](../.env.example) 只保存变量名，不保存真实值，方便复制配置。

### Vercel 线上环境

进入 Vercel：`Project Settings` → `Environment Variables`，添加以下变量并至少勾选 `Production`：

| 变量 | 必填 | 用途 |
| --- | --- | --- |
| `GITHUB_WEBHOOK_SECRET` | 是 | 校验 GitHub Webhook 来源 |
| `SYNC_SECRET` | 推荐 | 保护手动刷新接口 |
| `GITHUB_TOKEN` | 可选 | 提高 GitHub API 请求额度 |

Vercel 会加密保存这些值。不要使用 `NEXT_PUBLIC_` 前缀，否则密钥会暴露给浏览器。

## 五、测试接入

### 检查网站构建

```powershell
npm run typecheck
npm run lint
npm run build
```

### 手动刷新

配置 `SYNC_SECRET` 后：

```powershell
Invoke-WebRequest `
  -Method Post `
  -Uri "https://你的作品集域名/api/github/sync" `
  -Headers @{ Authorization = "Bearer 你的SYNC_SECRET" }
```

### 端到端测试

1. 在子项目中修改并提交代码。
2. 执行 `git push origin 分支名`。
3. 在 GitHub Webhook 的 `Recent Deliveries` 检查返回状态。
4. 回到作品集主页并强制刷新。

## 六、故障排查

- Webhook 返回 `401`：GitHub Secret 与 Vercel 的 `GITHUB_WEBHOOK_SECRET` 不一致。
- GitHub 数据为空：检查 `repo` 是否为 `owner/repository`，仓库是否公开。
- 页面没有项目：确认项目已加入 `lib/projects.ts`，并已部署到 Vercel。
- 更新未立即出现：检查 Webhook 是否为 `200`，再检查 Vercel 函数日志和缓存刷新。
