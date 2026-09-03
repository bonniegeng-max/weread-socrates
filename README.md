# 📚 weread-socrates · AI 伴读 · 苏格拉底式阅读教练

本地运行的 Web 应用：把微信读书的结构化整书数据（目录 + 简介 + 热门划线 + **你的个人划线/想法**）与大模型结合，提供 **"先建全局认知 → 再钻细节 → 对话内化 → 沉淀输出"** 的深读体验。

> 搜一本书 → 自动生成全书思维导图 → 勾选热门划线或自己的划线 → 与苏格拉底式 AI 教练进行 5 轮递进对话（流式回复）→ 一键生成读书小结 → 导出带出处的 Markdown 笔记。

## ✨ 功能特性

| 能力 | 说明 |
|---|---|
| 🔍 微信读书搜书 | 书名/作者搜索，返回封面、评分、评价人数；书卡可点击直达微信读书 |
| 🧠 全书结构思维导图 | 基于书籍简介 + 章节目录自动生成：非虚构 → 结构 mindmap，虚构 → 人物关系图（graph）；支持编辑 Mermaid、复制、导出 PNG |
| 💬 万人热门划线 | 全书划线热度排行，按划线人数排序多选 |
| 🗂 我的划线/想法 | **v1.2.0 新增**：一键切换拉取当前账号的划线 + 想法，围绕"自己真正标记过的话"对话 |
| 💡 苏格拉底式对话 | 5 轮递进提问（理解原文 → 联系自身 → 批判分析 → 实际应用 → 沉淀收获），**流式输出** |
| 💾 会话恢复 | **v1.2.0 新增**：对话进度自动保存本机，刷新页面一键恢复续问 |
| 📝 读书小结 | **v1.2.0 新增**：对话结束后按「核心观点 / 我的启发 / 可应用点」生成 300–500 字小结 |
| 📥 Markdown 笔记导出 | **v1.2.0 增强**：文件头含书名/作者/日期/评分，按章节分组并标注每条出处 |

## 🚀 快速开始（3 步）

> 3 步前提只有两个：本机 Node.js v16+，以及两个 Key（微信读书 API Key + 大模型 API Key）。Key 暂缺时应用仍能启动，只是对应功能不可用（见下方 FAQ）。

**第 1 步 · 准备 Node 环境**
确认本机已装 Node.js（v16+）：运行 `node --version`。未安装则先安装 Node。

**第 2 步 · 配置微信读书 API Key**
在 shell 配置中写入：`export WEREAD_API_KEY=你的key`（写入 `~/.zshrc` 或 `~/.bashrc`）。应用只读该值、绝不执行。

**第 3 步 · 启动并填入大模型 Key**
```bash
bash scripts/start.sh
```
脚本自动检查 Node、静态读取 Key、清理旧服务并打开浏览器；若未自动打开，手动访问 `http://localhost:3456`。首次打开后在右上角「⚙️ 设置」中填入大模型 API Key（支持智谱 GLM / DeepSeek / 自定义 OpenAI 兼容端点，Key 仅存浏览器 localStorage），然后搜一本书即可开始。

> 停止服务：在运行终端按 `Ctrl+C`，或另开终端执行 `bash scripts/stop.sh`（只停本应用进程）。
> 健康检查：访问 `http://localhost:3456/api/status` 应返回 `{"ok":true,"weread":true/false}`（`weread` 为 false 即微信 Key 未生效）。

## 🧭 使用路径

**完整路径：搜书 → 全书导图 → 多选划线 → 引导对话 → 读书小结 → 导出笔记**

1. 输入书名搜索，结果上方自动生成全书思维导图
2. 在「💬 热门划线 / 🗂 我的划线」之间切换，勾选感兴趣的段落（可多选）
3. 点击「💬 开始对话」，逐轮回答 AI 的苏格拉底式提问；中途刷新可点击顶部横幅「恢复会话」
4. 5 轮结束后点击「📝 生成读书小结」，再点击「📥 导出笔记」

**轻量路径：只做思维导图** — 搜书后直接编辑/导出导图，无需进入对话。

## 📸 界面截图（待补充）

> 占位：本地跑起后补充 2–3 张真实截图（对话深读页 / 思维导图页）。当前不放占位图，避免冒充真实界面。

## 🔒 隐私与安全

- 服务只监听 `127.0.0.1:3456`，外网不可达；API Key 仅由本地服务进程读取
- 本地代理**只放行 6 个只读接口**（搜书/书籍信息/章节目录/热门划线/我的划线/我的想法），其余一律拒绝
- 大模型 Key 与会话进度仅存浏览器 localStorage，不经过任何第三方服务器
- 页面不加载任何第三方 CDN 脚本（Mermaid 已本地打包），Mermaid 渲染禁用脚本执行
- 导出的笔记含书籍原文，**仅供个人学习**，请勿公开传播

## ❓ 常见问题

**1. Key 未配置怎么办？相关功能点了没反应？**
两个 Key 各自对应一组功能，缺哪个补哪个：
- 微信读书 Key（`WEREAD_API_KEY`）未配置 → 搜书、热门划线、我的划线/想法不可用（搜索会失败 / errcode 非 0）。解决：在 `~/.zshrc` 或 `~/.bashrc` 写入 `export WEREAD_API_KEY=你的key`，然后重新运行 `bash scripts/start.sh`。
- 大模型 Key 未配置 → 思维导图、苏格拉底对话、读书小结不可用（导图区提示"还没有配置 API Key"）。解决：首次打开应用后点右上角「⚙️ 设置」，填入智谱 GLM 或 DeepSeek 的 API Key；Key 仅存浏览器 localStorage，可在设置中一键清除。

**2. 对 Node 环境有什么要求？还要装别的依赖吗？**
需要 Node.js v16+（用 `node --version` 检查），这是唯一环境要求。**没有其它安装依赖**：Mermaid 渲染库已本地打包在 `assets/mermaid.min.js`，页面不加载任何第三方 CDN 脚本。

**3. 导出的笔记能公开传播或商用吗？**
不能。导出的 Markdown 笔记含书籍原文划线，属于受版权保护内容，**仅供个人学习使用，请勿公开传播**（README、SKILL 与 LICENSE 均作此声明）。另外请注意：对话/导图会把勾选的划线原文发送给你自己选择的大模型供应商（智谱 / DeepSeek），这是功能所需。

**4. 为什么页面提示"无法连接到本地服务"？**
因为必须在**运行 `scripts/start.sh` 的同一台本机**上、用浏览器访问 `http://localhost:3456`。服务只监听 `127.0.0.1`，在远程环境、沙箱或 Preview 面板中打开都会失败；本应用设计为在用户本地机器运行，无法远程启动后共享访问。

## 📁 项目结构

```
weread-socrates/
├── SKILL.md                  # Skill 元数据与使用说明（OpenClaw/ClawHub 入口）
├── skill-card.md             # ClawHub 商店卡片
├── assets/
│   ├── ai-reading-companion.html   # 前端单页应用（全部逻辑内联）
│   ├── server.js             # 本地服务：微信读书 API 代理 + 静态文件服务
│   └── mermaid.min.js        # 本地打包的 Mermaid 渲染库
├── references/
│   └── weread-api.md         # 微信读书 Agent API 接口参考（新增接口先看这里）
└── scripts/
    ├── start.sh              # 启动（检查环境 → 静态读取 Key → 拉起服务 → 开浏览器）
    └── stop.sh               # 按 PID 精准停止
```

## 🛠 开发说明

- 新增微信读书接口时：`assets/server.js` 的 `ALLOWED_APIS` 白名单 + `references/weread-api.md` 同步更新（白名单同时承担入参裁剪与接口拒绝）
- 网关请求须携带官方 `skill_version`（对应官方 weread-skills 包版本 `WEREAD_OFFICIAL_SKILL_VERSION`，**与本地版本无关**，官方升级后需同步）
- 语法检查：`node --check assets/server.js`

## 📄 版本历史

- **v1.2.0** — 个人划线/想法接入（热门/我的一键切换）、流式对话输出、会话刷新恢复、读书小结、笔记导出出处元数据与章节分组、API 白名单补全 `/book/chapterinfo`（修复搜索 403）、错误处理与状态收敛重构
- **v1.1.2** — XSS/扫描残留警告修复
- **v1.1.1** — 安全加固
- **v1.1.0** — 通过 ClawHub 安全审核
- **v1.0.0** — 首个版本

## ⚖️ License

代码基于 MIT License 开源（见 [LICENSE](LICENSE)）。**注意**：导出的笔记/对话内容可能包含受版权保护的书籍原文，仅供个人学习使用，请勿公开传播。

## 📬 链接

- GitHub：[bonniegeng-max/weread-socrates](https://github.com/bonniegeng-max/weread-socrates)
- ClawHub：[weread-socrates](https://clawhub.ai/bonniegeng-max/skills/weread-socrates)
