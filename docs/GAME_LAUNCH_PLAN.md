# 游戏上架与完善计划

## 当前状态（2026-11-04）

- WITHERROOT 与 STELLAR FORGE 已完成玩法整理、英文版本、封面/美术、移动端修整和内部浏览器回归；两款游戏已加入中英文试玩目录。Vite 双语构建、项目类型检查和 Next.js 生产构建均通过。
- 两款游戏已通过 GitHub 主分支触发 Vercel 正式部署；生产状态为成功。生产环境中英文游戏目录、两款游戏直达入口与英文游戏资源均已核对。
- 生产链接：[中文游戏目录](https://chexueyuan.vercel.app/projects/game-demos) · [English Games](https://chexueyuan.vercel.app/en/projects/game-demos) · [WITHERROOT — Decay to Rebirth](https://chexueyuan.vercel.app/project-demos/game0/index.html?lang=en) · [STELLAR FORGE](https://chexueyuan.vercel.app/project-demos/game1-en/index.html#/game)。
- Vite 双语构建、项目类型检查、Next.js 生产构建和内部浏览器回归通过；生产浏览器可打开 STELLAR FORGE 英文教程并开始第一波。没有进行外部首次玩家可用性测试，因此不把内部验证描述成外部试玩结果。

## 后续游戏的制作顺序

已公开目录原有三款游戏；本次为 WITHERROOT 与 STELLAR FORGE 完成双语试玩版本并加入目录。Office Cringe 的英文副本是私有测试草稿；它不替换现有页面，也不算作公开版本。

本次两款游戏已按以下顺序完成制作并在作品集公开。其余尚未完成的游戏仍按这套流程推进，玩法、美术、英文化和内部回归完成后再上线：

1. **玩法定稿：** 明确核心循环、胜负条件、关卡/波次节奏、教程、奖励和难度；先把玩法做完整并确认可通关。
2. **美术完成：** 再统一游戏内视觉、界面图标、封面和商店截图；美术需匹配已经定稿的玩法与英文标题。
3. **英文化：** 玩法和文案稳定后翻译游戏名称、教程、界面、剧情/关卡、奖励、错误提示及 itch.io 页面；逐屏检查无残留中文、截断或布局溢出。
4. **修 bug 与验收：** 对中英文版本做新存档完整流程、保存/刷新/重进、桌面与手机视口回归；修复阻断和严重问题后复测，并记录已知限制。
5. **上线：** 只有玩法、美术、英文版本和回归验收全部通过后，才加入公开游戏页并发布。

本次依次完善了 **WITHERROOT** 和 **STELLAR FORGE**。后续未完成游戏仍按“玩法 → 美术 → 英文化 → Bug 回归 → 上线”推进。

## 本次上架范围

上架位置：作品集游戏页 `/projects/game-demos`（英文页 `/en/projects/game-demos`）。目录现在包含以下五款：

| 游戏 | 选择依据 | 上架入口 |
| --- | --- | --- |
| 职场社死模拟器 / Office Cringe Simulator | 已包含 14 个职场场景、剧情/肉鸽/限时/生存等多种模式、设置和本地存档；主入口与独立游戏页已接好。 | `/projects/game-demos/office-cringe` |
| Beyond the Rules / 打破规则 | 七日规则怪谈叙事，已有独立打包资源和游戏详情页，玩法目标清楚。 | `/projects/game-demos/beyond-the-rules` |
| 终焉协议 / Protocol: Endgame | 已打包为可直接进入的完整界面，含章节选择、存档、档案/流程图和七种结局图鉴。 | `/project-demos/qifei/index.html` |
| WITHERROOT — Decay to Rebirth | 五关渐进主线、关卡奖励和双语界面；含英文入口与独立封面。 | `/project-demos/game0/index.html?lang=en` |
| STELLAR FORGE | 元素融合与塔防玩法、教程和首领结局；含英文独立构建与英文封面。 | `/project-demos/game1-en/index.html` |

页面中英文文案和入口已同步为五款可玩游戏，并把《终焉协议》的结局数统一为七种。

## WITHERROOT 完善与发布记录

状态：已完成双语版本并发布到作品集。英文名为 **WITHERROOT — Decay to Rebirth**，线上入口为 [英文版](https://chexueyuan.vercel.app/project-demos/game0/index.html?lang=en)。

- 玩法：完成五关渐进主线、关后遗物奖励和长期进度保存；从新存档覆盖五关流程、领奖、解锁、刷新和重进回归。
- 美术与本地化：完成独立封面、英文游戏内文案及手机窄屏布局核对。
- 验收边界：内部回归未发现阻断问题；生产静态入口返回正常。外部首次玩家可用性测试尚未进行，后续可用于收集上架后的改进意见。

## STELLAR FORGE 完善与发布记录

状态：已完成中英文独立构建并发布到作品集。英文版入口为 [STELLAR FORGE](https://chexueyuan.vercel.app/project-demos/game1-en/index.html#/game)。

- 玩法：加入首次进入教程和波次 20 首领胜利结局；修正子路径深链接处理，直接打开英文入口可进入游戏。
- 美术与适配：完成英文封面、移动端 HUD 与帮助页布局调整。
- 验收：中英文构建及类型检查通过；内部浏览器确认教程可逐页查看、可开始第一波，生产英文页资源已加载且控制台没有错误。完整 20 波人工通关和外部首次玩家可用性测试尚未记录，列为发布后补充验证。

## 本次上线检查记录

- 中英文游戏目录均在生产环境返回正常页面；五款游戏入口和两款新游戏卡片均已出现。
- WITHERROOT 英文入口、STELLAR FORGE 中文/英文直达入口及封面资源可访问。
- STELLAR FORGE 生产英文版可显示完整首次教程并进入第一波；内部桌面与常见手机宽度布局回归已通过。
- 本次未进行外部首次玩家试玩；STELLAR FORGE 完整 20 波人工通关也尚未记录，后续应补做并将结果作为平衡调整依据。

## 其余游戏的上线门槛

- 玩法、胜负条件和教程定稿；从新存档完整走通核心流程，覆盖刷新与存档恢复。
- 完成与玩法一致的美术、封面、商店截图和英文适配。
- 中英文版本通过桌面与常见手机视口检查；直接入口、刷新和返回正常。
- P0/P1 级问题清零，保留回归记录和已知限制；外部首次玩家试玩结果单独标记，不把小样本结果表述为留存或转化结论。
