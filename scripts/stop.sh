#!/bin/bash
# ============================================================
# weread-socrates · 停止服务脚本
# 用法：bash stop.sh
# ============================================================
PORT=3456

echo "🛑 正在停止 AI 伴读服务（端口 ${PORT}）..."

if command -v lsof &>/dev/null; then
  PIDS=$(lsof -ti :"$PORT" 2>/dev/null)
  if [ -n "$PIDS" ]; then
    echo "$PIDS" | xargs kill -9 2>/dev/null
    echo "✅ 已停止进程：$PIDS"
  else
    echo "ℹ️  端口 ${PORT} 未被占用，服务未在运行"
  fi
elif command -v fuser &>/dev/null; then
  fuser -k "${PORT}/tcp" 2>/dev/null && echo "✅ 已停止" || echo "ℹ️  服务未在运行"
else
  echo "⚠️  未找到 lsof 或 fuser，请手动执行："
  echo "   kill \$(lsof -ti :${PORT})"
fi
