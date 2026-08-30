#!/bin/bash
# ============================================================
# weread-socrates · AI 伴读启动脚本
# 用法：bash start.sh
# ============================================================
set -e

# 定位到 Skill 根目录（scripts/ 的上一级）
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SKILL_DIR"

PORT=3456

# ---------- 1. 检查 Node.js ----------
if ! command -v node &>/dev/null; then
  echo "❌ 未检测到 Node.js，请先安装：https://nodejs.org/"
  exit 1
fi
echo "✅ Node.js $(node --version)"

# ---------- 2. 检查微信读书 API Key ----------
if [ -z "$WEREAD_API_KEY" ]; then
  # 尝试从常见配置文件加载
  for rcfile in ~/.zshrc ~/.bashrc ~/.bash_profile ~/.profile; do
    if [ -f "$rcfile" ]; then
      # shellcheck disable=SC1090
      source "$rcfile" 2>/dev/null
    fi
  done
fi
if [ -z "$WEREAD_API_KEY" ]; then
  echo "⚠️  未检测到 WEREAD_API_KEY，微信读书搜索功能将不可用"
  echo "   配置方式：在 ~/.zshrc 或 ~/.bashrc 中添加"
  echo "   export WEREAD_API_KEY=你的微信读书API Key"
else
  echo "✅ 微信读书 API Key 已配置"
fi

# ---------- 3. 释放端口 ----------
if command -v lsof &>/dev/null; then
  lsof -ti :"$PORT" | xargs kill -9 2>/dev/null || true
elif command -v fuser &>/dev/null; then
  fuser -k "${PORT}/tcp" 2>/dev/null || true
fi
sleep 0.5

# ---------- 4. 启动服务 ----------
echo ""
echo "🚀 启动 AI 伴读服务（weread-socrates）..."
echo "   访问地址：http://localhost:${PORT}"
echo "   停止服务：按 Ctrl+C，或运行 bash scripts/stop.sh"
echo ""

node assets/server.js
