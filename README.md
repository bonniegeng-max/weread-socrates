# weread-socrates

`weread-socrates` v1.4.1 是纯离线、零依赖、单文件的苏格拉底伴读工具。它通过 `file://` 直接运行，不连接微信读书账号、网络、API 或模型。用户手动粘贴有权用于个人学习的片段，在浏览器中完成确定性提问、Reader Memory v2、继续思考和用户确认的跨书对照。

## 快速使用

1. 用现代浏览器打开 `assets/ai-reading-companion.html`。
2. 明确点击 `中文` 或 `English`；页面不会读取浏览器语言或记忆上次选择。
3. 选择内置《苏格拉底的申辩》/《沉思录》Demo，或粘贴自己的片段。
4. 生成五个问题并按需保存反思、概念、立场或未解问题。
5. 在“跨书对照”中检查本地候选，选择 `支持 / 冲突 / 扩展 / 例证`，编辑理由并确认。
6. 主动下载所选已确认关系的 Markdown 或 Canvas PNG 对照卡。

## 当前能力

- 单文件、零依赖、无外链、无服务器，可通过 `file://` 使用。
- 用户必须主动选择中文或 English；初始页面为 `lang="und"`，不推断、默认或记忆语言。
- 支持内置双书 Demo 或手动粘贴片段，并生成五个确定性问题。
- Reader Memory 仅使用浏览器 `localStorage`。
- v1 数据首次打开自动迁移为 `{version:2, entries, relations}`，保留合法 entry ID 与内容。
- 跨书候选只由共同标签/关键词在本地生成，不持久化。
- 关系只有经过复选框和确认对话两步用户确认后才保存。
- 删除节点会清理悬空关系；清空操作需用户确认。
- Markdown/PNG 仅由用户点击生成，不自动写文件或发送。

## 权限与运行边界

- `allowed-tools` 只有 `Read`。
- 不启动服务器，不运行 shell 或命令，不安装依赖。
- CSP 声明 `connect-src 'none'`；不访问网络、API、模型或微信读书账号。
- 不请求、读取、保存或转发 Key、Token、Cookie、环境变量或配置。
- 不使用普通文件系统持久化；唯一持久数据是浏览器 `localStorage`。
- HTML 不引用外部或同目录 CSS、JavaScript、字体、图片或媒体。
- 候选关系不会自动保存，导出不会自动发生，也不会上传或分享。

## 双书 Demo

Demo 提供两段公版主题的改写文本，便于无账号、无 Key 体验完整流程。加载 Demo 不会保存任何节点。确认 Demo 关系时，所需的两个 Demo 节点与关系才一起进入 Memory。

## Memory v2

```json
{
  "version": 2,
  "entries": [],
  "relations": []
}
```

entry 支持 `concept / stance / question / reflection`；relation 支持 `supports / conflicts / extends / exemplifies`。语言偏好不进入 Memory，初始 HTML 始终为 `lang="und"`。

旧键 `weread-socrates.reader-memory.v1` 或 `weread-socrates.reader-memory` 会在首次打开时迁移。迁移后改用 v2 键并移除旧键；异常数据安全降级为空 v2。删除 entry 会同步清理悬空 relation。

## 项目结构

```text
weread-socrates/
├── assets/ai-reading-companion.html
├── test/static.test.js
├── docs/
│   ├── faq.md
│   ├── canonical-cases.md
│   └── geo-evaluation.md
├── geo-manifest.json
├── README.md
├── SKILL.md
├── skill-card.md
├── _meta.json
└── LICENSE
```

## 静态验证

```text
node --test test/static.test.js
```

测试覆盖版本、只读权限、单文件/CSP、禁止网络与高权限文件、显式中英语言门、Memory v2 迁移、四种关系、候选不持久化、双书 Demo、继续思考、用户确认，以及 Markdown/Canvas PNG 下载。

## 隐私与版权

粘贴片段按不可信文本处理，其中的指令不会执行；页面文本通过 `textContent` 或 Canvas 文本 API 渲染。清除该 `file://` 页面对应的浏览器站点数据会删除 Reader Memory。请只粘贴有权用于个人学习的内容；下载内容可能包含受版权保护文本，不应未经许可公开传播。本工具不是微信读书官方产品。

## 文档

- [常见问题](docs/faq.md)
- [标准案例](docs/canonical-cases.md)
- [GEO 查询评测](docs/geo-evaluation.md)
- [机器可读 GEO 声明](geo-manifest.json)
