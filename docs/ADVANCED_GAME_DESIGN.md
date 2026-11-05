# 双语进阶版：定位、规则与验证

## WITHERROOT: FROSTBOUND

- 定位：回合制路线规划与资源管理。玩家从核心延伸根系，利用根系衰败后的灰烬降低生长消耗，收集记忆并保护核心。
- 一次选择：选择相邻格生长或使用能力；每次行动推动时间。五关逐步引入灰烬、记忆、霜冻和能力。
- 核心变化：提前决定下一波霜冻的真实方向，以状态栏和棋盘蓝色边缘显示。已预告方向写入撤销快照与存档；霜冻发生后产生下一次预告。
- 胜负：完成当前关卡目标并领取遗物进入下一关；核心被霜冻触及或生命力耗尽时失败。撤销可恢复前一步的棋盘、能力次数和霜冻预告。
- 参考：[Into the Breach 官方介绍](https://subsetgames.com/itb.html) 中提前展示威胁、让玩家规划回应的设计原则。题材、视觉和规则均为本项目实现。

## STELLAR FORGE: LAST STAND

- 定位：限量部署的元素融合塔防。防守核心并击败第 20 波首领；首领抵达核心即失败，普通敌人造成生命损失。
- 一次选择：在六列中选择位置投放元素星核；同元素同等级相邻星核融合。星核自动攻击，玩家选择元素、位置、进化与波间遗物。可使用「拆除」消耗 1 点部署能量，移除指定列最上方星核，为重新布局腾出空间；空列不扣点。
- 核心变化：每次投放消耗 1 点部署能量，战斗时每 2 秒恢复 1 点，上限 6 点。首局在第 3、5、7、10 波解锁水、土、风、雷；第 7 波提示玩家为下一波飞行敌人准备风或雷。
- 参考：[Vampire Survivors 官方介绍](https://poncle.games/vampire-survivors) 中围绕生存和局内成长组织目标的做法。本作保留自己的网格投放、元素融合和塔防规则。

## 版本与测试范围

- 两个进阶版使用独立地址与独立本地存档；原版继续保留。原版同时修正中文事件与操作提示、英文升级说明，以及随机霜冻模式中错误的单一方向预测。
- 两种语言的 STELLAR FORGE 进阶版使用正常游戏动作进行加速自动试玩，分别经过 20 波并到达胜利；另检查部署能量耗尽和恢复、商店、遗物与首领波次。测试策略使用火和风元素并选择波间治疗，不能代表所有随机局面或真人体验。
- WITHERROOT 进阶版从新存档实测前两关和奖励；另用已解锁至第三关的测试存档依次完成第三至第五关，核对第 10 回合霜冻方向与预告一致，并检查中英文事件、语言切换及独立存档。外部玩家的完整试玩尚未进行。
- 真人首次试玩、平衡性和设备覆盖仍需继续收集；不能将内部模拟称作玩家验证。

## 封面生成记录

本轮使用内置 imagegen 生成无文字封面，分别保存为 `public/projects/covers/witherroot-frostbound.png` 与 `public/projects/covers/stellar-last-stand.png`。

- WITHERROOT 提示词：Landscape game cover illustration, no words or typography. A lone luminous amber root heart in a dark ruined frostbound garden, branching delicate roots weaving through warm ash toward small blue diamond memories, an advancing crystalline ice front visible in the distance. High contrast, handcrafted painterly 2D indie puzzle art, warm copper against icy cyan, legible large shapes, moody and hopeful, no existing game characters or logos.
- STELLAR FORGE 提示词：Landscape game cover illustration, no words or typography. An original sci-fi tower defense scene: luminous elemental star cores arranged along a defensive grid, fire and wind energy converge against a dark void swarm approaching a single glowing heart. Clear silhouette, vivid cyan and molten gold, deep navy cosmic background, painterly 2D indie game art, dramatic composition, no existing game characters or logos.

## 2026-11-05 玩法追加

- STELLAR FORGE: LAST STAND 增加拆除模式，允许花费一次部署重新整理阵型；空列和部署点不足时不会消耗资源。
- WITHERROOT: FROSTBOUND 修复修剪、余烬转换及霜盾的撤销状态，恢复棋盘、能力次数和预告；撤销后会更新存档。
- 内部运行检查覆盖星核放置、拆除、空列、能量扣除、修剪与余烬撤销，以及第一关正常完成。外部玩家对新机制的理解和手感仍未测试。
