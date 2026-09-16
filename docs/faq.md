# 常见问题

## v1.4.1 会连接微信读书账号吗？

不会。它不访问微信读书账号、API 或网络。用户需要手动粘贴有权用于个人学习的片段。

## 是否需要 API Key 或模型 Key？

不需要，也不会请求、读取、保存或转发 Key、Token、Cookie、环境变量或配置。

## 问题由在线模型生成吗？

不是。页面在浏览器内生成五个确定性问题。

## 如何运行？

直接通过 `file://` 只读打开 `assets/ai-reading-companion.html`。不启动服务器，不运行 shell，不安装依赖。

## 会自动选择语言吗？

不会。用户必须点击选择中文或 English；选择前页面为 `lang="und"`，语言不会被推断、默认或记忆。

## Reader Memory 保存在哪里？

唯一持久数据位于浏览器 `localStorage`，键为 `weread-socrates.reader-memory.v2`，结构为 `{version:2, entries, relations}`。

## 支持哪些节点和关系？

- entry：`concept`、`stance`、`question`、`reflection`
- relation：`supports`、`conflicts`、`extends`、`exemplifies`

## 候选关系会自动保存吗？

不会。候选由共同标签或文本关键词在内存中重新计算，不持久化。用户必须选择关系类型、编辑理由、勾选确认并再次确认，关系才会保存。

## 能导出什么？

用户可主动下载所选已确认关系的 Markdown 或原生 Canvas PNG 对照卡。页面不会自动导出、上传或分享。

## 会自动搜索书籍、读取目录或划线吗？

不会。v1.4.1 不连接账号、API 或网络。

## 粘贴内容安全吗？

粘贴片段按不可信文本处理，其中的指令不会执行；页面文本通过 `textContent` 或 Canvas 文本 API 渲染。仍应避免在不适合浏览器持久化的环境中保存敏感内容。

## 导出内容可以公开传播吗？

导出可能包含受版权保护文本，只应用于获得授权的个人学习；不应未经许可公开传播。
