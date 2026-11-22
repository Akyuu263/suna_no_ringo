# 系统架构

## 已确定
- 后端语言：Rust
- HTTP 框架：Axum
- 前后端通过明确的 API 契约通信
- 先实现 Web，后续支持多端

## 当前建议（尚待确认）
- 模块化单体架构
- Monorepo 项目组织
- Web：React + TypeScript
- OpenAPI 描述 HTTP 接口

## 尚未决策
- 数据库与迁移方案
- 认证和会话机制
- 图片存储与分发
- 缓存与部署方案

Agent 不得将建议自动视为最终决策。
