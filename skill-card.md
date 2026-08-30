## Description: <br>
启动并使用"AI 伴读 · 苏格拉底式阅读教练"本地 Web 应用。对接微信读书 API，支持搜书、自动生成全书结构思维导图（非虚构→mindmap，虚构→人物关系图）、万人热门划线多选、苏格拉底式 5 轮递进引导对话、Markdown 笔记导出。 <br>

This skill is ready for commercial/non-commercial use. <br>

## Publisher: <br>
[Bonnie Geng](https://clawhub.ai/bonniegeng-max) <br>

### License/Terms of Use: <br>

Personal learning use. Exported notes contain copyrighted book excerpts — do not redistribute publicly. <br>

## Use Case: <br>
读者希望对一本书建立全局结构认知并对重点划线做深度内化时，使用本 skill 在本地启动一个阅读教练 Web 应用：搜书 → 生成全书思维导图 → 勾选万人热门划线 → 进行 5 轮苏格拉底式引导对话 → 导出 Markdown 笔记。 <br>

### Deployment Geography for Use: <br>
Local machine only (localhost:3456). Not designed for remote/sandbox deployment. <br>

## Known Risks and Mitigations: <br>
Risk: 对话时勾选的划线原文会发送给用户选择的大模型供应商（智谱 / DeepSeek）。 <br>
Mitigation: 设置弹窗中有明确的隐私提示；用户可自行选择供应商，也可只使用不需大模型的搜书/划线功能。 <br>
Risk: 大模型 API Key 保存在浏览器 localStorage。 <br>
Mitigation: Key 不经过任何第三方服务器；设置弹窗提供一键「清除已保存的 Key」。 <br>
Risk: 微信读书 API Key 由本地服务进程读取。 <br>
Mitigation: 本地代理仅放行搜书、书籍信息、热门划线三个只读接口，其余请求一律拒绝；服务只监听本机端口。 <br>
Risk: 导出的笔记含书籍原文。 <br>
Mitigation: 导出时提示内容仅供个人学习，请勿公开传播。 <br>

## Reference(s): <br>
- [weread-socrates on ClawHub](https://clawhub.ai/bonniegeng-max/skills/weread-socrates) <br>
- [GitHub repository](https://github.com/bonniegeng-max/weread-socrates) <br>
- [Publisher profile: Bonnie Geng](https://clawhub.ai/bonniegeng-max) <br>

## Skill Output: <br>
**Output Type(s):** [Local web app, Guidance] <br>
**Output Format:** [Locally served HTML app with Mermaid diagrams and Markdown note export] <br>
**Output Parameters:** [localhost:3456] <br>
**Other Properties Related to Output:** [All processing happens on the user's machine; LLM calls go directly from the browser to the user-chosen provider.] <br>

## Skill Version(s): <br>
1.1.0 (source: SKILL.md frontmatter) <br>

## Ethical Considerations: <br>
Exported notes contain copyrighted material and are for personal study only. Users should review any generated mindmaps or dialogue summaries before relying on them, and stop the local service when finished. <br>
