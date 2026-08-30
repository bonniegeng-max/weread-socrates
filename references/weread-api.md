# 微信读书 Agent API 参考

> 本文档从 `server.js` 代理逻辑和前端调用中提取整理，用于扩展或排查问题。
> 所有请求通过本地服务 `/api/weread` 转发到 `https://i.weread.qq.com/api/agent/gateway`。

## 认证方式

- Header: `Authorization: Bearer ${WEREAD_API_KEY}`
- 环境变量：`WEREAD_API_KEY`（在 `~/.zshrc` / `~/.bashrc` 中配置）

## 请求格式

```json
{
  "api_name": "/store/search",
  "skill_version": "1.0.4",
  "...其他参数": "..."
}
```

`skill_version` 由服务端自动注入，前端调用时无需传入。

## 接口列表

### 1. 搜索书籍 `/store/search`

搜索微信读书库中的书籍。

**参数：**
| 字段 | 类型 | 说明 |
|---|---|---|
| keyword | string | 搜索关键词（书名/作者） |
| count | number | 返回结果数量，建议 3 |

**返回关键字段：**
```
results[].books[].bookInfo
  ├── bookId      书籍ID（后续接口必需）
  ├── title       书名
  ├── author      作者
  ├── cover       封面图URL
  ├── newRating   评分（×10，如 85 表示 8.5 分）
  └── newRatingCount  评价人数
```

### 2. 获取书籍信息 `/book/info`

获取书籍简介等详细信息。

**参数：**
| 字段 | 类型 | 说明 |
|---|---|---|
| bookId | string | 从搜索结果获取 |

**返回关键字段：**
- `intro`：书籍简介（用于思维导图生成的上下文）

### 3. 获取章节目录 `/book/chapterinfo`

获取全书章节结构。

**参数：**
| 字段 | 类型 | 说明 |
|---|---|---|
| bookId | string | 书籍ID |

**返回关键字段：**
```
chapters[]
  ├── chapterUid   章节唯一ID
  ├── chapterIdx   章节序号
  ├── title        章节标题
  └── level        层级（1=一级标题，2=二级...）
```

### 4. 获取热门划线 `/book/bestbookmarks`

获取全书被划线最多的段落（万人划线）。

**参数：**
| 字段 | 类型 | 说明 |
|---|---|---|
| bookId | string | 书籍ID |
| chapterUid | number | 0 表示获取全书划线 |
| synckey | number | 同步游标，首次传 0 |

**返回关键字段：**
```
items[]
  ├── markText     划线原文
  ├── totalCount   划线人数（热度指标）
  ├── chapterUid   所属章节ID
  └── range         划线在章节中的位置范围

chapters[]
  ├── chapterUid   章节ID
  └── title        章节标题（用于映射划线所属章节）
```

## 本地服务端点

| 端点 | 方法 | 说明 |
|---|---|---|
| `/api/weread` | POST | 微信读书 API 代理，body 为 `{ api_name, ...params }` |
| `/api/status` | GET | 服务状态检查，返回 `{ ok, weread }` |
| `/` | GET | 返回前端页面 |

## 常见错误

| 现象 | 原因 | 解决 |
|---|---|---|
| `errcode` 非 0 | API Key 无效或过期 | 检查 `WEREAD_API_KEY` |
| 502 Bad Gateway | 无法连接微信读书服务器 | 检查网络连接 |
| 搜索结果为空 | 书名拼写错误或该书未上架 | 换关键词或确认书名 |
